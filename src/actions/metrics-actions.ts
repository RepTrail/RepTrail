'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } from 'date-fns'

import { formatToBrazilDate } from '@/lib/date-utils'

/** Adherence = Average of (diet, workout, cardio) progress per day. Synchronized with daily_tracking. */
export async function getAdherenceForDates(
    studentId: string,
    dateStrings: string[]
): Promise<{ date: string; adherence: number }[]> {
    if (dateStrings.length === 0) return []

    const supabase = await createAdminClient()

    // 1. Determine Effective Start Date in parallel
    const [
        { data: profile },
        { data: trainerLink }
    ] = await Promise.all([
        supabase.from('profiles').select('created_at').eq('id', studentId).single(),
        supabase.from('trainer_students').select('created_at').eq('student_id', studentId).eq('active', true).maybeSingle()
    ])

    const profileCreatedStr = profile?.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '2000-01-01'
    const linkDateStr = trainerLink?.created_at ? new Date(trainerLink.created_at).toISOString().split('T')[0] : '2000-01-01'

    // Use the later of the two dates as the effective start
    const effectiveStartStr = linkDateStr > profileCreatedStr ? linkDateStr : profileCreatedStr

    // Filter dates to only include those on or after effective start
    const applicableDates = dateStrings.filter(d => d >= effectiveStartStr)

    if (applicableDates.length === 0) return []

    const sortedDates = [...new Set(applicableDates)].sort()
    const minDate = sortedDates[0]
    const maxDate = sortedDates[sortedDates.length - 1]

    const searchMin = minDate + 'T00:00:00-03:00'
    const searchMax = maxDate + 'T23:59:59-03:00'

    // 2. Fetch everything in parallel
    const [
        { data: tracking },
        { data: wLogs },
        { data: cLogs },
        { data: eLogs },
        { data: aw },
        { data: ac },
        { data: ad },
        { data: ae },
        { data: details }
    ] = await Promise.all([
        supabase.from('daily_tracking').select('*').eq('user_id', studentId).gte('date', minDate).lte('date', maxDate),
        supabase.from('workout_logs').select('started_at, status').eq('student_id', studentId).eq('status', 'completed').gte('started_at', searchMin).lte('started_at', searchMax),
        supabase.from('cardio_logs').select('started_at, status, elapsed_seconds, assignment:assigned_cardios(duration_minutes)').eq('student_id', studentId).in('status', ['completed', 'in_progress']).gte('started_at', searchMin).lte('started_at', searchMax),
        supabase.from('ergogenic_logs').select('created_at').eq('student_id', studentId).gte('created_at', searchMin).lte('created_at', searchMax),
        supabase.from('assigned_workouts').select('day_of_week').eq('student_id', studentId).neq('active', false),
        supabase.from('assigned_cardios').select('days_of_week').eq('student_id', studentId).neq('active', false),
        supabase.from('assigned_diets').select('id').eq('student_id', studentId).neq('active', false),
        supabase.from('ergogenics').select('application_days').eq('student_id', studentId),
        supabase.from('student_details').select('steroid_use').eq('id', studentId).single()
    ])

    // Map logs to YYYY-MM-DD keys
    const workoutDates = new Set(wLogs?.map(l => formatToBrazilDate(l.started_at)))
    const ergoDates = new Set(eLogs?.map(l => formatToBrazilDate(l.created_at)))

    // Process Cardio Logs
    const cardioDataMap = new Map<string, { status: string, percentage: number }>()
    cLogs?.forEach((l: any) => {
        const dateKey = formatToBrazilDate(l.started_at)
        const targetSeconds = (l.assignment?.duration_minutes || 30) * 60
        const percentage = Math.min(Math.round((l.elapsed_seconds / targetSeconds) * 100), 100)
        const existing = cardioDataMap.get(dateKey)
        if (!existing || percentage > existing.percentage) {
            cardioDataMap.set(dateKey, { status: l.status, percentage })
        }
    })

    const steroidUse = !!details?.steroid_use
    const workoutDays = new Set((aw || []).map((a: any) => a.day_of_week))

    const cardioDays = new Set<number>()
    if (ac) {
        ac.forEach((a: any) => {
            if (a.days_of_week && Array.isArray(a.days_of_week)) {
                a.days_of_week.forEach((d: number) => cardioDays.add(d))
            } else if (a.day_of_week !== undefined && a.day_of_week !== null) {
                cardioDays.add(a.day_of_week)
            }
        })
    }

    const ergoDays = new Set<number>()
    if (ae) {
        ae.forEach((a: any) => {
            if (a.application_days && Array.isArray(a.application_days)) {
                a.application_days.forEach((d: number) => ergoDays.add(d))
            }
        })
    }

    const hasDiet = (ad?.length ?? 0) > 0

    return sortedDates.map(dateStr => {
        const day = tracking?.find(t => t.date === dateStr)
        const d = new Date(dateStr + 'T12:00:00')
        const dow = d.getDay() // 0-6

        let possible = 0
        let points = 0

        // --- RULE 2: Diet (Always Counted from Tracking) ---
        if (hasDiet) {
            possible += 1
            if (day) {
                points += (day.diet_percentage || 0) / 100
            } else {
                points += 0
            }
        }

        // --- RULE 3: Workout (Check Logs OR Tracking) ---
        const doneWorkout = workoutDates.has(dateStr) || day?.workout_status === 'completed'
        const isPartialWorkout = day?.workout_status === 'partial'

        if (workoutDays.has(dow) || doneWorkout || isPartialWorkout) {
            possible += 1
            if (doneWorkout) points += 1
            else if (isPartialWorkout) points += (day.workout_percentage || 0) / 100
        }

        // --- RULE 4: Cardio (Check Logs OR Tracking) ---
        const logData = cardioDataMap.get(dateStr)
        const doneCardio = logData?.status === 'completed' || day?.cardio_status === 'completed'
        const isPartialCardio = logData?.status === 'in_progress' || day?.cardio_status === 'partial'

        let cardioPts = 0
        if (doneCardio) cardioPts = 1
        else if (isPartialCardio) {
            const trackPct = (day?.cardio_percentage || 0) / 100
            const logPct = (logData?.percentage || 0) / 100
            cardioPts = Math.max(trackPct, logPct)
        }

        if (cardioDays.has(dow) || doneCardio || isPartialCardio) {
            possible += 1
            points += cardioPts
        }

        // --- RULE 5: Ergogenics (Check Logs OR Tracking) ---
        const doneErgo = ergoDates.has(dateStr) || day?.ergogenics_status === 'completed'
        const isPartialErgo = day?.ergogenics_status === 'partial'

        if ((steroidUse && ergoDays.has(dow)) || (steroidUse && (doneErgo || isPartialErgo))) {
            possible += 1
            if (doneErgo) points += 1
            else if (isPartialErgo) {
                let assignedErgosCount = 0
                if (ae) {
                    ae.forEach((a: any) => {
                        let days = a.application_days
                        if (typeof days === 'string') {
                            try { days = JSON.parse(days) } catch { days = [] }
                        }
                        if (Array.isArray(days) && days.map(Number).includes(dow)) {
                            assignedErgosCount++
                        }
                    })
                }
                const trackingPct = day?.ergogenics_percentage
                let calculatedPct = 0
                if (trackingPct !== undefined && trackingPct !== null && trackingPct > 0) {
                    calculatedPct = trackingPct
                } else if (assignedErgosCount > 0) {
                    const dayLogsCount = eLogs?.filter(l => formatToBrazilDate(l.created_at) === dateStr).length || 0
                    calculatedPct = Math.min(Math.round((dayLogsCount / assignedErgosCount) * 100), 100)
                } else {
                    calculatedPct = 50 // fallback for partial
                }
                points += calculatedPct / 100
            }
        }

        // --- RULE 6: Calculation ---
        // If no tasks valid/scheduled for today, assume full adherence (nothing to fail).
        // OR return null? The prompt says "Definir performance como null ou não plotar ponto".
        // However, existing charts expect a number. 
        // If possible is 0 (Rest day with no diet plan?), usually 100% or null.
        // Given 'hasDiet' is usually true, possible is rarely 0.
        // If possible is 0, let's return 0 or null?
        // Let's stick to: "Se não houver nenhuma tarefa válida... Definir performance como null".
        // But for chart continuity (since return type is number), let's perform a safety check.
        // Since adherence is 0-100, if possible=0, it's technically N/A. 
        // Let's default to 100 (Rest success) if day exists, or maybe just 0. 
        // Actually, if it's a rest day (no diet, no workout, no cardio), they adhered to the plan of doing nothing. -> 100.

        if (possible === 0) return null

        const adherence = Math.round((points / possible) * 100)
        return { date: dateStr, adherence }
    }).filter(Boolean) as { date: string; adherence: number }[]
}

export async function getStudentMetricsHistory(studentId: string) {
    const supabase = await createAdminClient()

    const [
        { data: weights },
        { data: bfs }
    ] = await Promise.all([
        supabase.from('weight_history').select('weight_kg, recorded_at').eq('student_id', studentId).order('recorded_at', { ascending: true }),
        supabase.from('bf_history').select('bf_percentage, recorded_at').eq('student_id', studentId).order('recorded_at', { ascending: true })
    ])

    return {
        weights: weights || [],
        bfs: bfs || []
    }
}

export async function getWeeklyVolume(studentId: string) {
    const supabase = await createAdminClient()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: loads } = await supabase
        .from('load_history')
        .select('weight_kg, reps_performed')
        .eq('student_id', studentId)
        .gte('recorded_at', sevenDaysAgo.toISOString())

    if (!loads) return 0

    const totalWeight = loads.reduce((acc, load) => acc + (load.weight_kg * load.reps_performed), 0)
    return totalWeight / 1000 // Return in tons
}

export async function getStudentStreak(studentId: string) {
    const supabase = await createAdminClient()
    const { data: logs } = await supabase
        .from('workout_logs')
        .select('started_at')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .order('started_at', { ascending: false })

    if (!logs || logs.length === 0) return 0

    let streak = 0
    let lastDate = new Date()
    lastDate.setHours(0, 0, 0, 0)

    // Simplified streak: just consecutive days with at least one workout
    const dates = [...new Set(logs.map(log => {
        const d = new Date(log.started_at)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
    }))]

    for (let i = 0; i < dates.length; i++) {
        const checkDate = new Date()
        checkDate.setDate(checkDate.getDate() - i)
        checkDate.setHours(0, 0, 0, 0)

        if (dates.includes(checkDate.getTime())) {
            streak++
        } else if (i === 0) {
            // If didn't work out today, check if worked out yesterday to keep streak
            continue
        } else {
            break
        }
    }

    return streak
}

export async function getMonthlyWorkoutCount(studentId: string) {
    const supabase = await createAdminClient()
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .gte('started_at', startOfMonth.toISOString())

    return count || 0
}

export async function getTrainingFrequency(studentId: string, weeks: number = 4) {
    const supabase = await createAdminClient()
    const now = new Date()
    const startDate = subWeeks(now, weeks)

    const { data: logs } = await supabase
        .from('workout_logs')
        .select('started_at')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .gte('started_at', startDate.toISOString())

    // Group by week
    const frequencyByWeek = []
    for (let i = 0; i < weeks; i++) {
        const weekStart = startOfWeek(subWeeks(now, i))
        const weekEnd = endOfWeek(weekStart)

        const sessionsInWeek = logs?.filter(log => {
            const date = new Date(log.started_at)
            return date >= weekStart && date <= weekEnd
        }).length || 0

        frequencyByWeek.unshift({
            week: format(weekStart, 'dd/MM'),
            date: weekStart.toISOString(),
            sessions: sessionsInWeek
        })
    }

    return frequencyByWeek
}

export async function getLoadProgression(studentId: string, exerciseId?: string) {
    const supabase = await createAdminClient()

    let query = supabase
        .from('load_history')
        .select(`
            weight_kg,
            reps_performed,
            recorded_at,
            exercise_id,
            exercises(name)
        `)
        .eq('student_id', studentId)
        .order('recorded_at', { ascending: true })

    if (exerciseId) {
        query = query.eq('exercise_id', exerciseId)
    }

    const { data, error } = await query
    if (error) throw error

    // Group by exercise if no exerciseId provided, or just return flat if it is
    return data || []
}

/** Chart data with real dates (weight/BF) and adherence-based frequency. */
export async function getStudentChartData(studentId: string) {
    const { weights, bfs } = await getStudentMetricsHistory(studentId)

    // 1. Determine Earliest Date
    // Default to 60 days ago
    let startTimestamp = new Date().getTime() - (60 * 24 * 60 * 60 * 1000)

    // If history goes further back, expand the range
    if (weights.length > 0) {
        const firstW = new Date(weights[0].recorded_at).getTime()
        if (firstW < startTimestamp) startTimestamp = firstW
    }
    if (bfs.length > 0) {
        const firstB = new Date(bfs[0].recorded_at).getTime()
        if (firstB < startTimestamp) startTimestamp = firstB
    }

    const startDate = new Date(startTimestamp)
    const endDate = new Date()

    // 2. Generate ALL dates in the interval Day-by-Day
    const dateKeys = eachDayOfInterval({ start: startDate, end: endDate })
        .map(d => formatToBrazilDate(d.toISOString()))

    // 3. Calculate adherence for the full range
    const adherence = await getAdherenceForDates(studentId, dateKeys)

    // Map each date to a timestamp for the line chart
    const dateToTimestamp = new Map<string, number>()

    // Priority timestamps from metrics
    for (const w of weights) {
        const key = formatToBrazilDate(w.recorded_at)
        const t = new Date(w.recorded_at).getTime()
        const cur = dateToTimestamp.get(key)
        if (!cur || t > cur) dateToTimestamp.set(key, t)
    }
    for (const b of bfs) {
        const key = formatToBrazilDate(b.recorded_at)
        const t = new Date(b.recorded_at).getTime()
        const cur = dateToTimestamp.get(key)
        if (!cur || t > cur) dateToTimestamp.set(key, t)
    }

    const frequency = adherence.map(({ date, adherence: a }) => {
        const ts = dateToTimestamp.get(date) ?? new Date(date + 'T12:00:00').getTime()
        return {
            week: format(new Date(ts), 'dd/MM'),
            date: new Date(ts).toISOString(),
            sessions: a
        }
    })

    return { weights, bfs, frequency }
}

export async function getStudentFullMetrics(studentId: string) {
    const supabase = await createAdminClient()

    // getStudentChartData already calls getStudentMetricsHistory internally
    const chartData = await getStudentChartData(studentId)
    const loadProgression = await getLoadProgression(studentId)

    const { data: details } = await supabase
        .from('student_details')
        .select('body_fat, steroid_use')
        .eq('id', studentId)
        .single()

    return {
        weights: chartData.weights,
        bfs: chartData.bfs,
        frequency: chartData.frequency,
        loadProgression,
        details
    }
}

export async function getMetricsSummary(studentId: string) {
    const supabase = await createAdminClient()
    
    // Fetch History & Details
    const [
        { data: weights },
        { data: bfs },
        { data: details }
    ] = await Promise.all([
        supabase.from('weight_history').select('weight_kg').eq('student_id', studentId).order('recorded_at', { ascending: false }).limit(1),
        supabase.from('bf_history').select('bf_percentage').eq('student_id', studentId).order('recorded_at', { ascending: false }).limit(1),
        supabase.from('student_details').select('body_fat').eq('id', studentId).single()
    ])

    return {
        latestWeight: weights?.[0]?.weight_kg || null,
        latestBF: bfs?.[0]?.bf_percentage || details?.body_fat || null
    }
}

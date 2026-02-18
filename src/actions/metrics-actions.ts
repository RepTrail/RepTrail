'use server'

import { createClient } from '@/lib/supabase/server'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, subWeeks } from 'date-fns'

function toDateKey(isoOrDate: string): string {
    return format(new Date(isoOrDate), 'yyyy-MM-dd')
}

/** Adherence = (diet + workout + cardio done) / (diet + workout + cardio planned) per day. Misses lower the line. */
export async function getAdherenceForDates(
    studentId: string,
    dateStrings: string[]
): Promise<{ date: string; adherence: number }[]> {
    if (dateStrings.length === 0) return []

    const supabase = await createClient()
    const sortedDates = [...new Set(dateStrings.map(toDateKey))].sort()

    // Fetch assignments
    const { data: aw } = await supabase
        .from('assigned_workouts')
        .select('day_of_week')
        .eq('student_id', studentId)
        .eq('active', true)

    const { data: ac } = await supabase
        .from('assigned_cardios')
        .select('day_of_week')
        .eq('student_id', studentId)
        .eq('active', true)

    const { data: ad } = await supabase
        .from('assigned_diets')
        .select('id')
        .eq('student_id', studentId)
        .eq('active', true)

    const hasDiet = (ad?.length ?? 0) > 0
    const workoutDays = new Set((aw || []).map((a: { day_of_week: number }) => a.day_of_week).filter((d: number) => d != null))
    const cardioDays = new Set((ac || []).map((a: { day_of_week: number }) => a.day_of_week).filter((d: number) => d != null))

    // Fetch completed workouts (use completed_at when available, else started_at)
    const minDate = sortedDates[0]
    const maxDate = sortedDates[sortedDates.length - 1]
    const start = new Date(minDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(maxDate)
    end.setHours(23, 59, 59, 999)

    const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('started_at, completed_at, status')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString())

    const { data: cardioLogs } = await supabase
        .from('cardio_logs')
        .select('started_at, completed_at, status')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString())

    const { data: mealLogs } = await supabase
        .from('meal_logs')
        .select('consumed_at, check_status')
        .eq('student_id', studentId)
        .eq('check_status', true)
        .gte('consumed_at', start.toISOString())
        .lte('consumed_at', end.toISOString())

    const workoutDates = new Set(
        (workoutLogs || []).map((w: { completed_at?: string; started_at: string }) => {
            const d = w.completed_at ? new Date(w.completed_at) : new Date(w.started_at)
            return format(d, 'yyyy-MM-dd')
        })
    )
    const cardioDates = new Set(
        (cardioLogs || []).map((c: { completed_at?: string; started_at: string }) => {
            const d = c.completed_at ? new Date(c.completed_at) : new Date(c.started_at)
            return format(d, 'yyyy-MM-dd')
        })
    )
    const dietDates = new Set(
        (mealLogs || []).map((m: { consumed_at: string }) => format(new Date(m.consumed_at), 'yyyy-MM-dd'))
    )

    return sortedDates.map(dateStr => {
        const d = new Date(dateStr)
        const dayOfWeek = d.getDay()
        let planned = 0
        let done = 0

        if (workoutDays.has(dayOfWeek)) {
            planned++
            if (workoutDates.has(dateStr)) done++
        }
        if (cardioDays.has(dayOfWeek)) {
            planned++
            if (cardioDates.has(dateStr)) done++
        }
        if (hasDiet) {
            planned++
            if (dietDates.has(dateStr)) done++
        }

        const adherence = planned > 0 ? Math.round((done / planned) * 100) : 100
        return { date: dateStr, adherence }
    })
}

export async function getStudentMetricsHistory(studentId: string) {
    const supabase = await createClient()

    const { data: weights } = await supabase
        .from('weight_history')
        .select('weight_kg, recorded_at')
        .eq('student_id', studentId)
        .order('recorded_at', { ascending: true })

    const { data: bfs } = await supabase
        .from('bf_history')
        .select('bf_percentage, recorded_at')
        .eq('student_id', studentId)
        .order('recorded_at', { ascending: true })

    return {
        weights: weights || [],
        bfs: bfs || []
    }
}

export async function getWeeklyVolume(studentId: string) {
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()

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
    const dateKeys = [
        ...weights.map((w: { recorded_at: string }) => toDateKey(w.recorded_at)),
        ...bfs.map((b: { recorded_at: string }) => toDateKey(b.recorded_at))
    ]
    const adherence = await getAdherenceForDates(studentId, dateKeys)

    // Mapear cada data para o timestamp real (peso/BF) - alinha a adesão com as outras métricas no gráfico
    const dateToTimestamp = new Map<string, number>()
    for (const w of weights) {
        const key = toDateKey(w.recorded_at)
        const t = new Date(w.recorded_at).getTime()
        const cur = dateToTimestamp.get(key)
        if (!cur || t > cur) dateToTimestamp.set(key, t)
    }
    for (const b of bfs) {
        const key = toDateKey(b.recorded_at)
        const t = new Date(b.recorded_at).getTime()
        const cur = dateToTimestamp.get(key)
        if (!cur || t > cur) dateToTimestamp.set(key, t)
    }

    const frequency = adherence.map(({ date, adherence: a }) => {
        const ts = dateToTimestamp.get(date) ?? new Date(date).getTime()
        return {
            week: format(new Date(ts), 'dd/MM'),
            date: new Date(ts).toISOString(),
            sessions: a
        }
    })
    return { weights, bfs, frequency }
}

export async function getStudentFullMetrics(studentId: string) {
    const metrics = await getStudentMetricsHistory(studentId)
    const chartData = await getStudentChartData(studentId)
    const loadProgression = await getLoadProgression(studentId)

    return {
        ...metrics,
        frequency: chartData.frequency,
        loadProgression
    }
}

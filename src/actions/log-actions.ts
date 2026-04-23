'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { upsertDailyTracking } from '@/actions/tracking-actions'
import { getTodayRangeBrazil } from '@/lib/date-utils'

export async function startWorkoutLog(workoutId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
        // Check for existing in_progress log (within last 12 hours)
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        const { data: existing } = await supabase
            .from('workout_logs')
            .select('id')
            .eq('student_id', user.id)
            .eq('workout_id', workoutId)
            .eq('status', 'in_progress')
            .gt('started_at', twelveHoursAgo)
            .order('started_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (existing) {
            console.log('DEBUG: Resuming existing workout log:', existing.id)
            return { success: true, logId: existing.id, resumed: true }
        }

        const { data, error } = await supabase
            .from('workout_logs')
            .insert({
                student_id: user.id,
                workout_id: workoutId,
                status: 'in_progress',
                started_at: new Date().toISOString()
            })
            .select('id')
            .single()

        console.log('DEBUG: Started new workout log:', { data, error })

        if (error) throw error
        return { success: true, logId: data.id, resumed: false }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function recordSetLoad(data: {
    logId: string,
    exerciseId: string,
    weight: number,
    reps: number,
    setType?: string,
    notes?: string,
    subIndex?: number,
    groupId?: string
}) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('load_history')
            .insert({
                student_id: user.id,
                workout_log_id: data.logId,
                exercise_id: data.exerciseId,
                weight_kg: data.weight,
                reps_performed: data.reps,
                set_type: data.setType || 'WORKING',
                notes: data.notes,
                sub_index: data.subIndex,
                group_id: data.groupId,
                recorded_at: new Date().toISOString()
            })

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function finishWorkoutLog(id: string, feedback?: string, perceivedEffort?: number, adherenceStatus: 'success' | 'partial' | 'fail' = 'success') {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data: { user } = {} } = await supabase.auth.getUser()

    console.log(`DEBUG: Finalizing workout log: ${id}`, { feedback, perceivedEffort, adherenceStatus })

    try {
        const { data, error } = await supabase
            .from('workout_logs')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                feedback,
                perceived_effort: perceivedEffort,
                adherence_status: adherenceStatus
            })
            .eq('id', id)
            .select()

        console.log('DEBUG: Workout log update result:', { data, error })

        if (error) throw error

        // Update Adherence
        if (user) {
            const statusMap: Record<string, 'completed' | 'partial' | 'skipped'> = {
                'success': 'completed',
                'partial': 'partial',
                'fail': 'skipped'
            }
            const percentageMap: Record<string, number> = {
                'success': 100,
                'partial': 50,
                'fail': 0
            }

            await upsertDailyTracking(user.id, {
                workout_status: statusMap[adherenceStatus] || 'completed',
                workout_percentage: percentageMap[adherenceStatus] !== undefined ? percentageMap[adherenceStatus] : 100
            })

            revalidatePath('/dashboard/student')
            revalidatePath('/dashboard/student/progress')
        }

        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteWorkoutLog(logId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autorizado. Faça login novamente.' }
    }

    try {
        const { error, count } = await supabase
            .from('workout_logs')
            .delete({ count: 'exact' })
            .eq('id', logId)
            .eq('student_id', user.id)

        if (error) throw error

        if (count === 0) {
            return { error: 'O treino não pôde ser encontrado ou você não tem permissão para excluí-lo.' }
        }

        revalidatePath('/dashboard/trainer/students/[id]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentWorkoutHistory(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    // Basic validation to prevent UUID type errors in Supabase
    if (!studentId || studentId.length < 30) {
        console.warn('getStudentWorkoutHistory: Invalid or missing studentId:', studentId)
        return []
    }

    try {
        const { data: logs, error } = await supabase
            .from('workout_logs')
            .select(`
                id,
                student_id,
                started_at,
                completed_at,
                status,
                feedback,
                perceived_effort,
                workout:workouts(name),
                loads:load_history(
                    weight_kg,
                    reps_performed,
                    set_type,
                    notes,
                    exercise_id,
                    sub_index,
                    group_id,
                    exercise:exercises(id, name)
                )
            `)
            .eq('student_id', studentId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching workout history details:', error)
            return []
        }

        if (logs) {
            return logs.map((log: any) => {
                // Supabase joins can return arrays for 1:1 relations depending on the client/schema
                const workout = Array.isArray(log.workout) ? log.workout[0] : log.workout;

                return {
                    ...log,
                    workout: workout || { name: 'Treino' },
                    loads: (log.loads || []).map((load: any) => ({
                        ...load,
                        // handle exercise join which could also be an array
                        exercise: Array.isArray(load.exercise) ? load.exercise[0] : (load.exercise || { name: 'Exercício', id: load.exercise_id })
                    }))
                }
            })
        }

        return []
    } catch (e: any) {
        console.error('Exception in getStudentWorkoutHistory:', e)
        return []
    }
}

export async function saveWorkoutLogState(logId: string, state: any) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    try {
        const { error } = await supabase
            .from('workout_logs')
            .update({ current_state: state })
            .eq('id', logId)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentLastActivity(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // Fetch latest activity from all sources for this specific student
        const [workoutRes, mealRes, cardioRes, weightRes, photoRes] = await Promise.all([
            supabase
                .from('workout_logs')
                .select('completed_at, started_at, workout:workouts(name)')
                .eq('student_id', studentId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from('meal_logs')
                .select('consumed_at, meal:meals(name)')
                .eq('student_id', studentId)
                .eq('check_status', true)
                .order('consumed_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from('cardio_logs')
                .select('completed_at, started_at, assigned_cardio:assigned_cardios(cardio:cardios(name))')
                .eq('student_id', studentId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from('weight_history')
                .select('recorded_at, weight_kg')
                .eq('student_id', studentId)
                .order('recorded_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from('progress_photos')
                .select('created_at')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()
        ])

        // Collect all activities with timestamps
        const activities: Array<{ type: string, name: string, timestamp: string }> = []

        if (workoutRes.data) {
            const timestamp = workoutRes.data.completed_at || workoutRes.data.started_at
            if (timestamp) {
                const workout = Array.isArray(workoutRes.data.workout) ? workoutRes.data.workout[0] : workoutRes.data.workout;
                activities.push({
                    type: 'workout',
                    name: (workout as any)?.name || 'Treino',
                    timestamp
                })
            }
        }

        if (mealRes.data && mealRes.data.consumed_at) {
            const meal = Array.isArray(mealRes.data.meal) ? mealRes.data.meal[0] : mealRes.data.meal;
            activities.push({
                type: 'meal',
                name: (meal as any)?.name || 'Refeição',
                timestamp: mealRes.data.consumed_at
            })
        }

        if (cardioRes.data) {
            const timestamp = cardioRes.data.completed_at || cardioRes.data.started_at
            if (timestamp) {
                const assigned = Array.isArray(cardioRes.data.assigned_cardio) ? cardioRes.data.assigned_cardio[0] : cardioRes.data.assigned_cardio;
                const cardio = Array.isArray((assigned as any)?.cardio) ? (assigned as any).cardio[0] : (assigned as any)?.cardio;
                activities.push({
                    type: 'cardio',
                    name: (cardio as any)?.name || 'Cardio',
                    timestamp
                })
            }
        }

        if (weightRes.data && weightRes.data.recorded_at) {
            activities.push({
                type: 'weight',
                name: `${weightRes.data.weight_kg}kg`,
                timestamp: weightRes.data.recorded_at
            })
        }

        if (photoRes.data && photoRes.data.created_at) {
            activities.push({
                type: 'photo',
                name: 'Fotos de progresso',
                timestamp: photoRes.data.created_at
            })
        }

        // Return the most recent activity
        if (activities.length === 0) return null

        const latest = activities.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]

        return {
            type: latest.type,
            name: latest.name,
            timestamp: latest.timestamp,
            formattedDate: new Date(latest.timestamp).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            }),
            relativeTime: getRelativeTime(new Date(latest.timestamp))
        }
    } catch (e) {
        console.error('Error fetching student last activity:', e)
        return null
    }
}

export async function getStudentRecentActivities(studentId: string, limit: number = 10) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const [workoutRes, mealRes, cardioRes, weightRes, photoRes] = await Promise.all([
            supabase
                .from('workout_logs')
                .select('completed_at, started_at, workout:workouts(name)')
                .eq('student_id', studentId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(limit),
            supabase
                .from('meal_logs')
                .select('consumed_at, meal:meals(name)')
                .eq('student_id', studentId)
                .eq('check_status', true)
                .order('consumed_at', { ascending: false })
                .limit(limit),
            supabase
                .from('cardio_logs')
                .select('completed_at, started_at, assigned_cardio:assigned_cardios(cardio:cardios(name))')
                .eq('student_id', studentId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(limit),
            supabase
                .from('weight_history')
                .select('recorded_at, weight_kg')
                .eq('student_id', studentId)
                .order('recorded_at', { ascending: false })
                .limit(limit),
            supabase
                .from('progress_photos')
                .select('created_at')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })
                .limit(limit),
        ])

        const activities: Array<{ type: string; name: string; timestamp: string }> = []

        for (const row of workoutRes.data || []) {
            const ts = row.completed_at || row.started_at
            if (!ts) continue
            const workout = Array.isArray(row.workout) ? row.workout[0] : row.workout
            activities.push({ type: 'workout', name: (workout as any)?.name || 'Treino', timestamp: ts })
        }

        for (const row of mealRes.data || []) {
            if (!row.consumed_at) continue
            const meal = Array.isArray(row.meal) ? row.meal[0] : row.meal
            activities.push({ type: 'meal', name: (meal as any)?.name || 'Refeição', timestamp: row.consumed_at })
        }

        for (const row of cardioRes.data || []) {
            const ts = row.completed_at || row.started_at
            if (!ts) continue
            const assigned = Array.isArray(row.assigned_cardio) ? row.assigned_cardio[0] : row.assigned_cardio
            const cardio = Array.isArray((assigned as any)?.cardio) ? (assigned as any).cardio[0] : (assigned as any)?.cardio
            activities.push({ type: 'cardio', name: (cardio as any)?.name || 'Cardio', timestamp: ts })
        }

        for (const row of weightRes.data || []) {
            if (!row.recorded_at) continue
            activities.push({ type: 'weight', name: `${row.weight_kg}kg registrado`, timestamp: row.recorded_at })
        }

        for (const row of photoRes.data || []) {
            if (!row.created_at) continue
            activities.push({ type: 'photo', name: 'Fotos de progresso', timestamp: row.created_at })
        }

        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit)
            .map(a => ({
                ...a,
                formattedDate: new Date(a.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
                relativeTime: getRelativeTime(new Date(a.timestamp)),
            }))
    } catch (e) {
        console.error('Error fetching student recent activities:', e)
        return []
    }
}

function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays}d atrás`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem atrás`
    return `${Math.floor(diffDays / 30)} mês atrás`
}

export async function getExerciseProgress(studentId: string, exerciseId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { data, error } = await supabase
            .from('load_history')
            .select(`
                *,
                exercise:exercises(name),
                workout_log:workout_logs!inner(status)
            `)
            .eq('student_id', studentId)
            .eq('exercise_id', exerciseId)
            .eq('set_type', 'WORKING')
            .eq('workout_log.status', 'completed')
            .gt('weight_kg', 0)
            .order('recorded_at', { ascending: true })
        if (error) throw error
        return data || []
    } catch (e: any) {
        console.error('Error fetching exercise progress:', e)
        return []
    }
}

export async function getWorkoutLastSession(studentId: string, workoutId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { data: log, error } = await supabase
            .from('workout_logs')
            .select(`
                id,
                completed_at,
                loads:load_history(
                    weight_kg,
                    reps_performed,
                    set_type,
                    exercise_id
                )
            `)
            .eq('student_id', studentId)
            .eq('workout_id', workoutId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw error
        return log
    } catch (e: any) {
        console.error('Error in getWorkoutLastSession:', e)
        return null
    }
}
export async function getActiveWorkoutSession() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
        const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const todayStr = tzNow.toISOString().split('T')[0]

        const [
            { data, error },
            { count: loadCount }
        ] = await Promise.all([
            supabase
                .from('workout_logs')
                .select(`
                    *,
                    workout:workouts(*)
                `)
                .eq('student_id', user.id)
                .eq('status', 'in_progress')
                .order('started_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            // We can pre-fetch the count for the most likely latest session if one exists
            // But since we need the logId, we wait for data first? 
            // Actually, we can't parallelize this perfectly without the ID.
            // However, we can fetch ANY in_progress session's load count or just keep it as is.
            // Let's re-evaluate. Parallelizing here only works if we know the ID.
            // But we can fetch both the session AND if there are ANY loads in progress in one go.
            supabase
                .from('load_history')
                .select('*', { count: 'exact', head: true })
                .eq('student_id', user.id)
            // Filter by a recent enough timestamp to avoid counting old ones if needed,
            // but usually there's only one in_progress.
        ])

        if (error) throw error
        if (!data) return null

        const sessionDate = new Date(data.started_at).toISOString().split('T')[0]
        if (sessionDate < todayStr) {
            console.log('Lazy Closing previous day workout session:', data.id)

            if (!loadCount || loadCount === 0) {
                console.log('DEBUG: Deleting empty accidental workout session:', data.id)
                await supabase.from('workout_logs').delete().eq('id', data.id)
            } else {
                await finishWorkoutLog(data.id, 'Fechamento automático (virada do dia)', 5, 'partial')
            }
            return null
        }

        return data
    } catch (e) {
        console.error('Error fetching active workout session:', e)
        return null
    }
}

export async function getWorkoutCurrentSessionLoads(logId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    try {
        const { data, error } = await supabase
            .from('load_history')
            .select('weight_kg, reps_performed, set_type, exercise_id')
            .eq('workout_log_id', logId)
            .order('recorded_at', { ascending: true })
        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching current session loads:', e)
        return []
    }
}

export async function getWorkoutLogForReview(logId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
        const { data: log, error } = await supabase
            .from('workout_logs')
            .select(`
                id,
                student_id,
                completed_at,
                feedback,
                perceived_effort,
                adherence_status,
                workout:workouts(id, name),
                loads:load_history(
                    id,
                    exercise_id,
                    weight_kg,
                    reps_performed,
                    set_type,
                    notes,
                    recorded_at,
                    exercise:exercises(id, name)
                )
            `)
            .eq('id', logId)
            .maybeSingle()

        if (error || !log) {
            if (error) console.error('Error fetching workout log:', error)
            return null
        }

        const workoutData = log.workout
        const workout = Array.isArray(workoutData) ? workoutData[0] : workoutData
        const rawLoads = Array.isArray(log.loads) ? log.loads : []
        const loads = rawLoads.map((l: any) => ({
            ...l,
            exercise: Array.isArray(l.exercise) ? l.exercise[0] : (l.exercise || { name: 'Exercício', id: l.exercise_id })
        }))

        // Group loads by exercise, then by set_type order
        const setTypeOrder: Record<string, number> = { WARMUP: 0, FEEDER: 1, WORKING: 2 }
        loads.sort((a: any, b: any) => {
            const nameA = a.exercise?.name || ''
            const nameB = b.exercise?.name || ''
            if (nameA !== nameB) return nameA.localeCompare(nameB)
            return (setTypeOrder[a.set_type] ?? 3) - (setTypeOrder[b.set_type] ?? 3)
        })

        return { ...log, workout: workout || { name: 'Treino' }, loads }
    } catch (e: any) {
        console.error('Error fetching workout log for review:', e)
        return null
    }
}

export async function updateLoadEntry(loadId: string, weightKg: number, repsPerformed: number) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado.' }

    try {
        const { error } = await supabase
            .from('load_history')
            .update({ weight_kg: weightKg, reps_performed: repsPerformed })
            .eq('id', loadId)
            .eq('student_id', user.id)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}


export async function getWorkoutStatus(userId: string, workoutId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { start, end } = getTodayRangeBrazil()

    // 1. Check Completed Logs for today
    const { data: completed } = await supabase
        .from('workout_logs')
        .select('id, status')
        .eq('workout_id', workoutId)
        .eq('student_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', start)
        .lte('completed_at', end)
        .order('completed_at', { ascending: false })
        .limit(1)

    if (completed && completed.length > 0) {
        return { status: 'completed', logId: completed[0].id }
    }

    // 2. Check In Progress Logs (within 12h)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    const { data: inProgress } = await supabase
        .from('workout_logs')
        .select('id, status')
        .eq('workout_id', workoutId)
        .eq('student_id', userId)
        .eq('status', 'in_progress')
        .gt('started_at', twelveHoursAgo)
        .order('started_at', { ascending: false })
        .limit(1)

    if (inProgress && inProgress.length > 0) {
        return { status: 'in_progress', logId: inProgress[0].id }
    }

    return { status: 'not_started', logId: null }
}

// Logic moved to @/lib/date-utils

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function startWorkoutLog(workoutId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
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

        if (error) throw error
        return { success: true, logId: data.id }
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
    notes?: string
}) {
    const supabase = await createClient()
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
                recorded_at: new Date().toISOString()
            })

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function finishWorkoutLog(id: string, feedback?: string, perceivedEffort?: number) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('workout_logs')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                feedback,
                perceived_effort: perceivedEffort
            })
            .eq('id', id)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteWorkoutLog(logId: string) {
    const supabase = await createClient()

    try {
        const { error, count } = await supabase
            .from('workout_logs')
            .delete({ count: 'exact' })
            .eq('id', logId)

        if (error) throw error

        if (count === 0) {
            return { error: 'O treino não pôde ser excluído ou você não tem permissão.' }
        }

        revalidatePath('/dashboard/trainer/students/[id]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentWorkoutHistory(studentId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('workout_logs')
            .select(`
                *,
                workout:workouts(name),
                loads:load_history(
                    id,
                    weight_kg,
                    reps_performed,
                    set_type,
                    notes,
                    exercise_id,
                    exercise:exercises(id, name)
                )
            `)
            .eq('student_id', studentId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })

        if (error) throw error
        return data || []
    } catch (e: any) {
        console.error('Error fetching history:', e)
        return []
    }
}

export async function getStudentLastActivity(studentId: string) {
    const supabase = await createClient()

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
                activities.push({
                    type: 'workout',
                    name: (workoutRes.data.workout as any)?.name || 'Treino',
                    timestamp
                })
            }
        }

        if (mealRes.data && mealRes.data.consumed_at) {
            activities.push({
                type: 'meal',
                name: (mealRes.data.meal as any)?.name || 'Refeição',
                timestamp: mealRes.data.consumed_at
            })
        }

        if (cardioRes.data) {
            const timestamp = cardioRes.data.completed_at || cardioRes.data.started_at
            if (timestamp) {
                activities.push({
                    type: 'cardio',
                    name: ((cardioRes.data.assigned_cardio as any)?.cardio?.name) || 'Cardio',
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
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('load_history')
            .select(`
                *,
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

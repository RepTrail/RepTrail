'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTrainerWorkouts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('workouts')
        .select(`
            *,
            exercises:workout_exercises(count)
        `)
        .eq('trainer_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function createManualWorkout(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim() || 'Novo Treino'
    const description = formData.get('description')?.toString().trim()

    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert({
                trainer_id: user.id,
                name,
                description
            })
            .select('id')
            .single()

        if (error) throw error

        revalidatePath('/dashboard/trainer/workouts')
        return { success: true, workoutId: data.id }

    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteWorkout(workoutId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workoutId)

        if (error) throw error

        revalidatePath('/dashboard/trainer/workouts')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateWorkoutMeta(workoutId: string, name: string, description?: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('workouts')
            .update({ name: name.trim(), description: description?.trim() ?? null })
            .eq('id', workoutId)

        if (error) throw error

        revalidatePath('/dashboard/trainer/workouts')
        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function duplicateWorkout(workoutId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. Fetch original workout
        const { data: original, error: fetchErr } = await supabase
            .from('workouts')
            .select('*')
            .eq('id', workoutId)
            .single()
        if (fetchErr || !original) throw fetchErr || new Error('Workout not found')

        // 2. Create the copy
        const { data: copy, error: insertErr } = await supabase
            .from('workouts')
            .insert({
                trainer_id: user.id,
                name: `${original.name} (cópia)`,
                description: original.description
            })
            .select('id')
            .single()
        if (insertErr || !copy) throw insertErr || new Error('Failed to create copy')

        // 3. Fetch all exercises from original
        const { data: exercises } = await supabase
            .from('workout_exercises')
            .select('*')
            .eq('workout_id', workoutId)
            .order('order_index', { ascending: true })

        // 4. Insert exercises into copy
        if (exercises && exercises.length > 0) {
            const newExercises = exercises.map(({ id, workout_id, ...rest }: any) => ({
                ...rest,
                workout_id: copy.id
            }))
            const { error: exErr } = await supabase.from('workout_exercises').insert(newExercises)
            if (exErr) throw exErr
        }

        revalidatePath('/dashboard/trainer/workouts')
        return { success: true, newId: copy.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignWorkout(workoutId: string, studentId: string, dayOfWeek: number) {
    const supabase = await createClient()

    try {
        // Check if already assigned (even if inactive)
        const { data: existing } = await supabase
            .from('assigned_workouts')
            .select('id, active')
            .eq('workout_id', workoutId)
            .eq('student_id', studentId)
            .eq('day_of_week', dayOfWeek)
            .maybeSingle()

        if (existing) {
            if (existing.active) {
                return { success: true, message: 'Este treino já está assinado para este dia.' }
            }
            // Reactivate inactive one
            const { error } = await supabase
                .from('assigned_workouts')
                .update({ active: true })
                .eq('id', existing.id)

            if (error) throw error
        } else {
            // New assignment
            const { error } = await supabase
                .from('assigned_workouts')
                .insert({
                    workout_id: workoutId,
                    student_id: studentId,
                    day_of_week: dayOfWeek,
                    active: true
                })

            if (error) throw error
        }

        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function unassignWorkout(workoutId: string, studentId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('workout_id', workoutId)
            .eq('student_id', studentId)
            .eq('active', true)

        if (error) throw error

        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getWorkoutDetails(workoutId: string) {
    const supabase = await createClient()

    // 1. Get Workout Info
    const { data: workout } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single()

    if (!workout) return null

    // 2. Get exercises linked to this workout
    const { data: exercises } = await supabase
        .from('workout_exercises')
        .select(`
            *,
            exercise:exercises(*)
        `)
        .eq('workout_id', workoutId)
        .order('order_index', { ascending: true })

    return { ...workout, exercises: exercises || [] }
}

export async function addExerciseToWorkout(workoutId: string, exerciseId: string) {
    const supabase = await createClient()

    try {
        // Get current max index
        const { data: existing } = await supabase
            .from('workout_exercises')
            .select('order_index')
            .eq('workout_id', workoutId)
            .order('order_index', { ascending: false })
            .limit(1)

        const nextIndex = (existing?.[0]?.order_index ?? -1) + 1

        const { error } = await supabase
            .from('workout_exercises')
            .insert({
                workout_id: workoutId,
                exercise_id: exerciseId,
                order_index: nextIndex,
                warmup_sets: 0,
                warmup_reps: '12-15',
                warmup_rest_seconds: 45,
                feeder_sets: 0,
                feeder_reps: '6-8',
                feeder_rest_seconds: 60,
                working_sets: 3,
                reps: '10-12',
                rest_seconds: 60
            })

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateWorkoutExercise(id: string, workoutId: string, data: any) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('workout_exercises')
            .update(data)
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeExerciseFromWorkout(id: string, workoutId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('workout_exercises')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function searchExercises(query: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('exercises')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10)

    return data || []
}

export async function createNewExercise(name: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
        const { data, error } = await supabase
            .from('exercises')
            .insert({
                name,
                trainer_id: user.id,
                is_system_default: false
            })
            .select('id')
            .single()

        if (error) throw error
        return { success: true, exerciseId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}
export async function getTodayWorkout(studentId: string) {
    const supabase = await createClient()
    const dayOfWeek = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay() // 0=Dom ... 6=Sab, no fuso de Brasília

    try {
        const [
            { data: assignment },
            { data: trainerLinks }
        ] = await Promise.all([
            supabase
                .from('assigned_workouts')
                .select(`
                    workout:workouts!inner(
                        *,
                        trainer_id,
                        exercises:workout_exercises(
                            *,
                            exercise:exercises(*)
                        )
                    )
                `)
                .eq('student_id', studentId)
                .eq('day_of_week', dayOfWeek)
                .eq('active', true)
                .maybeSingle(),
            supabase
                .from('trainer_students')
                .select('trainer_id')
                .eq('student_id', studentId)
                .eq('active', true)
        ])

        if (!assignment || !assignment.workout) return null

        const workout = assignment.workout as any

        // Data Pruning: Check if trainer is still linked using pre-fetched links
        if (workout.trainer_id && workout.trainer_id !== studentId) {
            const isLinked = trainerLinks?.some(l => l.trainer_id === workout.trainer_id)
            if (!isLinked) return null // Unlinked trainer's data is hidden
        }
        if (workout.exercises) {
            workout.exercises.sort((a: any, b: any) => a.order_index - b.order_index)
        }

        return workout
    } catch (e) {
        console.error('Error fetching today workout:', e)
        return null
    }
}

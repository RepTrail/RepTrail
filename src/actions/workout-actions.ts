'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { WorkoutService } from '@/services/WorkoutService'

export async function getTrainerWorkouts() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    return WorkoutService.getTrainerWorkouts(user.id)
}

export async function createManualWorkout(payload: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { 
        name = 'Novo Treino', 
        description, 
        clientMutationId, 
        clientId 
    } = payload

    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert({
                trainer_id: user.id,
                name,
                description,
                client_mutation_id: clientMutationId
            })
            .select()
            .maybeSingle()

        if (error) throw error
        return { success: true, data }

    } catch (e: any) {
        // 🔥 ULTRAPROOF: Atomic Recovery on Unique Violation (Code 23505)
        if (e.code === '23505') {
            console.log(`[Idempotency] Duplicate detected for ${clientMutationId}. Recovering...`)
            const { data } = await supabase
                .from('workouts')
                .select()
                .eq('client_mutation_id', clientMutationId)
                .maybeSingle()
            
            return { success: true, data }
        }
        return { error: e.message }
    }
}

export async function deleteWorkout(workoutId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workoutId)

        if (error) throw error

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            revalidateTag(`trainer-${user.id}`, 'page')
        }

        revalidatePath('/dashboard/trainer/workouts')
        revalidatePath('/dashboard/student/workouts')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateWorkoutMeta(workoutId: string, name: string, description?: string, lastUpdatedAt?: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        if (lastUpdatedAt) {
            // OCC: Fetch current state before update
            const { data: current, error: fetchErr } = await supabase
                .from('workouts')
                .select('updated_at')
                .eq('id', workoutId)
                .single()

            if (fetchErr || !current) throw fetchErr || new Error('Workout not found')

            if (current.updated_at > lastUpdatedAt) {
                // Conflict detected!
                const { data: remoteData } = await supabase
                    .from('workouts')
                    .select('*')
                    .eq('id', workoutId)
                    .single()
                
                return { 
                    conflict: true, 
                    error: 'Conflito detectado: O item foi alterado por outro usuário ou dispositivo.',
                    remote: remoteData 
                }
            }
        }

        const { error } = await supabase
            .from('workouts')
            .update({ name: name.trim(), description: description?.trim() ?? null })
            .eq('id', workoutId)

        if (error) throw error

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            revalidateTag(`trainer-${user.id}`, 'page')
        }

        revalidatePath('/dashboard/trainer/workouts')
        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function duplicateWorkout(workoutId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

        const { data: { user: curUser } } = await supabase.auth.getUser()
        if (curUser) {
            revalidateTag(`trainer-${curUser.id}`, 'page')
        }

        revalidatePath('/dashboard/trainer/workouts')
        return { success: true, newId: copy.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignWorkout(workoutId: string, studentId: string, dayOfWeek: number) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // First, deactivate any existing day assignments for this workout and student
        // This ensures the workout is "moved" to the new day rather than duplicated
        await supabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('workout_id', workoutId)
            .eq('student_id', studentId)

        // Check if already assigned (even if inactive) on the SPECIFIC new day
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

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            revalidateTag(`trainer-${user.id}`, 'page')
        }

        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/workouts')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function unassignWorkout(workoutId: string, studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        if (!workoutId || !studentId || workoutId === 'undefined' || studentId === 'undefined') {
            console.error(`[WORKOUT-ACTIONS] Invalid IDs for unassignWorkout: workoutId=${workoutId}, studentId=${studentId}`);
            return { error: 'IDs inválidos para desatribuir treino.' };
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'Unauthorized' }

        // 🚀 CHECK IF PLACEHOLDER
        const { data: placeholder } = await supabase
            .from('pending_student_links')
            .select('*')
            .eq('id', studentId)
            .eq('trainer_id', user.id)
            .maybeSingle()

        if (placeholder) {
            console.log(`[WORKOUT-ACTIONS] Unassigning from placeholder: ${studentId}`)
            if (!workoutId) {
                console.warn(`[WORKOUT-ACTIONS] unassignWorkout called without workoutId for placeholder student: ${studentId}`);
                return { success: true }; // Idempotent
            }
            const cleanId = workoutId.replace('pw-', '')
            
            // 1. Filter workout_ids
            const newWorkoutIds = (placeholder.workout_ids || []).filter((id: string) => id !== cleanId)
            
            // 2. Filter metadata workout_days
            const ergo = (placeholder.ergogenic_data as any[]) || []
            const metaIdx = ergo.findIndex(e => e.__metadata)
            if (metaIdx !== -1) {
                const metadata = ergo[metaIdx]
                if (metadata.workout_days) {
                    metadata.workout_days = metadata.workout_days.filter((m: any) => m.id !== cleanId)
                    ergo[metaIdx] = metadata
                }
            }

            const { error: pendingError } = await supabase
                .from('pending_student_links')
                .update({ 
                    workout_ids: newWorkoutIds,
                    ergogenic_data: ergo
                })
                .eq('id', studentId)

            if (pendingError) throw pendingError

            revalidatePath('/dashboard/trainer/students')
            return { success: true }
        }

        // 🚀 TRAINER AUTHORITY: Check if user is the student's trainer
        const { data: link } = await supabase
            .from('trainer_students')
            .select('id')
            .eq('trainer_id', user.id)
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        const isTrainer = !!link

        // 2. Use Admin Client to force deactivation regardless of owner
        const { createAdminClient } = await import('@/lib/supabase/server')
        const adminSupabase = await createAdminClient()

        const { error } = await adminSupabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('workout_id', workoutId)
            .eq('student_id', studentId)
            .eq('active', true)

        if (error) throw error
        
        if (user) {
            revalidateTag(`trainer-${user.id}`, 'page')
        }

        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/workouts')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getWorkoutDetails(workoutId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // We rely on the service layer (adminClient) to fetch details 
    // to bypass restrictive RLS that might block students from viewing assigned workout skeletons
    return WorkoutService.getWorkoutDetails(workoutId, user.id)
}

export async function addExerciseToWorkout(workoutId: string, exerciseId: string) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        // Get current max index
        const { data: existing } = await adminSupabase
            .from('workout_exercises')
            .select('order_index')
            .eq('workout_id', workoutId)
            .order('order_index', { ascending: false })
            .limit(1)

        const nextIndex = (existing?.[0]?.order_index ?? -1) + 1

        const { data: newRow, error } = await adminSupabase
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
            .select('*, exercise:exercises(id, name)')
            .single()

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        revalidatePath(`/dashboard/student/workouts/${workoutId}`)
        return { success: true, data: newRow }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateWorkoutExercise(id: string, workoutId: string, data: any) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        const { error } = await adminSupabase
            .from('workout_exercises')
            .update(data)
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        revalidatePath(`/dashboard/student/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeExerciseFromWorkout(id: string, workoutId: string) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        const { error } = await adminSupabase
            .from('workout_exercises')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        revalidatePath(`/dashboard/student/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateWorkoutExercisesOrder(workoutId: string, orderedIds: string[]) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        const promises = orderedIds.map((id, index) =>
            adminSupabase
                .from('workout_exercises')
                .update({ order_index: index })
                .eq('id', id)
        )

        await Promise.all(promises)

        revalidatePath(`/dashboard/trainer/workouts/${workoutId}`)
        revalidatePath(`/dashboard/student/workouts/${workoutId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function searchExercises(query: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data } = await supabase
        .from('exercises')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10)

    return data || []
}

export async function createNewExercise(name: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const dayOfWeek = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay() // 0=Dom ... 6=Sab, no fuso de Brasília

    try {
        const [
            { data: assignments },
            { data: trainerLinks }
        ] = await Promise.all([
            supabase
                .from('assigned_workouts')
                .select(`
                    workout:workouts!inner(
                        *,
                        trainer_id,
                        workout_exercises:workout_exercises(
                            *,
                            exercise:exercises(*)
                        )
                    )
                `)
                .eq('student_id', studentId)
                .eq('day_of_week', dayOfWeek)
                .eq('active', true),
            supabase
                .from('trainer_students')
                .select('trainer_id')
                .eq('student_id', studentId)
                .eq('active', true)
        ])

        if (!assignments || assignments.length === 0) return []

        const workouts: any[] = []

        for (const a of assignments) {
            if (!a.workout) continue
            const workout = a.workout as any

            // Data Pruning: Check if trainer is still linked using pre-fetched links
            if (workout.trainer_id && workout.trainer_id !== studentId) {
                const isLinked = trainerLinks?.some(l => l.trainer_id === workout.trainer_id)
                if (!isLinked) continue // Unlinked trainer's data is hidden
            }
            if (workout.workout_exercises) {
                workout.workout_exercises.sort((a: any, b: any) => a.order_index - b.order_index)
            }

            // 🚨 ELITE: Inject status into today's workout object to prevent card flicker
            const { getWorkoutStatus } = await import('@/actions/log-actions')
            const statusData = await getWorkoutStatus(studentId, workout.id)
            
            workouts.push({
                ...workout,
                status: statusData.status,
                logId: statusData.logId
            })
        }

        return workouts
    } catch (e) {
        console.error('Error fetching today workout:', e)
        return []
    }
}
export async function getAssignedWorkouts(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { data, error } = await supabase
            .from('assigned_workouts')
            .select(`
                id,
                day_of_week,
                active,
                workout:workouts(
                    *,
                    workout_exercises:workout_exercises(
                        id,
                        order_index,
                        warmup_sets,
                        feeder_sets,
                        working_sets,
                        reps,
                        exercise:exercises(name)
                    )
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching assigned workouts:', e)
        return []
    }
}

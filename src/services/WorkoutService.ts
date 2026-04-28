
import { adminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

export class WorkoutService {
    static async getTrainerWorkouts(trainerId: string) {
        return unstable_cache(
            async () => {
                const [
                    { data: workouts, error: wError },
                    { data: pendingLinks }
                ] = await Promise.all([
                    adminClient
                        .from('workouts')
                        .select(`
                            *,
                            workout_exercises:workout_exercises(count),
                            assignments:assigned_workouts(
                                id,
                                student_id,
                                day_of_week,
                                active,
                                student:profiles(full_name)
                            )
                        `)
                        .eq('trainer_id', trainerId)
                        .order('created_at', { ascending: false }),
                    adminClient
                        .from('pending_student_links')
                        .select('id, student_name, workout_ids, ergogenic_data')
                        .eq('trainer_id', trainerId)
                        .eq('status', 'pending')
                ])

                if (wError) {
                    console.error('Error in WorkoutService.getTrainerWorkouts:', wError)
                    return []
                }

                console.log(`[WorkoutService] Found ${workouts?.length || 0} workouts for trainer ${trainerId}`);
                if (workouts && workouts.length > 0) {
                    console.log(`[WorkoutService] First workout trainer_id: ${workouts[0].trainer_id}`);
                }

                // Grouping logic for trainer view
                const grouped = (workouts || []).map((workout: any) => {
                    const studentMap: Record<string, any> = {}

                    // 1. Process real assignments
                    ;(workout.assignments || []).forEach((a: any) => {
                        if (!a.active) return
                        if (!studentMap[a.student_id]) {
                            studentMap[a.student_id] = { ...a, days_of_week: [] }
                        }
                        if (a.day_of_week !== null && a.day_of_week !== undefined) {
                            if (!studentMap[a.student_id].days_of_week.includes(a.day_of_week)) {
                                studentMap[a.student_id].days_of_week.push(a.day_of_week)
                            }
                        }
                    })

                    // 2. Process pending assignments (Placeholders)
                    ;(pendingLinks || []).forEach((link: any) => {
                        if (link.workout_ids?.includes(workout.id)) {
                            const placeholderId = `pending-${link.id}`
                            
                            // Find day metadata for this specific workout
                            const metadata = (link.ergogenic_data || []).find((e: any) => e?.__metadata === true)
                            const workoutMeta = metadata?.workout_days?.find((wd: any) => wd.id === workout.id)
                            const dayOfWeek = workoutMeta?.day

                            if (!studentMap[placeholderId]) {
                                studentMap[placeholderId] = {
                                    id: link.id,
                                    student_id: null,
                                    active: true,
                                    is_placeholder: true,
                                    student: { full_name: link.student_name },
                                    days_of_week: []
                                }
                            }
                            
                            if (dayOfWeek !== null && dayOfWeek !== undefined) {
                                if (!studentMap[placeholderId].days_of_week.includes(dayOfWeek)) {
                                    studentMap[placeholderId].days_of_week.push(dayOfWeek)
                                }
                            }
                        }
                    })

                    return { ...workout, assignments: Object.values(studentMap) }
                })

                return grouped || []
            },
            [`trainer-workouts-${trainerId}`],
            { tags: ['workouts', `trainer-${trainerId}`] }
        )()
    }

    static async getWorkoutDetails(workoutId: string, userId?: string) {
        return unstable_cache(
            async () => {
                const { data: workout, error } = await adminClient
                    .from('workouts')
                    .select(`
                        *,
                        assignments:assigned_workouts(
                            id,
                            student_id,
                            day_of_week,
                            active,
                            student:profiles(full_name)
                        )

                    `)
                    .eq('id', workoutId)
                    .maybeSingle()

                if (error || !workout) {
                    console.error('Error in WorkoutService.getWorkoutDetails:', error)
                    return null
                }

                // Grouping logic
                const studentMap: Record<string, any> = {}
                    ; (workout.assignments || []).forEach((a: any) => {
                        if (!a.active || (userId && a.student_id === userId)) return

                        if (!studentMap[a.student_id]) {
                            studentMap[a.student_id] = {
                                ...a,
                                days_of_week: []
                            }
                        }
                        if (a.day_of_week !== null && a.day_of_week !== undefined) {
                            if (!studentMap[a.student_id].days_of_week.includes(a.day_of_week)) {
                                studentMap[a.student_id].days_of_week.push(a.day_of_week)
                            }
                        }
                    })
                workout.assignments = Object.values(studentMap)

                const { data: exercises } = await adminClient
                    .from('workout_exercises')
                    .select(`
                        *,
                        exercise:exercises(*)
                    `)
                    .eq('workout_id', workoutId)
                    .order('order_index', { ascending: true })

                return { ...workout, workout_exercises: exercises || [] }
            },
            [`workout-details-${workoutId}`],
            { tags: ['workouts', `workout-details-${workoutId}`] }
        )()
    }

    static async getTodayWorkout(studentId: string) {
        const dayOfWeek = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()

        return unstable_cache(
            async () => {
                try {
                    const [
                        { data: assignment },
                        { data: trainerLinks }
                    ] = await Promise.all([
                        adminClient
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
                            .eq('active', true)
                            .maybeSingle(),
                        adminClient
                            .from('trainer_students')
                            .select('trainer_id')
                            .eq('student_id', studentId)
                            .eq('active', true)
                    ])

                    if (!assignment || !assignment.workout) return null

                    const workout = assignment.workout as any

                    if (workout.trainer_id && workout.trainer_id !== studentId) {
                        const isLinked = trainerLinks?.some((l: any) => l.trainer_id === workout.trainer_id)
                        if (!isLinked) return null
                    }

                    if (workout.workout_exercises) {
                        workout.workout_exercises.sort((a: any, b: any) => a.order_index - b.order_index)
                    }

                    return workout
                } catch (e) {
                    console.error('Error fetching today workout in WorkoutService:', e)
                    return null
                }
            },
            [`today-workout-${studentId}-${dayOfWeek}`],
            { tags: ['workouts', `student-workouts-${studentId}`] }
        )()
    }
}

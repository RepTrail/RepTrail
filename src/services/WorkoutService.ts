
import { adminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

export class WorkoutService {
    static async getTrainerWorkouts(trainerId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('workouts')
                    .select(`
                        *,
                        exercises:workout_exercises(count),
                        assignments:assigned_workouts(
                            id,
                            student_id,
                            day_of_week,
                            active,
                            student:profiles(full_name)
                        )
                    `)
                    .eq('trainer_id', trainerId)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error in WorkoutService.getTrainerWorkouts:', error)
                    return []
                }

                // Grouping logic for trainer view
                const grouped = (data || []).map(workout => {
                    const studentMap: Record<string, any> = {}
                    ;(workout.assignments || []).forEach((a: any) => {
                        if (!a.active || a.student_id === trainerId) return
                        
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
                            active
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
                ;(workout.assignments || []).forEach((a: any) => {
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

                return { ...workout, exercises: exercises || [] }
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
                        adminClient
                            .from('trainer_students')
                            .select('trainer_id')
                            .eq('student_id', studentId)
                            .eq('active', true)
                    ])

                    if (!assignment || !assignment.workout) return null

                    const workout = assignment.workout as any

                    if (workout.trainer_id && workout.trainer_id !== studentId) {
                        const isLinked = trainerLinks?.some(l => l.trainer_id === workout.trainer_id)
                        if (!isLinked) return null
                    }
                    
                    if (workout.exercises) {
                        workout.exercises.sort((a: any, b: any) => a.order_index - b.order_index)
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

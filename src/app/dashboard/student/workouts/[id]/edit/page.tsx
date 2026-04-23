import { WorkoutBuilder } from "@/components/feature/trainer/workout-builder"
import { notFound } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { WorkoutDaySelector } from '@/components/feature/student/workout-day-selector'

export default async function EditStudentWorkoutPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.log('[EDIT] No user found')
        return notFound()
    }

    console.log('[EDIT] Edit workout request:', { workoutId: id, userId: user.id })

    // Verify auto-training is active
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    console.log('[EDIT] Auto-training status:', { isAutoTrainingActive, profile })

    if (!isAutoTrainingActive) {
        console.log('[EDIT] Auto-training not active, returning 404')
        return notFound()
    }

    // Get workout details with RLS check
    const { data: workout } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .eq('trainer_id', user.id) // Ensure user owns this workout
        .single()

    console.log('[EDIT] Workout found:', { workout })

    if (!workout) {
        console.log('[EDIT] Workout not found or no permission, returning 404')
        return notFound()
    }

    // Get exercises linked to this workout
    const { data: exercises } = await supabase
        .from('workout_exercises')
        .select(`
            *,
            exercise:exercises(*)
        `)
        .eq('workout_id', id)
        .order('order_index', { ascending: true })

    const { data: assignment } = await supabase
        .from('assigned_workouts')
        .select('id, day_of_week')
        .eq('workout_id', id)
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const workoutWithExercises = { ...workout, exercises: exercises || [] }
    console.log('[EDIT] Exercises found:', exercises?.length || 0)

    return (
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8">
            {assignment?.id ? (
                <div className="flex justify-end pb-6">
                    <WorkoutDaySelector userId={user.id} assignmentId={assignment.id} dayOfWeek={assignment.day_of_week ?? null} />
                </div>
            ) : null}
            <WorkoutBuilder workout={workoutWithExercises as any} backHref="/dashboard/student/workouts" />
        </div>
    )
}

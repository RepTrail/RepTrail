import { WorkoutBuilderSmart } from "@/components/store/advanced/workout-builder-smart"
import { notFound, redirect } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { WorkoutDaySelector } from '@/components/store/advanced/workout-day-selector'
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { Stack } from "@/components/store/base/stack"
import { headers } from "next/headers"

export default async function EditStudentWorkoutPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    console.log('[EDIT] Edit workout request:', { workoutId: id, userId })

    // Verify auto-training is active
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', userId)
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
        .eq('trainer_id', userId) // Ensure user owns this workout
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
        .eq('student_id', userId)
        .eq('active', true)
        .maybeSingle()

    const workoutWithExercises = { ...workout, exercises: exercises || [] }
    console.log('[EDIT] Exercises found:', exercises?.length || 0)

    return (
        <RegistryMain
            title="DETALHES DO TREINO"
            subtitle="Veja o planejamento enviado pelo seu treinador."
            icon="Dumbbell"
            contextLabel="Treinos & Performance"
            showTabs={false}
            showHeader={false}
        >
            <Stack fullWidth gap="element">
                {assignment?.id ? (
                    <Box display="flex" justify="end">
                        <WorkoutDaySelector userId={userId} assignmentId={assignment.id} dayOfWeek={assignment.day_of_week ?? null} />
                    </Box>
                ) : null}
                <WorkoutBuilderSmart 
                    workout={workoutWithExercises as any} 
                    backHref="/dashboard/student/workouts" 
                    contextLabel="TREINOS E PERFORMANCE"
                    icon="Dumbbell"
                    contextColor="orange"
                />
            </Stack>
        </RegistryMain>
    )
}

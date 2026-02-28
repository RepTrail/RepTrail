import { getWorkoutDetails } from "@/actions/workout-actions"
import { WorkoutBuilder } from "@/components/feature/trainer/workout-builder"
import { notFound } from "next/navigation"
import { createClient } from '@/lib/supabase/server'

export default async function StudentWorkoutPage({
    params,
}: {
    params: { id: string }
}) {
    // Await params if using Next 15, but let's safely destruct
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return notFound()
    }

    // Verify auto-training is active or has trainer
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    // We get the workout details
    const workout = await getWorkoutDetails(id)

    if (!workout) {
        return notFound()
    }

    // Load active assignment to show day selector
    const { data: assignment } = await supabase
        .from('assigned_workouts')
        .select('id, day_of_week')
        .eq('workout_id', id)
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WorkoutBuilder workout={workout as any} backHref="/dashboard/student/workouts" />
        </div>
    )
}

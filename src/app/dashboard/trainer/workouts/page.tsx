import { getTrainerWorkouts } from "@/actions/workout-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { WorkoutsLibraryClient } from "@/components/feature/trainer/workouts-library-client"
import { createClient } from "@/lib/supabase/server"

export default async function TrainerWorkoutsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [workouts, students, betaTesterMode] = await Promise.all([
        getTrainerWorkouts(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    return (
        <WorkoutsLibraryClient 
            initialWorkouts={workouts} 
            initialStudents={students} 
            betaTesterMode={betaTesterMode} 
            userId={user?.id || ''}
        />
    )
}

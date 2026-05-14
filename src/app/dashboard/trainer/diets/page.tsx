import { getTrainerDiets } from "@/actions/diet-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { DietsLibraryClient } from "@/components/store/features(deprecated)/diets-library-client"
import { createClient } from "@/lib/supabase/server"

export default async function TrainerDietsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [diets, students, betaTesterMode] = await Promise.all([
        getTrainerDiets(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    return (
        <DietsLibraryClient 
            initialDiets={diets} 
            initialStudents={students} 
            betaTesterMode={betaTesterMode} 
            userId={user?.id || ''}
        />
    )
}


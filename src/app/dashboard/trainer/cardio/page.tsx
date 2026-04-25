import { getCardioLibrary } from '@/actions/cardio-actions'
import { getTrainerStudents } from "@/actions/trainer-actions"
import { CardioLibraryClient } from "@/components/feature/trainer/cardio-library-client"
import { createClient } from "@/lib/supabase/server"

export default async function TrainerCardioPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [cardios, students] = await Promise.all([
        getCardioLibrary(),
        getTrainerStudents()
    ])

    return (
        <CardioLibraryClient 
            initialCardios={cardios} 
            initialStudents={students} 
            userId={user?.id || ''}
        />
    )
}

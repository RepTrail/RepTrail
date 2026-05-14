import { getTrainerProfile } from "@/actions/trainer-actions"
import { createClient } from '@/lib/supabase/server'
import { TrainerProfileClient } from "@/components/store/features(deprecated)/trainer-profile-client"

export const dynamic = 'force-dynamic'

export default async function TrainerProfilePage() {
    const profile = await getTrainerProfile()
    const supabase = await createClient()

    // Fetch Real Stats for Gamification
    const { count: activeStudents } = await supabase
        .from('trainer_students')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', profile?.id)
        .eq('active', true)

    return (
        <TrainerProfileClient 
            profile={profile} 
            activeStudents={activeStudents || 0} 
        />
    )
}



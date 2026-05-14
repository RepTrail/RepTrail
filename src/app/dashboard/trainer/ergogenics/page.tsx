import { createClient } from '@/lib/supabase/server'
import { TrainerErgogenicsHubClient } from '@/components/store/features(deprecated)/trainer-ergogenics-hub-client'

export default async function TrainerErgogenicsHubPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch real students
    const { data: students } = await supabase
        .from('trainer_students')
        .select(`
            id,
            student:profiles!student_id(
                id,
                full_name,
                avatar_url,
                details:student_details!id(
                    steroid_use
                )
            )
        `)
        .eq('trainer_id', user.id)
        .eq('active', true)

    // 2. Fetch placeholder students
    const { data: placeholders } = await supabase
        .from('pending_student_links')
        .select('*')
        .eq('trainer_id', user.id)
        .eq('status', 'pending')

    // Filter real students
    const realErgoStudents = (students || [])
        .filter((s: any) => s.student?.details?.steroid_use)
        .map((s: any) => ({
            id: s.id,
            full_name: s.student.full_name,
            avatar_url: s.student.avatar_url,
            is_placeholder: false
        }))

    // Filter placeholder students
    const placeholderErgoStudents = (placeholders || [])
        .filter((p: any) => {
            const metadata = (p.ergogenic_data as any[])?.find(e => e.__metadata)
            return metadata?.steroid_use === true
        })
        .map((p: any) => ({
            id: p.id,
            full_name: p.student_name,
            avatar_url: null,
            is_placeholder: true
        }))

    // Merge results
    const ergogenicStudents = [...realErgoStudents, ...placeholderErgoStudents]

    return <TrainerErgogenicsHubClient ergogenicStudents={ergogenicStudents} />
}


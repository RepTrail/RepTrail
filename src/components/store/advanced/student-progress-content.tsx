import { createClient } from '@/lib/supabase/server'
import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getAdherenceHistory } from '@/actions/tracking-actions'
import { StudentPublicProfileMain } from '@/components/store/advanced/student-public-profile-main'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { StudentPublicMetrics } from '@/components/store/advanced/student-public-metrics'

export async function StudentProgressPageContent({ userId }: { userId: string }) {
    const supabase = await createClient()

    // Fetch real data
    const fullMetrics = await getStudentFullMetrics(userId)
    const adherenceHistory = await getAdherenceHistory(30)

    const [profileResult, trainerLinkResult, progressPhotosResult] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, full_name, avatar_url, created_at')
            .eq('id', userId)
            .single(),
        supabase
            .from('trainer_students')
            .select(`
                active,
                trainer:profiles!trainer_id(
                    id, full_name, avatar_url, trainer_code
                )
            `)
            .eq('student_id', userId)
            .eq('active', true)
            .maybeSingle(),
        supabase
            .from('progress_photos')
            .select('id, front_url, back_url, side_right_url, side_left_url, created_at')
            .eq('student_id', userId)
            .order('created_at', { ascending: false })
    ])

    const profile = profileResult.data
    const trainerLink = trainerLinkResult.data
    const progressPhotos = progressPhotosResult.data || []

    const trainerData = trainerLink?.trainer as any

    if (!profile) return null

    // ── Compose evolution tab content ──────────────────────────────────────────
    const evolutionContent = (
        <StudentPublicMetrics
            fullMetrics={fullMetrics}
            adherenceHistory={adherenceHistory || []}
            steroidUse={!!fullMetrics.details?.steroid_use}
        />
    )

    const photosContent = (
        <StudentPublicPhotos
            studentId={userId}
            isOwner={true}
            studentName={profile.full_name}
            photos={progressPhotos}
            isStudentView={true}
        />
    )

    return (
        <StudentPublicProfileMain
            profile={profile}
            trainerData={trainerData}
            evolutionContent={evolutionContent}
            historyContent={null}
            photosContent={photosContent}
        />
    )
}

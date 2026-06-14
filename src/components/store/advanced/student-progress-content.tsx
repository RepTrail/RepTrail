import { getStudentProgressPageData, actions } from '@/lib/dal/server'
import { StudentPublicProfileMain } from '@/components/store/advanced/student-public-profile-main'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { StudentPublicMetrics } from '@/components/store/advanced/student-public-metrics'

export async function StudentProgressPageContent({ userId }: { userId: string }) {
    // Fetch real data
    const fullMetrics = await actions.getStudentFullMetrics(userId)
    const adherenceHistory = await actions.getAdherenceHistory(30)

    const data = await getStudentProgressPageData(userId)
    if (!data) return null

    const { profile, trainerLink, progressPhotos } = data

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
            studentName={profile?.full_name}
            photos={progressPhotos}
            isStudentView={true}
        />
    )

    return (
        <StudentPublicProfileMain
            profile={profile}
            trainerData={trainerData}
            evolutionContent={evolutionContent}
            photosContent={photosContent}
        />
    )
}

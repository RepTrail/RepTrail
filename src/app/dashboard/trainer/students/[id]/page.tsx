import {
    getStudentRelationship,
    getTrainerProfile
} from '@/actions/trainer-actions'
import { getStudentWorkoutHistory, getStudentRecentActivities } from '@/actions/log-actions'
import { getStudentMetricsHistory, getStudentChartData } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { getAssignedErgogenics } from '@/actions/ergogenics-actions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerStudentProfileSection } from '@/components/store/sections/trainer-student-profile-section'
import { TrainerStudentEvolutionSection } from '@/components/store/sections/trainer-student-evolution-section'
import { TrainerStudentProtocolsSection } from '@/components/store/sections/trainer-student-protocols-section'
import { TrainerStudentPhotosActivitiesSection } from '@/components/store/sections/trainer-student-photos-activities-section'
import { TrainerStudentDetailTabSwitcher } from '@/components/store/sections/trainer-student-detail-tab-switcher'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Compass } from 'lucide-react'

export const revalidate = 0

export default async function StudentDetailPage({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { tab?: string }
}) {
    const { id } = await params
    const { tab } = await searchParams
    const activeTab = tab || 'protocols'

    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const queryClient = getQueryClient()

    // ─── PARALLEL PREFETCHING (0ms Nav) ─────────────────────────────
    const relationship = await getStudentRelationship(id)
    if (!relationship || !relationship.student) {
        redirect('/dashboard/trainer/students')
    }

    const studentId = relationship.student_id
    const student = relationship.student
    const studentName = student.full_name.toUpperCase()

    const prefetchPromises = [
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentDetail(id),
            queryFn: () => relationship // Reuse the already fetched data
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.profile.detail(userId),
            queryFn: () => getTrainerProfile(userId)
        })
    ]

    if (studentId) {
        prefetchPromises.push(
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentHistory(studentId),
                queryFn: () => getStudentWorkoutHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentMetrics(studentId),
                queryFn: () => getStudentMetricsHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
                queryFn: () => getStudentAdherenceHistory(studentId, 30)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentChartData(studentId),
                queryFn: () => getStudentChartData(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: ['student-recent-activities', studentId],
                queryFn: () => getStudentRecentActivities(studentId, 50)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.cardio.assignments(studentId),
                queryFn: () => getStudentCardioAssignments(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.ergogenics.all(studentId),
                queryFn: () => getAssignedErgogenics(studentId)
            })
        )
    }

    // Await all prefetches to ensure dehydration is complete
    await Promise.all(prefetchPromises.filter(Boolean))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title={studentName}
                subtitle="Gestão completa e acompanhamento do aluno."
                icon="User"
                contextLabel="Gestão de Alunos"
                showTabs={false}
            >
                <TrainerStudentDetailTabSwitcher activeTab={activeTab} />

                {activeTab === 'protocols' && (
                    <TrainerStudentProtocolsSection relationshipId={id} studentId={studentId} trainerId={userId} />
                )}

                {activeTab === 'evolution' && (
                    <TrainerStudentEvolutionSection studentId={studentId} studentDetails={student.details} />
                )}

                {activeTab === 'photos_activities' && (
                    <TrainerStudentPhotosActivitiesSection relationshipId={id} studentId={studentId} />
                )}

                {activeTab === 'profile' && (
                    <TrainerStudentProfileSection studentId={studentId} student={student} />
                )}
            </RegistryMain>
        </HydrationBoundary>
    )
}

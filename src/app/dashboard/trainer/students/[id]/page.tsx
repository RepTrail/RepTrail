import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerStudentProfileSection } from '@/components/store/sections/trainer-student-profile-section'
import { TrainerStudentEvolutionSection } from '@/components/store/sections/trainer-student-evolution-section'
import { TrainerStudentProtocolsSection } from '@/components/store/sections/trainer-student-protocols-section'
import { TrainerStudentPhotosActivitiesSection } from '@/components/store/sections/trainer-student-photos-activities-section'
import { TrainerStudentDetailTabSwitcher } from '@/components/store/sections/trainer-student-detail-tab-switcher'
import { PlaceholderStudentAccessBanner } from '@/components/store/sections/placeholder-student-access-banner'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
    const relationship = await actions.getStudentRelationship(id)
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
            queryFn: () => actions.getTrainerProfile(userId)
        })
    ]

    if (studentId) {
        prefetchPromises.push(
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentHistory(studentId),
                queryFn: () => actions.getStudentWorkoutHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentMetrics(studentId),
                queryFn: () => actions.getStudentMetricsHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
                queryFn: () => actions.getStudentAdherenceHistory(studentId, 30)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentChartData(studentId),
                queryFn: () => actions.getStudentChartData(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: ['student-recent-activities', studentId],
                queryFn: () => actions.getStudentRecentActivities(studentId, 50)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.cardio.assignments(studentId),
                queryFn: () => actions.getStudentCardioAssignments(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.ergogenics.all(studentId),
                queryFn: () => actions.getAssignedErgogenics(studentId)
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
                <PlaceholderStudentAccessBanner relationship={relationship} />
                
                <RegistrySection>
                    <TrainerStudentDetailTabSwitcher activeTab={activeTab} />
                </RegistrySection>

                {activeTab === 'protocols' && (
                    <RegistrySection>
                        <TrainerStudentProtocolsSection relationshipId={id} studentId={studentId} trainerId={userId} />
                    </RegistrySection>
                )}

                {activeTab === 'evolution' && (
                    <RegistrySection>
                        <TrainerStudentEvolutionSection studentId={studentId} studentDetails={student.details} />
                    </RegistrySection>
                )}

                {activeTab === 'photos_activities' && (
                    <RegistrySection>
                        <TrainerStudentPhotosActivitiesSection relationshipId={id} studentId={studentId} />
                    </RegistrySection>
                )}

                {activeTab === 'profile' && (
                    <RegistrySection>
                        <TrainerStudentProfileSection studentId={studentId} student={student} />
                    </RegistrySection>
                )}
            </RegistryMain>
        </HydrationBoundary>
    )
}

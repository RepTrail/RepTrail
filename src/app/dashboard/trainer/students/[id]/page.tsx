import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import * as actions from '@/lib/dal/remote'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerStudentProfileSection } from '@/components/store/sections/trainer-student-profile-section'
import { TrainerStudentEvolutionSection } from '@/components/store/sections/trainer-student-evolution-section'
import { TrainerStudentWorkoutsContent, TrainerStudentDietsContent, TrainerStudentCardioContent } from '@/components/store/sections/trainer-student-protocols-section'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import { Box } from '@/components/store/base/box'
import { TrainerStudentErgogenicsSmart } from '@/components/store/advanced/trainer-student-ergogenics-smart'
import { TrainerStudentPhotosContent, TrainerStudentRecentActivitiesContent } from '@/components/store/sections/trainer-student-photos-activities-section'
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

    // Fetch features to apply locks
    const features = await actions.getTrainerPlanFeatures(userId)
    const hasWorkouts = features?.has_workouts ?? false
    const hasDiets = features?.has_diets ?? false
    const hasCardio = features?.has_cardio ?? false
    const hasErgogenics = features?.has_ergogenics ?? false
    const hasPdfImport = features?.has_import_pdf_ai ?? false

    // ─── PARALLEL PREFETCHING (0ms Nav) ─────────────────────────────
    const relationship = await actions.getStudentRelationship(id)
    if (!relationship || !relationship.student) {
        redirect('/dashboard/trainer/students')
    }

    const studentId = relationship.student_id
    const student = relationship.student
    const studentName = student?.full_name.toUpperCase()

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

                <TrainerStudentDetailTabSwitcher activeTab={activeTab} />

                {activeTab === 'protocols' && (
                    <>
                        <RegistrySection
                            title="Treinamentos de Força"
                            subtitle="Visualize, organize e prescreva os templates de treinamento de força ativos para o aluno."
                            icon="Dumbbell"
                            rightElement={hasWorkouts ? <TrainerRegistryHeaderActions userId={userId} studentId={studentId} variant="workout" betaTesterMode={false} hideImportPdf={!hasPdfImport} /> : null}
                        >
                            <PremiumLockOverlay 
                                variant="area" 
                                locked={!hasWorkouts} 
                                title="Treinamentos" 
                                description="Seu plano não inclui o módulo de treinamentos. Faça upgrade para prescrever treinos para seus alunos."
                            >
                                {hasWorkouts ? <TrainerStudentWorkoutsContent relationshipId={id} studentId={studentId} /> : <Box minHeight={300} fullWidth />}
                            </PremiumLockOverlay>
                        </RegistrySection>
                        
                        <RegistrySection
                            title="Protocolos Alimentares"
                            subtitle="Planeje e gerencie as refeições, calorias e macros da rotina alimentar do aluno."
                            icon="Utensils"
                            rightElement={hasDiets ? <TrainerRegistryHeaderActions userId={userId} studentId={studentId} variant="diet" betaTesterMode={false} hideImportPdf={!hasPdfImport} /> : null}
                        >
                            <PremiumLockOverlay 
                                variant="area" 
                                locked={!hasDiets} 
                                title="Planos Alimentares" 
                                description="Seu plano não inclui o módulo de dietas. Faça upgrade para prescrever planos alimentares."
                            >
                                {hasDiets ? <TrainerStudentDietsContent relationshipId={id} studentId={studentId} /> : <Box minHeight={300} fullWidth />}
                            </PremiumLockOverlay>
                        </RegistrySection>

                        <RegistrySection
                            title="Atividades Cardiorrespiratórias"
                            subtitle="Defina metas de cardio, frequências semanais e intensidades sugeridas."
                            icon="Activity"
                            rightElement={hasCardio ? <TrainerRegistryHeaderActions userId={userId} studentId={studentId} variant="cardio" betaTesterMode={false} hideImportPdf={!hasPdfImport} /> : null}
                        >
                            <PremiumLockOverlay 
                                variant="area" 
                                locked={!hasCardio} 
                                title="Cardio" 
                                description="Seu plano não inclui o módulo de atividades cardiorrespiratórias. Faça upgrade para liberar."
                            >
                                {hasCardio ? <TrainerStudentCardioContent relationshipId={id} studentId={studentId} /> : <Box minHeight={300} fullWidth />}
                            </PremiumLockOverlay>
                        </RegistrySection>

                        <RegistrySection
                            title="Recursos Ergogênicos"
                            subtitle="Gerenciamento inteligente de ergogênicos e fitoterápicos."
                            icon="Pill"
                            rightElement={hasErgogenics ? <TrainerRegistryHeaderActions userId={userId} studentId={studentId} variant="ergogenic" betaTesterMode={false} hideImportPdf={!hasPdfImport} /> : null}
                        >
                            <PremiumLockOverlay 
                                variant="area" 
                                locked={!hasErgogenics} 
                                title="Ergogênicos" 
                                description="Seu plano não inclui o módulo de recursos ergogênicos e fitoterápicos. Faça upgrade para liberar."
                            >
                                {hasErgogenics ? <TrainerStudentErgogenicsSmart effectiveStudentId={studentId} /> : <Box minHeight={300} fullWidth />}
                            </PremiumLockOverlay>
                        </RegistrySection>
                    </>
                )}

                {activeTab === 'evolution' && (
                    <TrainerStudentEvolutionSection studentId={studentId} studentDetails={student.details} />
                )}

                {activeTab === 'photos_activities' && (
                    <>
                        <RegistrySection>
                            <TrainerStudentPhotosContent relationshipId={id} studentId={studentId} />
                        </RegistrySection>
                        <RegistrySection
                            title="Atividades Recentes"
                            subtitle="Histórico cronológico detalhado das últimas ações e logs de treinamento registrados pelo aluno."
                            icon="Activity"
                        >
                            <TrainerStudentRecentActivitiesContent studentId={studentId} />
                        </RegistrySection>
                    </>
                )}

                {activeTab === 'profile' && (
                    <RegistrySection
                        title="Perfil & Dados Gerais"
                        subtitle="Consulte e edite as informações cadastrais, contatos e dados gerais de perfil do aluno."
                        icon="User"
                    >
                        <TrainerStudentProfileSection studentId={studentId} student={student} />
                    </RegistrySection>
                )}
            </RegistryMain>
        </HydrationBoundary >
    )
}

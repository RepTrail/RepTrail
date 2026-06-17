import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import * as actions from '@/lib/dal/remote'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerStudentErgogenicsSection } from '@/components/store/sections/trainer-student-ergogenics-section'
import { TrainerStudentNotFoundSection } from '@/components/store/sections/trainer-student-not-found-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'

import { TrainerStudentErgogenicsHeaderActions } from '@/components/store/advanced/trainer-student-ergogenics-header-actions'

export const metadata = {
    title: 'Ergogênicos & Ciclos | RepTrail',
}

export default async function StudentErgogenicsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: relationshipId } = await params
    const headerList = await headers()
    const trainerId = headerList.get('x-user-id')

    if (!trainerId) redirect('/auth/login')

    const relationship = await actions.getStudentRelationship(relationshipId)

    if (!relationship) {
        return (
            <RegistryMain
                title="ERGOGÊNICOS DO ALUNO"
                subtitle="Gerenciamento de ergogênicos"
                icon="FlaskConical"
                contextLabel="Área do Personal"
                showTabs={false}
            >
                <TrainerStudentNotFoundSection />
            </RegistryMain>
        )
    }

    const effectiveStudentId = relationship.student_id
    const studentName = relationship.student?.full_name || 'Aluno'

    const [queryClient, betaTesterMode, features] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            await qc.prefetchQuery({
                queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
                queryFn: async () => {
                    const res = await actions.getStudentErgogenics(effectiveStudentId)
                    return Array.isArray(res) ? res : []
                },
                staleTime: 1000 * 30,
            })
            return qc
        })(),
        actions.getBetaTesterMode(),
        actions.getTrainerPlanFeatures(trainerId)
    ])

    const hasErgogenics = features?.has_ergogenics ?? false
    const hasImportPdfAi = features?.has_import_pdf_ai ?? false

    return (
        <RegistryMain
            title={`ERGOGÊNICOS DE ${studentName.toUpperCase()}`}
            subtitle="Gerencie protocolos farmacológicos e suplementação do aluno."
            icon="FlaskConical"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                hasErgogenics ? (
                    <TrainerStudentErgogenicsHeaderActions
                        effectiveStudentId={effectiveStudentId}
                        studentName={studentName}
                        betaTesterMode={betaTesterMode}
                        hideImportPdf={!hasImportPdfAi}
                    />
                ) : null
            }
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasErgogenics} 
                title="Ergogênicos e Ciclos" 
                description="Seu plano não inclui o módulo de Ergogênicos. Faça upgrade para planejar e acompanhar a suplementação avançada dos alunos."
            >
                {hasErgogenics && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerStudentErgogenicsSection 
                            effectiveStudentId={effectiveStudentId}
                            studentName={studentName}
                            betaTesterMode={betaTesterMode}
                            hideImportPdf={!hasImportPdfAi}
                        />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    )
}

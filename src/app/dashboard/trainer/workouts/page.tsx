import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import * as actions from '@/lib/dal/remote'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerWorkoutsSection } from '@/components/store/sections/trainer-workouts-section'

export const metadata = {
    title: 'Biblioteca de Treinos | RepTrail',
}

export default async function TrainerWorkoutsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    const hasWorkouts = features?.has_workouts ?? false
    const hasImportPdfAi = features?.has_import_pdf_ai ?? false

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/workouts']?.(userId) || []
            await Promise.all(
                configs.map((config) =>
                    qc.prefetchQuery({
                        queryKey: config.queryKey,
                        queryFn: config.queryFn,
                        staleTime: 1000 * 30,
                    })
                )
            )
            return qc
        })(),
        actions.getBetaTesterMode(),
    ])

    return (
        <RegistryMain
            title="SISTEMA DE TREINOS"
            subtitle="Crie, importe e gerencie o acervo de treinos dos seus alunos com inteligência."
            icon="Dumbbell"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                hasWorkouts ? (
                    <TrainerRegistryHeaderActions
                        userId={userId}
                        variant="workout"
                        betaTesterMode={betaTesterMode}
                        hideImportPdf={!hasImportPdfAi}
                    />
                ) : null
            }
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasWorkouts} 
                title="Construtor de Treinos" 
                description="Seu plano não inclui o módulo de treinos. Faça upgrade para montar e enviar treinos para seus alunos."
            >
                {hasWorkouts && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerWorkoutsSection userId={userId} betaTesterMode={betaTesterMode} />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    )
}

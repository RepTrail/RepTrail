import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerDietsSection } from '@/components/store/sections/trainer-diets-section'


export const metadata = {
    title: 'Biblioteca de Dietas | RepTrail',
}

export default async function TrainerDietsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    const hasDiets = features?.has_diets ?? false
    const hasImportPdfAi = features?.has_import_pdf_ai ?? false

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/diets']?.(userId) || []
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
            title="BIBLIOTECA DE DIETAS"
            subtitle="Gerencie seus planos alimentares e atribua-os aos seus alunos."
            icon="Utensils"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                hasDiets ? (
                    <TrainerRegistryHeaderActions
                        userId={userId}
                        betaTesterMode={betaTesterMode}
                        variant="diet"
                        hideImportPdf={!hasImportPdfAi}
                    />
                ) : null
            }
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasDiets} 
                title="Planos Alimentares" 
                description="Seu plano não inclui o módulo de dietas. Faça upgrade para prescrever planos alimentares para seus alunos."
            >
                {hasDiets && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerDietsSection userId={userId} betaTesterMode={betaTesterMode} />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    )
}

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import * as actions from '@/lib/dal/remote'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerErgogenicsSection } from '@/components/store/sections/trainer-ergogenics-section'


export const metadata = {
    title: 'Protocolo Ergogênicos | RepTrail',
}

export default async function TrainerErgogenicsHubPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    const hasErgogenics = features?.has_ergogenics ?? false
    const hasImportPdfAi = features?.has_import_pdf_ai ?? false
    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/ergogenics']?.(userId) || []
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
            title="PROTOCOLO ERGOGÊNICOS"
            subtitle="Gerencie protocolos farmacológicos e suplementação avançada de seus alunos."
            icon="FlaskConical"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                hasErgogenics ? (
                    <TrainerRegistryHeaderActions
                        userId={userId}
                        variant="ergogenic"
                        betaTesterMode={betaTesterMode}
                        hideImportPdf={!hasImportPdfAi}
                    />
                ) : null
            }
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasErgogenics} 
                title="Protocolos Ergogênicos" 
                description="Seu plano não inclui o módulo de ergogênicos. Faça upgrade para montar e enviar protocolos para seus alunos."
            >
                {hasErgogenics && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerErgogenicsSection userId={userId} hasErgogenics={hasErgogenics} />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    )
}

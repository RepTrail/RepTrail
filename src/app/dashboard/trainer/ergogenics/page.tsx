import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
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
    if (features && !features.has_ergogenics) {
        redirect('/dashboard/trainer')
    }

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
                <TrainerRegistryHeaderActions
                    userId={userId}
                    variant="ergogenic"
                    betaTesterMode={betaTesterMode}
                />
            }
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TrainerErgogenicsSection userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    )
}

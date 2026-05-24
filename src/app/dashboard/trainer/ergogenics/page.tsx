import { headers } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerErgogenicsHubSmart } from '@/components/store/advanced/trainer-ergogenics-hub-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'

export const metadata = {
    title: 'Protocolo Ergogênicos | RepTrail',
}

export default async function TrainerErgogenicsHubPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

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
        getBetaTesterMode(),
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
            <Suspense
                fallback={
                    <div className="animate-pulse space-y-10">
                        <div className="h-[280px] bg-zinc-900 rounded-[2.5rem]" />
                    </div>
                }
            >
                <div suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerErgogenicsHubSmart userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}

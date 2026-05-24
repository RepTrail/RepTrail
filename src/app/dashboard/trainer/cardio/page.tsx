import { headers } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerCardioLibrarySmart } from '@/components/store/advanced/trainer-cardio-library-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'

export const metadata = {
    title: 'Biblioteca de Cardio | RepTrail',
}

export default async function TrainerCardioPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/cardio']?.(userId) || []
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
            title="BIBLIOTECA DE CARDIO"
            subtitle="Gerencie seus modelos de cardio e atribua aos seus alunos."
            icon="Flame"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                <TrainerRegistryHeaderActions
                    userId={userId}
                    variant="cardio"
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
                        <TrainerCardioLibrarySmart userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}

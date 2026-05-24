import { headers } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerWorkoutLibrarySmart } from '@/components/store/advanced/trainer-workout-library-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'

export const metadata = {
    title: 'Biblioteca de Treinos | RepTrail',
}

export default async function TrainerWorkoutsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

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
        getBetaTesterMode(),
    ])

    return (
        <RegistryMain
            title="BIBLIOTECA DE TREINOS"
            subtitle="Gerencie seus modelos de treino e atribua-os aos seus alunos."
            icon="Dumbbell"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={<TrainerRegistryHeaderActions userId={userId} betaTesterMode={betaTesterMode} variant="workout" />}
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
                        <TrainerWorkoutLibrarySmart userId={userId} betaTesterMode={betaTesterMode} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}

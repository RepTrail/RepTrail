import { headers } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerWorkoutLibrarySmart } from '@/components/store/advanced/trainer-workout-library-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
        actions.getBetaTesterMode(),
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
                    <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    </Surface>
                }
            >
                <Box suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerWorkoutLibrarySmart userId={userId} betaTesterMode={betaTesterMode} />
                    </HydrationBoundary>
                </Box>
            </Suspense>
        </RegistryMain>
    )
}

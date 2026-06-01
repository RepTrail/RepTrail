import { headers } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerCardioLibrarySmart } from '@/components/store/advanced/trainer-cardio-library-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
        actions.getBetaTesterMode(),
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
                    <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    </Surface>
                }
            >
                <Box suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TrainerCardioLibrarySmart userId={userId} />
                    </HydrationBoundary>
                </Box>
            </Suspense>
        </RegistryMain>
    )
}

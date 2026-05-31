import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { getQueryClient } from '@/lib/get-query-client'
import { StudentWorkoutManagementSmart } from '@/components/store/advanced/student-workout-management-smart'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function StudentWorkoutsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/student/workouts']?.(userId) || []
    await Promise.all(configs.map(config =>
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            staleTime: 1000 * 30
        })
    ))

    return (
        <RegistryMain
            title="MEUS TREINOS"
            subtitle="Acesse suas fichas de treino, acompanhe sua carga e execute com máxima intensidade."
            icon="Dumbbell"
            contextLabel="Treinos & Performance"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="workout" />}
        >
            <Suspense fallback={
                <Box fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box height={280} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    </Stack>
                </Box>
            }>
                <Box suppressHydrationWarning fullWidth>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentWorkoutManagementSmart userId={userId} />
                    </HydrationBoundary>
                </Box>
            </Suspense>
        </RegistryMain>
    );
}


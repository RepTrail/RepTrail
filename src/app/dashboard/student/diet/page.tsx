import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { ensureDailyTracking } from '@/actions/tracking-actions'
import { StudentDietManagementSmart } from '@/components/store/advanced/student-diet-management-smart'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'

export default async function StudentDietPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    // Fire and forget (idempotent background task)
    ensureDailyTracking(userId).catch(console.error)

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/student/diet']?.(userId) || []
    await Promise.all(configs.map(config =>
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            staleTime: 1000 * 30 // 30s instead of Infinity to allow auto-refetch
        })
    ))

    return (
        <RegistryMain
            title="MINHA DIETA"
            subtitle="Gerencie suas refeições, macros e suplementação para maximizar seus resultados."
            icon="Utensils"
            contextLabel="Nutrição & Dieta"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="diet" />}
        >
            <Suspense fallback={<Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}><Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={500} rounded={STORE_TOKENS.RADIUS.SYSTEM} /></Surface>}>
                <Box suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentDietManagementSmart userId={userId} />
                    </HydrationBoundary>
                </Box>
            </Suspense>
        </RegistryMain>
    )
}


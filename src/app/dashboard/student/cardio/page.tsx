import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { StudentCardioManagementSmart } from '@/components/store/advanced/student-cardio-management-smart'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function StudentCardioPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/student/cardio']?.(userId) || []
    await Promise.all(configs.map(config =>
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            staleTime: 1000 * 30
        })
    ))

    return (
        <RegistryMain
            title="MEUS CARDIOS"
            subtitle="Acompanhe e registre suas sessões de treinamento aeróbico."
            icon="Flame"
            contextLabel="Condicionamento & Saúde"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="cardio" />}
        >
            <Suspense fallback={
                <Box fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box height={400} bg="zinc" bgOpacity={5} rounded="system" />
                    </Stack>
                </Box>
            }>
                <Box suppressHydrationWarning fullWidth>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentCardioManagementSmart userId={userId} />
                    </HydrationBoundary>
                </Box>
            </Suspense>
        </RegistryMain>
    )
}


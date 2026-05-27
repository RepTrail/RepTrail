import { Suspense } from 'react'
import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { StudentProgressPageContent } from '@/components/store/advanced/student-progress-content'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function StudentProgressPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING ──────────────────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/student/progress']?.(userId) || []
    await Promise.all(configs.map(config => 
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            staleTime: Infinity
        })
    ))

    return (
        <RegistryMain
            title="MINHA EVOLUÇÃO"
            subtitle="Acompanhe seu peso, percentual de gordura e consistência nos treinos e dieta em tempo real."
            icon="Activity"
            contextLabel="Saúde & Performance"
            showTabs={false}
        >
            <Suspense fallback={
                <Box fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box height={10} width={48} bg="zinc" bgOpacity={5} rounded="system" />
                        <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box height={32} bg="zinc" bgOpacity={5} rounded="system" />
                            <Box height={32} bg="zinc" bgOpacity={5} rounded="system" />
                            <Box height={32} bg="zinc" bgOpacity={5} rounded="system" />
                        </Grid>
                    </Stack>
                </Box>
            }>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <StudentProgressPageContent userId={userId} />
                </HydrationBoundary>
            </Suspense>
        </RegistryMain>
    )
}


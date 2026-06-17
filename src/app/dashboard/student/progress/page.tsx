import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentProgressSection } from '@/components/store/sections/student-progress-section'

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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentProgressSection userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    );
}


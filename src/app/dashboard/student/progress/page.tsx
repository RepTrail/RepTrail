import { Suspense } from 'react'
import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { StudentProgressPageContent } from '@/components/store/advanced/student-progress-content'
import { RegistryMain } from '@/components/store/advanced/registry-main'

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
            <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-10 w-48 bg-zinc-900 rounded-xl" /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="h-32 bg-zinc-900 rounded-2xl" /><div className="h-32 bg-zinc-900 rounded-2xl" /><div className="h-32 bg-zinc-900 rounded-2xl" /></div></div>}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <StudentProgressPageContent userId={userId} />
                </HydrationBoundary>
            </Suspense>
        </RegistryMain>
    )
}


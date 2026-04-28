import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { WorkoutsListClient } from '@/components/feature/student/workouts-list-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

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
            staleTime: 1000 * 30 // 30s instead of Infinity to allow auto-refetch
        })
    ))

    return (
        <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[280px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
            <div className="max-w-7xl mx-auto" suppressHydrationWarning>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <WorkoutsListClient userId={userId} />
                </HydrationBoundary>
            </div>
        </Suspense>
    )
}

import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { CardioPageClient } from '@/components/feature/student/cardio-page-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

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
            staleTime: Infinity
        })
    ))

    return (
        <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[400px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
            <div className=" mx-auto" suppressHydrationWarning>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <CardioPageClient userId={userId} />
                </HydrationBoundary>
            </div>
        </Suspense>
    )
}

import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { CardioPageClient } from '@/components/feature/student/cardio-page-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'

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
        <RegistryMain
            title="MEUS CARDIOS"
            subtitle="Acompanhe e registre suas sessões de treinamento aeróbico."
            icon="Flame"
            contextLabel="Condicionamento & Saúde"
            showTabs={false}
        >
            <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[400px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
                <div suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <CardioPageClient userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}

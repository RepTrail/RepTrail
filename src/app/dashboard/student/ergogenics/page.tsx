import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { StudentErgogenicManagementSmart } from '@/components/store/advanced/student-ergogenic-management-smart'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'

import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'

export default async function ErgogenicsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/student/ergogenics']?.(userId) || []
    await Promise.all(configs.map(config =>
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            staleTime: 1000 * 30
        })
    ))

    return (
        <RegistryMain
            title="MEUS ERGOGÊNICOS"
            subtitle="Gerencie seu protocolo farmacológico, dosagens e agendamentos de aplicação."
            icon="FlaskConical"
            contextLabel="Protocolos & Performance"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="ergogenic" />}
        >
            <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[400px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
                <div suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentErgogenicManagementSmart userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}


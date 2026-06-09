import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentErgogenicsSection } from '@/components/store/sections/student-ergogenics-section'

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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentErgogenicsSection userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    );
}


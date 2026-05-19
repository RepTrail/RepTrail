import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentDailyDiet, getTrainerDiets, getAssignedDiets } from '@/actions/diet-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { ensureDailyTracking } from '@/actions/tracking-actions'
import { StudentDietManagementSmart } from '@/components/store/advanced/student-diet-management-smart'
import { RegistryMain } from '@/components/store/advanced/registry-main'

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
            <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[500px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
                <div suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentDietManagementSmart userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}


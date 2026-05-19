import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { StudentWorkoutManagementSmart } from '@/components/store/advanced/student-workout-management-smart'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'

import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'

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
            staleTime: 1000 * 30
        })
    ))

    return (
        <RegistryMain
            title="MEUS TREINOS"
            subtitle="Acesse suas fichas de treino, acompanhe sua carga e execute com máxima intensidade."
            icon="Dumbbell"
            contextLabel="Treinos & Performance"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="workout" />}
        >
            <Suspense fallback={<div className="animate-pulse space-y-10"><div className="h-[280px] bg-zinc-900 rounded-[2.5rem]" /></div>}>
                <div suppressHydrationWarning>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentWorkoutManagementSmart userId={userId} />
                    </HydrationBoundary>
                </div>
            </Suspense>
        </RegistryMain>
    )
}


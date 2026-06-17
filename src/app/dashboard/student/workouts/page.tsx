import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentWorkoutsSection } from '@/components/store/sections/student-workouts-section'

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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentWorkoutsSection userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    );
}


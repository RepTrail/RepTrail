import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentWorkoutsSection } from '@/components/store/sections/student-workouts-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import * as actions from '@/lib/dal/remote'

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

    const trainerRel = await actions.getStudentTrainer(userId)
    let hasFeature = true
    if (trainerRel?.trainer_id) {
        const features = await actions.getTrainerPlanFeatures(trainerRel.trainer_id)
        hasFeature = features?.has_workouts ?? false
    }

    return (
        <RegistryMain
            title="MEUS TREINOS"
            subtitle="Acesse suas fichas de treino, acompanhe sua carga e execute com máxima intensidade."
            icon="Dumbbell"
            contextLabel="Treinos & Performance"
            showTabs={false}
            rightElement={hasFeature ? <StudentRegistryHeaderActions userId={userId} type="workout" /> : null}
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasFeature} 
                title="Módulo de Treinos" 
                description="O plano atual do seu personal trainer não inclui o módulo de treinos."
            >
                {hasFeature && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentWorkoutsSection userId={userId} />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    );
}


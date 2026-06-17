import { headers } from 'next/headers'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentErgogenicsSection } from '@/components/store/sections/student-ergogenics-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import * as actions from '@/lib/dal/remote'

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

    const trainerRel = await actions.getStudentTrainer(userId)
    let hasFeature = true
    if (trainerRel?.trainer_id) {
        const features = await actions.getTrainerPlanFeatures(trainerRel.trainer_id)
        hasFeature = features?.has_ergogenics ?? false
    }

    return (
        <RegistryMain
            title="MEUS ERGOGÊNICOS"
            subtitle="Gerencie seu protocolo farmacológico, dosagens e agendamentos de aplicação."
            icon="FlaskConical"
            contextLabel="Protocolos & Performance"
            showTabs={false}
            rightElement={hasFeature ? <StudentRegistryHeaderActions userId={userId} type="ergogenic" /> : null}
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasFeature} 
                title="Módulo de Ergogênicos" 
                description="O plano atual do seu personal trainer não inclui o módulo de ergogênicos."
            >
                {hasFeature && (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentErgogenicsSection userId={userId} />
                    </HydrationBoundary>
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    );
}


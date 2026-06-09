import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerWorkoutsSection } from '@/components/store/sections/trainer-workouts-section'

export const metadata = {
    title: 'Biblioteca de Treinos | RepTrail',
}

export default async function TrainerWorkoutsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    if (features && !features.has_workouts) {
        redirect('/dashboard/trainer')
    }

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/workouts']?.(userId) || []
            await Promise.all(
                configs.map((config) =>
                    qc.prefetchQuery({
                        queryKey: config.queryKey,
                        queryFn: config.queryFn,
                        staleTime: 1000 * 30,
                    })
                )
            )
            return qc
        })(),
        actions.getBetaTesterMode(),
    ])

    return (
        <RegistryMain
            title="BIBLIOTECA DE TREINOS"
            subtitle="Gerencie seus modelos de treino e atribua-os aos seus alunos."
            icon="Dumbbell"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={<TrainerRegistryHeaderActions userId={userId} betaTesterMode={betaTesterMode} variant="workout" />}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TrainerWorkoutsSection userId={userId} betaTesterMode={betaTesterMode} />
            </HydrationBoundary>
        </RegistryMain>
    )
}

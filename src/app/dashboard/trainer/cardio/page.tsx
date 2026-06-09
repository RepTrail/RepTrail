import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerCardioSection } from '@/components/store/sections/trainer-cardio-section'


export const metadata = {
    title: 'Biblioteca de Cardio | RepTrail',
}

export default async function TrainerCardioPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    if (features && !features.has_cardio) {
        redirect('/dashboard/trainer')
    }

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/cardio']?.(userId) || []
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
            title="BIBLIOTECA DE CARDIO"
            subtitle="Gerencie seus modelos de cardio e atribua aos seus alunos."
            icon="Flame"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                <TrainerRegistryHeaderActions
                    userId={userId}
                    variant="cardio"
                    betaTesterMode={betaTesterMode}
                />
            }
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TrainerCardioSection userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    )
}

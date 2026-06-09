import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { TrainerDietsSection } from '@/components/store/sections/trainer-diets-section'


export const metadata = {
    title: 'Biblioteca de Dietas | RepTrail',
}

export default async function TrainerDietsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    if (features && !features.has_diets) {
        redirect('/dashboard/trainer')
    }

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            const configs = PREFETCH_REGISTRY['/dashboard/trainer/diets']?.(userId) || []
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
            title="BIBLIOTECA DE DIETAS"
            subtitle="Gerencie seus planos alimentares e atribua-os aos seus alunos."
            icon="Utensils"
            contextLabel="Área do Personal"
            showTabs={false}
            rightElement={
                <TrainerRegistryHeaderActions
                    userId={userId}
                    betaTesterMode={betaTesterMode}
                    variant="diet"
                />
            }
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TrainerDietsSection userId={userId} betaTesterMode={betaTesterMode} />
            </HydrationBoundary>
        </RegistryMain>
    )
}

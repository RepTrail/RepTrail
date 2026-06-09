import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { getQueryClient } from '@/lib/get-query-client'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerMetricsSection } from '@/components/store/sections/trainer-metrics-section'
import { TrainerDailyOperationSection } from '@/components/store/sections/trainer-daily-operation-section'
import { TrainerMetaPixel } from './meta-pixel'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function TrainerDashboard() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/trainer'](userId)
    await Promise.all(configs.map(c => queryClient.prefetchQuery(c)))

    const betaTesterMode = await actions.getBetaTesterMode()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerMetaPixel />
            <RegistryMain
                title="VISÃO GERAL"
                subtitle="Bem-vindo de volta. Acompanhe o desempenho do seu time."
                icon="LayoutDashboard"
                contextLabel="Área do Personal"
                showTabs={false}
            >
                <RegistrySection>
                    <TrainerMetricsSection userId={userId} />
                </RegistrySection>
                <RegistrySection>
                    <TrainerDailyOperationSection userId={userId} betaTesterMode={betaTesterMode} />
                </RegistrySection>
            </RegistryMain>
        </HydrationBoundary>
    )
}

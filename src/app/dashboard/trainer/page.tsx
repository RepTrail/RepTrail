import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { TrainerDashboardClient } from '@/components/feature/trainer/trainer-dashboard-client'
import { TrainerMetaPixel } from './meta-pixel'

export default async function TrainerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/trainer'](user.id)
    await Promise.all(configs.map(c => queryClient.prefetchQuery(c)))

    const betaTesterMode = await getBetaTesterMode()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerMetaPixel />
            <TrainerDashboardClient userId={user.id} betaTesterMode={betaTesterMode} />
        </HydrationBoundary>
    )
}

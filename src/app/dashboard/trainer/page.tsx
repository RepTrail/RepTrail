import { getTrainerProfile, getEffectiveTier, getTrainerRanking, getTrainerActivityFeed } from '@/actions/trainer-actions'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { TrainerDashboardClient } from '@/components/feature/trainer/trainer-dashboard-client'
import { TrainerMetaPixel } from './meta-pixel'

export default async function TrainerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.profile.detail(user.id), 
        queryFn: getTrainerProfile 
    })
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.trainer.effectiveTier(user.id), 
        queryFn: getEffectiveTier 
    })
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.trainer.ranking(), 
        queryFn: getTrainerRanking 
    })
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.trainer.activity(user.id), 
        queryFn: getTrainerActivityFeed 
    })

    const betaTesterMode = await getBetaTesterMode()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerMetaPixel />
            <TrainerDashboardClient userId={user.id} betaTesterMode={betaTesterMode} />
        </HydrationBoundary>
    )
}

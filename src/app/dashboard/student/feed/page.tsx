import { dehydrate, HydrationBoundary } from '@/lib/dal'
import * as actions from '@/lib/dal/remote'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { CommunityFeedSectionContent } from '@/components/store/sections/community-feed-section-content'
import { RegistryMain } from '@/components/store/advanced/registry-main'

export const metadata = {
    title: 'Feed de Alunos | RepTrail'
}

export default async function StudentFeedPage() {
    const queryClient = getQueryClient()
    
    // Prefetch for SSR
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.public.feed,
        queryFn: () => actions.getPublicFeed()
    })

    return (
        <RegistryMain
            title="FEED DA COMUNIDADE"
            subtitle="Explore os resultados, treinos e conquistas da nossa comunidade de alta performance."
            icon="Sparkles"
            contextLabel="Comunidade RepTrail"
            showTabs={false}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <CommunityFeedSectionContent />
            </HydrationBoundary>
        </RegistryMain>
    )
}


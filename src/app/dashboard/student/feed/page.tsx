import { getPublicFeed } from '@/actions/student-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { FeedClient } from '@/components/feature/student/feed-client'
import { RegistryMain } from '@/components/store/advanced/registry-main'

export const metadata = {
    title: 'Feed de Alunos | RepTrail'
}

export default async function StudentFeedPage() {
    const queryClient = getQueryClient()
    
    // Prefetch for SSR
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.public.feed,
        queryFn: () => getPublicFeed()
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
                <FeedClient />
            </HydrationBoundary>
        </RegistryMain>
    )
}

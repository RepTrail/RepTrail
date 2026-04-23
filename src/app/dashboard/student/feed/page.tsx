import { getPublicFeed } from '@/actions/student-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { FeedClient } from '@/components/feature/student/feed-client'

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
        <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            Feed de <span className="text-orange-500">Alunos</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        Veja a evolução dos alunos da plataforma.
                    </p>
                </div>
            </header>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <FeedClient />
            </HydrationBoundary>
        </div>
    )
}

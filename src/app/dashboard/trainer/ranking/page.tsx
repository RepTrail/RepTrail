import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { TrainerRankingClient } from '@/components/store/features(deprecated)/trainer-ranking-client'

export const revalidate = 0

export default async function RankingPage() {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.trainer.ranking(),
        queryFn: getTrainerRanking
    })

    const ranking = await getTrainerRanking()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerRankingClient initialRanking={ranking} />
        </HydrationBoundary>
    )
}


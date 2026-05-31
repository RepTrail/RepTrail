import { actions, dehydrate, HydrationBoundary } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RankingSectionContent } from '@/components/store/sections/ranking-section-content'

export const metadata = {
    title: 'Ranking | RepTrail'
}

export default async function StudentRankingPage() {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.admin.trainers,
        queryFn: () => actions.getTrainerRanking()
    })

    return (
        <RegistryMain
            title="RANKING DE TREINADORES"
            subtitle="Veja quem são os profissionais mais bem avaliados da plataforma."
            icon="Trophy"
            contextLabel="Social & Performance"
            showTabs={false}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <RankingSectionContent />
            </HydrationBoundary>
        </RegistryMain>
    )
}

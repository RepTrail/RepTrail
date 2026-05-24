import { getTrainerRanking } from '@/actions/trainer-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RankingSectionContent } from '@/components/store/sections/ranking-section-content'

export const metadata = {
    title: 'Ranking | RepTrail'
}

export default async function TrainerRankingPage() {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.admin.trainers,
        queryFn: () => getTrainerRanking()
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

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Trophy, TrendingUp } from 'lucide-react'
import { RankingPodiumCard } from '@/components/store/intermediary/ranking-podium-card'
import { RankingListItem } from '@/components/store/intermediary/ranking-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerRanking } from '@/actions/trainer-actions'

/**
 * RankingSectionContent: Composes Podium and General Ranking sections.
 * Fully data-driven via React Query + getTrainerRanking action.
 */
export function RankingSectionContent() {
    const { data: ranking = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.trainers,
        queryFn: () => getTrainerRanking(),
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

    if (isLoading) {
        return <EmptyState icon={Trophy} title="CARREGANDO..." description="BUSCANDO OS MELHORES TREINADORES." />
    }

    if (ranking.length === 0) {
        return (
            <EmptyState
                icon={Trophy}
                title="RANKING INDISPONÍVEL"
                description="AGUARDANDO O FECHAMENTO DO CICLO PARA GERAR O PÓDIO."
            />
        )
    }

    const podium = ranking.slice(0, 3)
    const generalList = ranking.slice(3)

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
            {/* 1. Pódio Section */}
            <RegistrySection
                title="PÓDIO REPTRAIL"
                subtitle="O top 3 do momento na nossa comunidade."
                icon={TrendingUp}
            >
                <Grid cols={{ base: 2, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {podium.map((trainer: any, idx: number) => (
                        <RankingPodiumCard
                            key={trainer.id}
                            rank={idx + 1}
                            trainer={trainer}
                        />
                    ))}
                </Grid>
            </RegistrySection>

            {/* 2. Classificação Geral Section (only if there are more than 3) */}
            {generalList.length > 0 && (
                <RegistrySection
                    title="CLASSIFICAÇÃO GERAL"
                    subtitle="Todos os treinadores certificados e ativos."
                    icon={Trophy}
                >
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {generalList.map((trainer: any, idx: number) => (
                            <RankingListItem
                                key={trainer.id}
                                rank={idx + 4}
                                trainer={trainer}
                            />
                        ))}
                    </Stack>
                </RegistrySection>
            )}
        </Stack>
    )
}

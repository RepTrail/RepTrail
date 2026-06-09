'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Trophy, TrendingUp } from 'lucide-react'
import { RankingPodiumCard } from '@/components/store/intermediary/ranking-podium-card'
import { RankingListItem } from '@/components/store/intermediary/ranking-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerRanking } from '@/lib/dal/remote'

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
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={TrendingUp} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>PÓDIO REPTRAIL</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>O top 3 do momento na nossa comunidade.</Font>
                    </Stack>
                </Stack>
                <Grid cols={{ base: 1, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {podium.map((trainer: any, idx: number) => (
                        <RankingPodiumCard
                            key={trainer.id}
                            rank={idx + 1}
                            trainer={trainer}
                        />
                    ))}
                </Grid>
            </Stack>

            {/* 2. Classificação Geral Section (only if there are more than 3) */}
            {generalList.length > 0 && (
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                    <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={Trophy} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>CLASSIFICAÇÃO GERAL</Font>
                            </Inline>
                            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Todos os treinadores certificados e ativos.</Font>
                        </Stack>
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {generalList.map((trainer: any, idx: number) => (
                            <RankingListItem
                                key={trainer.id}
                                rank={idx + 4}
                                trainer={trainer}
                            />
                        ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}

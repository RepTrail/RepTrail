'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Trophy, TrendingUp } from 'lucide-react'
import { RankingPodiumCard } from '@/components/store/intermediary/ranking-podium-card'
import { RankingListItem } from '@/components/store/intermediary/ranking-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * RankingSectionContent: Composes Podium and General Ranking sections.
 * Faithful to Image 35 and 36.
 */
export function RankingSectionContent({ isEmpty = false }: { isEmpty?: boolean }) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={Trophy}
                title="RANKING INDISPONÍVEL"
                description="Aguardando o fechamento do ciclo para gerar o pódio."
            />
        )
    }

    const podiumItems = [
        { full_name: 'CARLETTO', rating: 5.0, studentCount: 3, score: 36, region: 'BRASIL' },
        { full_name: 'CARLOS DANILO BARRETO DOS...', rating: 0.0, studentCount: 1, score: 7, region: 'BRASIL' },
        { full_name: 'EMERSON MARCHESI', rating: 0.0, studentCount: 1, score: 7, region: 'BRASIL' }
    ]

    const generalRanking = [
        { full_name: 'DIOGO BADE', rating: 0.0, studentCount: 1 },
        { full_name: 'CÉSAR MARTINS', rating: 0.0, studentCount: 1 },
        { full_name: 'SADANTRAINING', rating: 0.0, studentCount: 0 }
    ]

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
            {/* 1. Pódio Section */}
            <RegistrySection
                title="PÓDIO REPTRAIL"
                subtitle="O top 3 do momento na nossa comunidade."
                icon={TrendingUp}
            >
                <Grid cols={{ base: 2.5, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {podiumItems.map((item, idx) => (
                        <RankingPodiumCard 
                            key={idx}
                            rank={idx + 1}
                            trainer={item}
                        />
                    ))}
                </Grid>
            </RegistrySection>

            {/* 2. Classificação Geral Section */}
            <RegistrySection
                title="CLASSIFICAÇÃO GERAL"
                subtitle="Todos os treinadores certificados e ativos."
                icon={Trophy}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {generalRanking.map((item, idx) => (
                        <RankingListItem 
                            key={idx}
                            rank={idx + 4}
                            trainer={item}
                        />
                    ))}
                </Stack>
            </RegistrySection>
        </Stack>
    )
}

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Trophy } from "lucide-react"
import { PodiumCard, RankingRow } from '@/components/feature/shared/ranking-cards'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface TrainerRankingClientProps {
    initialRanking: any[]
}

export function TrainerRankingClient({ initialRanking }: TrainerRankingClientProps) {
    const { data: ranking = initialRanking } = useQuery({
        queryKey: QUERY_KEYS.trainer.ranking(),
        queryFn: getTrainerRanking,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return (
        <RegistryMain
            title="RANKING DE TREINADORES"
            subtitle="Veja quem são os treinadores mais ativos e bem avaliados da plataforma."
            icon={Trophy}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Stack gap={10}>
                {/* Top 3 Podium */}
                <Grid gap={8} lgCols={3}>
                    {ranking.slice(0, 3).map((trainer: any, index: number) => (
                        <PodiumCard
                            key={trainer.id}
                            trainer={trainer}
                            rank={index + 1}
                        />
                    ))}
                </Grid>

                {/* General List */}
                <Stack gap={5}>
                    <div className="flex items-center gap-3 px-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Classificação Geral</h2>
                    </div>

                    <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-zinc-800/50">
                                {ranking.slice(3).map((trainer: any, index: number) => (
                                    <RankingRow
                                        key={trainer.id}
                                        trainer={trainer}
                                        rank={index + 4}
                                    />
                                ))}
                                {ranking.length === 0 && (
                                    <div className="p-20 text-center">
                                        <EmptyState 
                                            icon={Trophy} 
                                            title="Nenhum treinador ranqueado" 
                                            description="Ainda não há treinadores ranqueados na plataforma." 
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Stack>
        </RegistryMain>
    )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Trophy, Activity, Search } from "lucide-react"
import { PodiumCard, RankingRow } from '@/components/store/features(deprecated)/ranking-cards'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { EmptyState } from '@/components/store/intermediary/empty-state'

export default function StudentRankingPage() {
    const { data: ranking = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.trainers, // Reusing trainer query key for ranking
        queryFn: () => getTrainerRanking()
    })

    return (
        <RegistryMain
            title="RANKING DE TREINADORES"
            subtitle="Veja quem são os profissionais mais bem avaliados da plataforma."
            icon={Trophy}
            contextLabel="Social & Performance"
            showTabs={false}
        >
            <RegistrySection
                title="Pódio RepTrail"
                subtitle="O top 3 do momento na nossa comunidade."
                icon={TrendingUp}
            >
                {isLoading ? (
                    <EmptyState icon={Trophy} title="Carregando..." description="Buscando os melhores treinadores." />
                ) : ranking.length === 0 ? (
                    <EmptyState icon={Search} title="Nenhum ranking disponível" description="Ainda não há dados suficientes para gerar o ranking." />
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {ranking.slice(0, 3).map((trainer: any, index: number) => (
                            <PodiumCard
                                key={trainer.id}
                                trainer={trainer}
                                rank={index + 1}
                            />
                        ))}
                    </div>
                )}
            </RegistrySection>

            {!isLoading && ranking.length > 3 && (
                <RegistrySection
                    title="Classificação Geral"
                    subtitle="Todos os treinadores certificados e ativos."
                    icon={Activity}
                >
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
                            </div>
                        </CardContent>
                    </Card>
                </RegistrySection>
            )}
        </RegistryMain>
    )
}


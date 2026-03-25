import { getTrainerRanking } from '@/actions/trainer-actions'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { RankingHeader } from '@/components/feature/student/ranking-header'
import { PodiumCard, RankingRow } from '@/components/feature/shared/ranking-cards'

export const revalidate = 0

export default async function StudentRankingPage() {
    const ranking = await getTrainerRanking()

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 " suppressHydrationWarning>
            {/* Header Section */}
            <RankingHeader />
            {/* Top 3 Podium */}
            <div className="grid gap-8 lg:grid-cols-3">
                {ranking.slice(0, 3).map((trainer: any, index: number) => (
                    <PodiumCard
                        key={trainer.id}
                        trainer={trainer}
                        rank={index + 1}
                    />
                ))}
            </div>

            {/* General List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4px-2">
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Activity } from 'lucide-react'
import { StudentMetricsChart } from './student-metrics-chart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PerformanceAnalysisSectionProps {
    weights: { weight_kg: number; recorded_at: string }[]
    bfs: { bf_percentage: number; recorded_at: string }[]
    frequency: { week: string; date: string; sessions: number }[]
    trainerTier: string
    isStudentView?: boolean
}

export function PerformanceAnalysisSection({
    weights,
    bfs,
    frequency,
    trainerTier,
    isStudentView = false
}: PerformanceAnalysisSectionProps) {
    const isBlocked = trainerTier === 'start'

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-system overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
            <CardHeader className="p-8 md:p-12 pb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tight">
                            Análise de Performance
                        </CardTitle>
                        <p className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">
                            Peso, BF e Frequência
                        </p>
                    </div>

                </div>
            </CardHeader>
            <CardContent className="p-8 md:p-12 pt-0">
                {isBlocked ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-zinc-950/50 rounded-system border border-dashed border-zinc-800">
                        <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-2xl">
                            <TrendingUp className="w-8 h-8 text-zinc-700" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Gráficos de Evolução</h3>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed">
                                {isStudentView
                                    ? <>Esta função está disponível apenas para alunos de treinadores <span className="text-emerald-500">PRO e ELITE</span>.</>
                                    : <>Esta função está disponível apenas para treinadores <span className="text-emerald-500">PRO e ELITE</span>.</>
                                }
                            </p>
                        </div>
                        {!isStudentView && (
                            <Button asChild className="bg-emerald-500 text-zinc-950 hover:bg-emerald-600 font-black italic uppercase text-[10px] tracking-widest rounded-system px-8 h-11 shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                                <Link href="/dashboard/trainer/profile">Fazer Upgrade Agora</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <StudentMetricsChart
                        weights={weights}
                        bfs={bfs}
                        frequency={frequency}
                    />
                )}
            </CardContent>
        </Card>
    )
}


import { TrendingUp } from 'lucide-react'
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

    if (isBlocked) {
        return (
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
        )
    }

    return (
        <StudentMetricsChart
            weights={weights}
            bfs={bfs}
            frequency={frequency}
        />
    )
}

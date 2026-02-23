import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
import { AdherenceChart } from '@/components/feature/student/adherence-chart'
import { Target, TrendingUp } from 'lucide-react'

export async function MetricsAndEvolution({ studentId, steroidUse }: { studentId: string, steroidUse: boolean }) {
    const [fullMetrics, adherenceHistory] = await Promise.all([
        getStudentFullMetrics(studentId),
        getStudentAdherenceHistory(studentId, 30)
    ])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Consistência Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Target className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-black italic uppercase tracking-tight">Consistência (30D)</h2>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm p-6 md:p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Peso Atual</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black italic text-emerald-500">
                                    {fullMetrics.weights.length > 0 ? fullMetrics.weights[fullMetrics.weights.length - 1].weight_kg : '--'}
                                </span>
                                <span className="text-[10px] font-black uppercase text-zinc-600 italic">kg</span>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">BF Atual</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black italic text-emerald-500">
                                    {fullMetrics.bfs.length > 0 ? fullMetrics.bfs[fullMetrics.bfs.length - 1].bf_percentage : (fullMetrics.details?.body_fat || '--')}
                                </span>
                                <span className="text-[10px] font-black uppercase text-zinc-600 italic">%</span>
                            </div>
                        </div>
                    </div>

                    <AdherenceChart
                        history={adherenceHistory || []}
                        showErgogenics={steroidUse}
                        noCard={true}
                    />
                </div>
            </div>

            {/* Evolution Stats */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Evolução Analítica</h2>
                </div>
                <PerformanceAnalysisSection
                    weights={fullMetrics.weights}
                    bfs={fullMetrics.bfs.length > 0 ? fullMetrics.bfs : (fullMetrics.details?.body_fat ? [
                        { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date(Date.now() - 86400000 * 5).toISOString() },
                        { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date().toISOString() }
                    ] : [])}
                    frequency={fullMetrics.frequency}
                    trainerTier="elite"
                    isStudentView={true}
                />
            </div>
        </div>
    )
}

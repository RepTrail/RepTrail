import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
import { UnifiedAdherenceChart } from '@/components/feature/shared/unified-adherence-chart'
import { StatCard } from '@/components/feature/shared/stat-card'
import { Target, TrendingUp, Droplet } from 'lucide-react'

export async function MetricsAndEvolution({ studentId, steroidUse }: { studentId: string, steroidUse: boolean }) {
    const [fullMetrics, adherenceHistory] = await Promise.all([
        getStudentFullMetrics(studentId),
        getStudentAdherenceHistory(studentId, 30)
    ])

    // Trend calculation (consistent with Student Dashboard)
    const weights = fullMetrics.weights
    const lastWeight = weights[weights.length - 1]?.weight_kg
    const firstWeight = weights[0]?.weight_kg

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const weight30d = [...weights].reverse().find(w => w.recorded_at < thirtyDaysAgoStr)?.weight_kg || firstWeight
    const weightChange30d = (weight30d && lastWeight) ? (lastWeight - weight30d).toFixed(1) : null

    const bfs = fullMetrics.bfs
    const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : fullMetrics.details?.body_fat
    const firstBF = bfs.length > 0 ? bfs[0]?.bf_percentage : fullMetrics.details?.body_fat

    const bf30d = [...bfs].reverse().find(b => b.recorded_at < thirtyDaysAgoStr)?.bf_percentage || firstBF
    const bfChange30d = (bfs.length > 1 && bf30d !== lastBF) ? (lastBF - bf30d).toFixed(1) : null

    // Adherence Avg (30D)
    const last30dAdherence = (adherenceHistory || []).filter(h => (h.diet_percentage || 0) > 0 || h.workout_status === 'completed' || h.cardio_status === 'completed')
    const avgAdherence = last30dAdherence.length > 0 ? (
        last30dAdherence.reduce((acc: number, h: any) => {
            const pillars = [
                h.diet_percentage || 0,
                h.workout_status === 'completed' ? 100 : 0,
                h.cardio_status === 'completed' ? 100 : 0,
                h.ergogenics_status === 'completed' ? 100 : 0
            ]
            return acc + (pillars.reduce((a, b) => a + b, 0) / 4)
        }, 0) / last30dAdherence.length
    ).toFixed(0) : 0

    return (
        <div className="flex flex-col gap-12">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    label="Peso Atual"
                    value={lastWeight || '--'}
                    unit="kg"
                    icon={<TrendingUp className="w-4 h-4" />}
                    trend={weightChange30d ? (parseFloat(weightChange30d) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={weightChange30d ? `${Math.abs(parseFloat(weightChange30d))}kg` : '--'}
                    trendLabel={weightChange30d ? "no último mês" : "Sem histórico"}
                />
                <StatCard
                    label="BF (Estimado)"
                    value={lastBF || '--'}
                    unit="%"
                    icon={<Droplet className="w-4 h-4" />}
                    trend={bfChange30d ? (parseFloat(bfChange30d) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={bfChange30d ? `${Math.abs(parseFloat(bfChange30d))}%` : '--'}
                    trendLabel={bfChange30d ? "no último mês" : "Neutro / Sem histórico"}
                />
                <StatCard
                    label="Adesão (30D)"
                    value={avgAdherence}
                    unit="%"
                    icon={<Target className="w-4 h-4" />}
                    trend="none"
                    trendVal=""
                    trendLabel="Média dos 4 Pilares"
                />
            </div>

            {/* Consistência Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 px-2">
                    <Target className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-black italic uppercase tracking-tight">Consistência (30D)</h2>
                </div>

                <div className="max-w-full overflow-hidden">
                    <UnifiedAdherenceChart
                        history={adherenceHistory || []}
                        showErgogenics={steroidUse}
                    />
                </div>
            </div>

            {/* Evolution Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 px-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Evolução Analítica</h2>
                </div>
                <PerformanceAnalysisSection
                    weights={fullMetrics.weights}
                    bfs={fullMetrics.bfs}
                    frequency={fullMetrics.frequency}
                    trainerTier="elite"
                    isStudentView={true}
                />
            </div>
        </div>
    )
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, TrendingUp, TrendingDown, Target, Ruler, Droplet, Camera, History, Images } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { getStudentMetricsHistory, getTrainingFrequency, getWeeklyVolume, getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentWorkoutHistory } from '@/actions/log-actions'
import { StudentMetricsChart } from '@/components/feature/trainer/student-metrics-chart'
import { StudentWorkoutHistory } from '@/components/feature/trainer/student-workout-history'
import { ProgressPhotoUpload } from '@/components/feature/student/progress-photo-upload'
import { StudentProgressGallery } from '@/components/feature/student/student-progress-gallery'
import { getAdherenceHistory } from '@/actions/tracking-actions'
import { AdherenceChart } from '@/components/feature/student/adherence-chart'
import Link from 'next/link'

export default async function StudentProgressPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch real data
    const fullMetrics = await getStudentFullMetrics(user.id)
    const metricsHistory = { weights: fullMetrics.weights, bfs: fullMetrics.bfs }
    const trainingFrequency = fullMetrics.frequency

    // 1. Get Trainer ID
    const { data: relationship } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user.id)
        .single()

    // 2. Get Trainer Tier
    let trainerTier = 'start'
    if (relationship?.trainer_id) {
        const { data: trainerProfile } = await supabase
            .from('profiles')
            .select('plan_tier')
            .eq('id', relationship.trainer_id)
            .single()
        trainerTier = trainerProfile?.plan_tier || 'start'
    }

    // Metrics & Trends
    const weights = metricsHistory.weights
    const lastWeight = weights[weights.length - 1]?.weight_kg
    const prevWeight = weights[weights.length - 2]?.weight_kg
    const weightTrend = prevWeight ? (lastWeight - prevWeight).toFixed(1) : null

    const bfs = metricsHistory.bfs
    const lastBF = bfs[bfs.length - 1]?.bf_percentage
    const prevBF = bfs[bfs.length - 2]?.bf_percentage
    const bfTrend = prevBF ? (lastBF - prevBF).toFixed(1) : null

    const weeklyAvg = metricsHistory.weights.length > 0 ? "Ativo" : "Sem dados"

    const history = await getStudentWorkoutHistory(user.id)
    const adherenceHistory = await getAdherenceHistory(30)

    const { data: progressPhotosData } = await supabase
        .from('progress_photos')
        .select('id, front_url, back_url, side_right_url, side_left_url, created_at')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

    const progressPhotos = progressPhotosData || []

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    <h1 className="text-5xl font-black tracking-tight text-white uppercase italic">
                        Minha Evolução
                    </h1>
                </div>
                <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    Os números não mentem: você está cada dia mais forte.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    label="Peso Atual"
                    value={lastWeight || '--'}
                    unit="kg"
                    icon={<TrendingUp className="w-4 h-4" />}
                    trend={weightTrend ? (parseFloat(weightTrend) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={weightTrend ? `${Math.abs(parseFloat(weightTrend))}kg` : '--'}
                    trendLabel={weightTrend ? "desde a última" : "Sem histórico"}
                />
                <StatCard
                    label="Percentual de Gordura"
                    value={lastBF || '--'}
                    unit="%"
                    icon={<Droplet className="w-4 h-4" />}
                    trend={bfTrend ? (parseFloat(bfTrend) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={bfTrend ? `${Math.abs(parseFloat(bfTrend))}%` : '--'}
                    trendLabel={bfTrend ? "desde a última" : "Sem histórico"}
                />
                <StatCard
                    label="Status do Plano"
                    value={weeklyAvg}
                    unit=""
                    icon={<Activity className="w-4 h-4" />}
                    trend="none"
                    trendVal=""
                    trendLabel="Acompanhamento Ativo"
                />
            </div>

            {/* Photo Upload Section */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[3rem] overflow-hidden backdrop-blur-sm">
                <CardHeader className="p-10 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                                <Camera className="w-6 h-6 text-purple-500" />
                                Registro de Evolução
                            </h2>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Envie suas fotos periodicamente para o seu treinador avaliar seu progresso.</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <ProgressPhotoUpload studentId={user.id} />
                </CardContent>
            </Card>

            {/* Galeria do Aluno */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                <CardHeader className="p-8 md:p-10 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                                <Images className="w-6 h-6 text-purple-500" />
                                Galeria
                            </h2>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Suas fotos de evolução. Passe o mouse sobre um registro para remover.</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-10 pt-0">
                    <StudentProgressGallery photos={progressPhotos} />
                </CardContent>
            </Card>

            {/* Histórico de Treinos - antes do gráfico */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                <CardHeader className="p-8 md:p-10 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                                <History className="w-6 h-6 text-emerald-500" />
                                Histórico de Treinos
                            </CardTitle>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Seus treinos concluídos com cargas e evolução</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-10 pt-0">
                    <StudentWorkoutHistory
                        history={history}
                        isBlocked={trainerTier === 'start'}
                    />
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
                <CardHeader className="p-8 md:p-12 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tight">Análise de Performance</CardTitle>
                            <p className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">Peso, BF e Frequência</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12 pt-0">
                    {trainerTier === 'start' ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-950/50 rounded-3xl border border-dashed border-zinc-800">
                            <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-2xl">
                                <TrendingUp className="w-8 h-8 text-zinc-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Gráficos de Evolução</h3>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest max-w-[280px]">
                                    Esta função está disponível apenas para alunos de treinadores <span className="text-emerald-500">PRO e ELITE</span>.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <StudentMetricsChart
                            weights={metricsHistory.weights}
                            bfs={metricsHistory.bfs}
                            frequency={trainingFrequency || []}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Adherence Chart */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                <AdherenceChart history={adherenceHistory} />
            </div>

        </div>
    )
}

function StatCard({ label, value, unit, trend, trendVal, trendLabel, icon }: any) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2rem] overflow-hidden group backdrop-blur-sm transition-all hover:border-zinc-700/50 relative">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <CardHeader className="p-8 relative z-10">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="text-emerald-500">{icon}</span>
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{value}</span>
                    <span className="text-sm font-black text-zinc-600 uppercase italic tracking-widest">{unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-6 bg-zinc-950/30 w-fit px-3 py-1.5 rounded-xl border border-zinc-800/50">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : ''} {trendVal}
                    </span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{trendLabel}</span>
                </div>
            </CardHeader>
        </Card>
    )
}

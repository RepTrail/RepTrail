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
import { StatCard } from '@/components/feature/shared/stat-card'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
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
    // FORCE PRO/ELITE view for everyone as tiers are deprecated for student features
    let trainerTier = 'pro'
    /*
    if (relationship?.trainer_id) {
        const { data: trainerProfile } = await supabase
            .from('profiles')
            .select('plan_tier')
            .eq('id', relationship.trainer_id)
            .single()
        trainerTier = trainerProfile?.plan_tier || 'pro'
    }
    */

    // Metrics & Trends
    const weights = metricsHistory.weights
    const lastWeight = weights[weights.length - 1]?.weight_kg
    const firstWeight = weights[0]?.weight_kg

    // Calculate weight change from 30 days ago (or first available)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const weight30d = [...weights].reverse().find(w => w.recorded_at < thirtyDaysAgoStr)?.weight_kg || firstWeight
    const weightChange30d = (weight30d && lastWeight) ? (lastWeight - weight30d).toFixed(1) : null

    const bfs = metricsHistory.bfs
    const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : fullMetrics.details?.body_fat
    const firstBF = bfs.length > 0 ? bfs[0]?.bf_percentage : fullMetrics.details?.body_fat

    // Calculate BF change (30 days or first available)
    const bf30d = [...bfs].reverse().find(b => b.recorded_at < thirtyDaysAgoStr)?.bf_percentage || firstBF
    const bfChange30d = (bfs.length > 1 && bf30d !== lastBF) ? (lastBF - bf30d).toFixed(1) : null

    const history = await getStudentWorkoutHistory(user.id)
    const adherenceHistory = await getAdherenceHistory(30)

    // Calculate Adherence Average (last 30 days)
    const last30dAdherence = (adherenceHistory || []).filter(h => h.diet_percentage > 0 || h.workout_status === 'completed' || h.cardio_status === 'completed')
    const avgAdherence = last30dAdherence.length > 0 ? (
        last30dAdherence.reduce((acc, h) => {
            const pillars = [
                h.diet_percentage,
                h.workout_status === 'completed' ? 100 : 0,
                h.cardio_status === 'completed' ? 100 : 0,
                h.ergogenics_status === 'completed' ? 100 : 0
            ]
            return acc + (pillars.reduce((a, b) => a + b, 0) / 4)
        }, 0) / last30dAdherence.length
    ).toFixed(0) : 0

    const { data: progressPhotosData } = await supabase
        .from('progress_photos')
        .select('id, front_url, back_url, side_right_url, side_left_url, created_at')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

    const progressPhotos = progressPhotosData || []

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-32 px-4 sm:px-6 md:px-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-zinc-950" />
                        </div>
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                            Minha <span className="text-orange-500">Evolução</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        Acompanhe seu progresso físico e evolução corporal.
                    </p>
                </div>
            </header>

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
                    label="Percentual de Gordura"
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
                <CardContent className="p-4 sm:p-8 md:p-10 pt-0">
                    <StudentWorkoutHistory
                        history={history}
                        isBlocked={trainerTier === 'start'}
                    />
                </CardContent>
            </Card>

            <PerformanceAnalysisSection
                weights={metricsHistory.weights}
                bfs={metricsHistory.bfs.length > 0 ? metricsHistory.bfs : (fullMetrics.details?.body_fat ? [
                    { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date(Date.now() - 86400000 * 5).toISOString() }, // 5 dias atrás 
                    { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date().toISOString() } // Hoje
                ] : [])}
                frequency={trainingFrequency || []}
                trainerTier={trainerTier}
                isStudentView={true}
            />

            {/* Adherence Chart */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                <AdherenceChart history={adherenceHistory} showErgogenics={!!fullMetrics.details?.steroid_use} />
            </div>

        </div>
    )
}



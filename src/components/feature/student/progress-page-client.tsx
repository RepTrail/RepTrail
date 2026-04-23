'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Target, Droplet, Camera, History, Images } from "lucide-react"
import { StudentWorkoutHistory } from '@/components/feature/trainer/student-workout-history'
import { ProgressPhotoUpload } from '@/components/feature/student/progress-photo-upload'
import { UnifiedAdherenceChart } from '@/components/feature/shared/unified-adherence-chart'
import { UnifiedProgressGallery } from '@/components/feature/shared/unified-progress-gallery'
import { StatCard } from '@/components/feature/shared/stat-card'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentWorkoutHistory } from '@/actions/log-actions'
import { getAdherenceHistory } from '@/actions/tracking-actions'
import { getProgressPhotos } from '@/actions/student-actions'
import { useMemo } from 'react'

interface ProgressPageClientProps {
    userId: string
}

export function ProgressPageClient({ userId }: ProgressPageClientProps) {
    // 1. Fetching via TanStack Query (Hydrated)
    const { data: fullMetrics } = useQuery({
        queryKey: QUERY_KEYS.student.metrics(userId),
        queryFn: () => getStudentFullMetrics(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: workoutHistory = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.logs(userId),
        queryFn: () => getStudentWorkoutHistory(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: adherenceHistory = [] } = useQuery({
        queryKey: ['adherence', 30], // Generic key for 30d adherence
        queryFn: () => getAdherenceHistory(30),
        staleTime: 1000 * 60 * 5
    })

    const { data: progressPhotos = [] } = useQuery({
        queryKey: ['progress-photos', userId],
        queryFn: () => getProgressPhotos(userId),
        staleTime: 1000 * 60 * 5
    })

    // 2. Complex Calculations (Memoized)
    const stats = useMemo(() => {
        if (!fullMetrics) return null

        const weights = fullMetrics.weights || []
        const bfs = fullMetrics.bfs || []
        
        const lastWeight = weights[weights.length - 1]?.weight_kg
        const firstWeight = weights[0]?.weight_kg

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

        const weight30d = [...weights].reverse().find(w => w.recorded_at < thirtyDaysAgoStr)?.weight_kg || firstWeight
        const weightChange30d = (weight30d && lastWeight) ? (lastWeight - weight30d).toFixed(1) : null

        const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : fullMetrics.details?.body_fat
        const firstBF = bfs.length > 0 ? bfs[0]?.bf_percentage : fullMetrics.details?.body_fat

        const bf30d = [...bfs].reverse().find(b => b.recorded_at < thirtyDaysAgoStr)?.bf_percentage || firstBF
        const bfChange30d = (bfs.length > 1 && bf30d !== lastBF) ? (lastBF - bf30d).toFixed(1) : null

        const last30dAdherence = (adherenceHistory || []).filter(h => h.diet_percentage > 0 || h.workout_status === 'completed' || h.cardio_status === 'completed')
        const avgAdherence = last30dAdherence.length > 0 ? (
            last30dAdherence.reduce((acc: number, h: any) => {
                const pillars = [
                    h.diet_percentage,
                    h.workout_status === 'completed' ? 100 : 0,
                    h.cardio_status === 'completed' ? 100 : 0,
                    h.ergogenics_status === 'completed' ? 100 : 0
                ]
                return acc + (pillars.reduce((a, b) => a + b, 0) / 4)
            }, 0) / last30dAdherence.length
        ).toFixed(0) : 0

        return {
            lastWeight,
            weightChange30d,
            lastBF,
            bfChange30d,
            avgAdherence
        }
    }, [fullMetrics, adherenceHistory])

    // FORCE PRO/ELITE view for everyone as tiers are deprecated for student features
    const trainerTier = 'pro'

    if (!fullMetrics || !stats) return null

    return (
        <div className="flex flex-col gap-section-gap">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-2 sm:space-y-5">
                    <div className="flex items-center gap-3 pb-4">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            Minha <span className="text-orange-500">Evolução</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        Acompanhe seu peso, percentual de gordura e consistência nos treinos e dieta em tempo real.
                    </p>
                </div>
            </header>

            <Tabs defaultValue="analysis" className="space-y-8">
                <div className="px-2">
                    <TabsList className="bg-zinc-900/50 p-1 border border-zinc-800/50 rounded-2xl w-full sm:w-auto h-auto flex flex-nowrap overflow-x-auto justify-start gap-1 no-scrollbar">
                        <TabsTrigger
                            value="analysis"
                            className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-black uppercase italic tracking-widest text-[10px] data-[state=active]:bg-orange-500 data-[state=active]:text-zinc-950 whitespace-nowrap"
                        >
                            <Activity className="w-3.5 h-3.5 mr-2" />
                            Análise
                        </TabsTrigger>
                        <TabsTrigger
                            value="photos"
                            className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-black uppercase italic tracking-widest text-[10px] data-[state=active]:bg-orange-500 data-[state=active]:text-zinc-950 whitespace-nowrap"
                        >
                            <Camera className="w-3.5 h-3.5 mr-2" />
                            Evolução
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-black uppercase italic tracking-widest text-[10px] data-[state=active]:bg-orange-500 data-[state=active]:text-zinc-950 whitespace-nowrap"
                        >
                            <History className="w-3.5 h-3.5 mr-2" />
                            Histórico
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="analysis" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-6 md:grid-cols-3">
                        <StatCard
                            label="Peso Atual"
                            value={stats.lastWeight || '--'}
                            unit="kg"
                            icon={<TrendingUp className="w-4 h-4" />}
                            trend={stats.weightChange30d ? (parseFloat(stats.weightChange30d) > 0 ? 'up' : 'down') : 'none'}
                            trendVal={stats.weightChange30d ? `${Math.abs(parseFloat(stats.weightChange30d))}kg` : '--'}
                            trendLabel={stats.weightChange30d ? "no último mês" : "Sem histórico"}
                        />
                        <StatCard
                            label="BF (Estimado)"
                            value={stats.lastBF || '--'}
                            unit="%"
                            icon={<Droplet className="w-4 h-4" />}
                            trend={stats.bfChange30d ? (parseFloat(stats.bfChange30d) > 0 ? 'up' : 'down') : 'none'}
                            trendVal={stats.bfChange30d ? `${Math.abs(parseFloat(stats.bfChange30d))}%` : '--'}
                            trendLabel={stats.bfChange30d ? "no último mês" : "Neutro / Sem histórico"}
                        />
                        <StatCard
                            label="Adesão (30D)"
                            value={stats.avgAdherence}
                            unit="%"
                            icon={<Target className="w-4 h-4" />}
                            trend="none"
                            trendVal=""
                            trendLabel="Média dos 4 Pilares"
                        />
                    </div>

                    <PerformanceAnalysisSection
                        weights={fullMetrics.weights}
                        bfs={fullMetrics.bfs.length > 0 ? fullMetrics.bfs : (fullMetrics.details?.body_fat ? [
                            { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date(Date.now() - 86400000 * 5).toISOString() },
                            { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date().toISOString() }
                        ] : [])}
                        frequency={fullMetrics.frequency || []}
                        trainerTier={trainerTier}
                        isStudentView={true}
                    />

                    <UnifiedAdherenceChart history={adherenceHistory} showErgogenics={!!fullMetrics.details?.steroid_use} />
                </TabsContent>

                <TabsContent value="photos" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardHeader className="p-6 sm:p-10 pb-0">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3 pb-4">
                                    <Camera className="w-6 h-6 text-orange-500" />
                                    Novo Registro
                                </h2>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Envie suas fotos para avaliação.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-10">
                            <ProgressPhotoUpload studentId={userId} />
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardHeader className="p-6 sm:p-10 pb-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3 pb-4">
                                    <Images className="w-6 h-6 text-orange-500" />
                                    Galeria de Fotos
                                </h2>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Evolução visual cronológica.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-10 pt-0">
                            <UnifiedProgressGallery photos={progressPhotos} mode="student" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardHeader className="p-6 sm:p-10 pb-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3 pb-4">
                                    <History className="w-6 h-6 text-orange-500" />
                                    Histórico de Treinos
                                </CardTitle>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Registros detalhados de sessões concluídas.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-10 pt-0">
                            <StudentWorkoutHistory
                                history={workoutHistory}
                                isBlocked={false}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

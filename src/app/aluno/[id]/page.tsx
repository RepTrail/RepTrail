import { getPublicStudentProfile } from '@/actions/student-actions'
import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentWorkoutHistory } from '@/actions/log-actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, TrendingUp, Trophy, User, Sparkles, ChevronRight, Activity, ArrowLeft, Target, Scale, Zap, History } from 'lucide-react'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
import { PublicStudentGallery } from '@/components/feature/student/public-student-gallery'
import { AdherenceChart } from '@/components/feature/student/adherence-chart'
import { StudentWorkoutHistory } from '@/components/feature/trainer/student-workout-history'

import { ShareTransformation } from '@/components/feature/student/share-transformation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
    title: 'Perfil do Aluno | RepTrail'
}

export default async function StudentPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: studentId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === studentId

    const data = await getPublicStudentProfile(studentId)
    const fullMetrics = await getStudentFullMetrics(studentId)
    const history = await getStudentWorkoutHistory(studentId)

    if (!data) notFound()

    const { profile, details, hasTrainer, trainer, photos, beforeAfter, adherenceHistory } = data
    const trainerData = trainer as { id: string; full_name: string; avatar_url: string; trainer_code?: string } | undefined

    // Latest metrics for quick view
    const latestWeight = fullMetrics.weights.length > 0
        ? fullMetrics.weights[fullMetrics.weights.length - 1].weight_kg
        : null

    // Fallback: Check history first, then details from either fetch
    const latestBF = fullMetrics.bfs.length > 0
        ? fullMetrics.bfs[fullMetrics.bfs.length - 1].bf_percentage
        : (fullMetrics.details?.body_fat || details?.body_fat || null)

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard/student/feed" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Voltar ao Feed</span>
                    </Link>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Perfil Verificado</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-6 pt-12">
                <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/40 border border-white/5 p-8 md:p-12 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-emerald-500/30 overflow-hidden relative shadow-2xl">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-emerald-500 font-black text-4xl uppercase">
                                    {profile.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                                    {profile.full_name}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                                        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                        <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] leading-none">
                                            Membro desde <span className="text-zinc-300">{profile.created_at ? new Date(profile.created_at).getFullYear() : 2024}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                {hasTrainer && trainerData ? (
                                    <Link
                                        href={`/personal/${trainerData.trainer_code || trainerData.id}`}
                                        className="group bg-emerald-500 text-zinc-950 px-8 py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-zinc-950/20">
                                            {trainerData.avatar_url ? (
                                                <Image src={trainerData.avatar_url} alt={trainerData.full_name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 text-[10px] flex items-center justify-center">?</div>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] opacity-70 leading-none mb-1">Coach Responsável</p>
                                            <p className="leading-tight">{trainerData.full_name}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Link>
                                ) : (
                                    <div className="bg-emerald-500/10 px-6 py-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 text-emerald-500" />
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase text-emerald-500/60 leading-none mb-1">Módulo</p>
                                            <p className="text-sm font-black uppercase italic text-emerald-500">Auto Treino RepTrail</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-emerald-500/10 to-transparent opacity-50" />
                </div>

                {/* Adherence and Performance Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Consistência Section with weight/bf cards */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Target className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-xl font-black italic uppercase tracking-tight">Consistência (30D)</h2>
                        </div>

                        {/* Combined Container for Stats and Adherence */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm p-6 md:p-10 space-y-10">
                            {/* 50/50 Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Peso Atual</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black italic text-emerald-500">{latestWeight || '--'}</span>
                                        <span className="text-[10px] font-black uppercase text-zinc-600 italic">kg</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">BF Atual</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black italic text-emerald-500">{latestBF || '--'}</span>
                                        <span className="text-[10px] font-black uppercase text-zinc-600 italic">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Inner chart embedded */}
                            <AdherenceChart
                                history={adherenceHistory}
                                showErgogenics={!!details?.steroid_use}
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
                                { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date(Date.now() - 86400000 * 5).toISOString() }, // 5 dias atrás 
                                { bf_percentage: fullMetrics.details.body_fat, recorded_at: new Date().toISOString() } // Hoje
                            ] : [])}
                            frequency={fullMetrics.frequency}
                            trainerTier="elite" // Force elite to show full graphs
                            isStudentView={true}
                        />
                    </div>
                </div>

                {/* Histórico de Treinos */}
                <div className="space-y-6 mb-16">
                    <div className="flex items-center gap-3 px-2">
                        <History className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-xl font-black italic uppercase tracking-tight">Histórico de Treinos</h2>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm p-6 md:p-10">
                        <StudentWorkoutHistory
                            history={history as any}
                            isBlocked={false} // Always show in public profile
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Before & After Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-amber-500" />
                                <h2 className="text-2xl font-black italic uppercase tracking-tight">Antes vs Depois</h2>
                            </div>
                            {isOwner && (
                                <div className="hidden md:block">
                                    <ShareTransformation
                                        studentName={profile.full_name}
                                        beforeUrl={beforeAfter.before?.front_url}
                                        afterUrl={beforeAfter.after?.front_url}
                                        beforeDate={beforeAfter.before?.created_at}
                                        afterDate={beforeAfter.after?.created_at}
                                    />
                                </div>
                            )}
                        </div>

                        {isOwner && (
                            <div className="md:hidden">
                                <div className="flex justify-end">
                                    <ShareTransformation
                                        studentName={profile.full_name}
                                        beforeUrl={beforeAfter.before?.front_url}
                                        afterUrl={beforeAfter.after?.front_url}
                                        beforeDate={beforeAfter.before?.created_at}
                                        afterDate={beforeAfter.after?.created_at}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* BEFORE */}
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ponto de Partida</span>
                                <div className="aspect-[3/4] relative rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 group">
                                    {beforeAfter.before ? (
                                        <Image src={beforeAfter.before.front_url} alt="Antes" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-black italic text-xs">Sem foto</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-black uppercase italic">
                                        Início
                                    </div>
                                </div>
                            </div>

                            {/* AFTER */}
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Status Atual</span>
                                <div className="aspect-[3/4] relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-zinc-900 shadow-[0_0_30px_rgba(16,185,129,0.1)] group">
                                    {beforeAfter.after ? (
                                        <Image src={beforeAfter.after.front_url} alt="Depois" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-black italic text-xs">Sem foto</div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-emerald-500 px-3 py-1 rounded-full text-zinc-950 text-[8px] font-black uppercase italic">
                                        Atual
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Gallery Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">Galeria de Progresso</h2>
                        </div>

                        <PublicStudentGallery photos={photos} />
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 pt-8 border-t border-zinc-800/50">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <Zap className="w-4 h-4 text-zinc-950" />
                            </div>
                            <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">RepTrail</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                            Plataforma de Treino Personalizado
                        </p>
                        <p className="text-[8px] text-zinc-700">
                            © 2026 Todos os direitos reservados
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

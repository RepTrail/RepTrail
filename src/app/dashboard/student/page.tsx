import { headers } from 'next/headers'
import { Suspense } from 'react'
import { getStudentTrainer, getStudentDetails, getStudentProfile } from '@/actions/student-actions'
import { getStudentAutoTrainingStatus } from '@/actions/auto-training-actions'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { checkStudentHasProtocol } from '@/actions/ai-protocol-actions'
import { StudentMetaPixel } from './meta-pixel'
import { PodiumCard, RankingRow } from '@/components/feature/shared/ranking-cards'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

import { WorkoutCard } from '@/components/feature/student/dashboard/workout-card'
import { CardioCard } from '@/components/feature/student/dashboard/cardio-card'
import { DietCard } from '@/components/feature/student/dashboard/diet-card'
import { ErgogenicsCard } from '@/components/feature/student/dashboard/ergogenics-card'
import { AIProtocolEmptyState } from '@/components/feature/student/ai-protocol-empty-state'

import { PaymentWarning } from '@/components/feature/student/payment-warning'
import { StudentDashboardModals } from '@/components/feature/student/student-dashboard-modals'
import { AnamnesisForm } from '@/components/feature/student/anamnesis-form'

import { Activity, Utensils, Dumbbell, Star, Search, Trophy, ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { ensureDailyTracking } from '@/actions/tracking-actions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTodayWorkout, getAssignedWorkouts } from '@/actions/workout-actions'
import { getTodayCardio, getAssignedCardios, getCardioStatus } from '@/actions/cardio-actions'
import { getStudentDailyDiet, getAssignedDiets } from '@/actions/diet-actions'
import { getStudentErgogenics, getTodayErgogenicLogs } from '@/actions/ergogenics-actions'
import { getMetricsSummary } from '@/actions/metrics-actions'
import { getActiveWorkoutSession } from '@/actions/log-actions'

export default async function StudentDashboardPage() {
    // ─── OPTIMIZED IDENTITY (0ms) ──────────────────────────────────────────
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    return (
        <Suspense fallback={<StudentDashboardSkeleton />}>
            <StudentDashboardContent userId={userId} />
        </Suspense>
    )
}

/**
 * ─── DATA COMPONENT (Suspended) ──────────────────────────────────────────
 */
async function StudentDashboardContent({ userId }: { userId: string }) {
    const queryClient = getQueryClient()

    // ─── STAGE 1: CORE PARALLEL FETCH ──────────────────────────────────────────
    // Parallelize basic info + initial assignments to extract IDs
    const [trainerRel, autoTrainingStatus, details, ranking, protocolStatus, todayWorkout, todayCardio] = await Promise.all([
        getStudentTrainer(userId),
        getStudentAutoTrainingStatus(userId),
        getStudentDetails(userId),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => checkStudentHasProtocol(userId) }),
        getTodayWorkout(userId),
        getTodayCardio(userId)
    ])

    // Hydrate the initial data into the cache
    if (todayWorkout) {
        queryClient.setQueryData(QUERY_KEYS.workouts.today(userId), todayWorkout)
    }
    if (todayCardio) {
        queryClient.setQueryData(QUERY_KEYS.cardio.today(userId), todayCardio)
    }

    // ─── STAGE 2: CHAINED PARALLEL PREFETCH (ELITE) ───────────────────────────
    // Resolve secondary dependencies using IDs found in STAGE 1
    const workoutId = todayWorkout?.id
    const cardioId = todayCardio?.[0]?.id

    await Promise.all([
        // Workout Chain
        workoutId ? 
            queryClient.prefetchQuery({ 
                queryKey: QUERY_KEYS.workouts.status(userId, workoutId), 
                queryFn: () => import('@/actions/log-actions').then(m => m.getWorkoutStatus(userId, workoutId)) 
            }) : 
            queryClient.setQueryData(QUERY_KEYS.workouts.status(userId, 'no-workout'), { status: 'empty' }),

        workoutId ? 
            queryClient.prefetchQuery({ 
                queryKey: QUERY_KEYS.workouts.detail(workoutId), 
                queryFn: () => import('@/actions/workout-actions').then(m => m.getWorkoutDetails(workoutId)) 
            }) : Promise.resolve(),

        // Cardio Chain
        cardioId ? 
            queryClient.prefetchQuery({ 
                queryKey: QUERY_KEYS.cardio.detail(cardioId), 
                queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId)) // Or specific detail
            }) : Promise.resolve(),
        
        queryClient.prefetchQuery({ 
            queryKey: QUERY_KEYS.cardio.logs(userId), 
            queryFn: () => getCardioStatus(userId) 
        }),

        // Ergogenics Chain
        queryClient.prefetchQuery({ 
            queryKey: QUERY_KEYS.ergogenics.logs(userId), 
            queryFn: () => getTodayErgogenicLogs(userId) 
        }),
        queryClient.prefetchQuery({ 
            queryKey: QUERY_KEYS.ergogenics.all(userId), 
            queryFn: () => getStudentErgogenics(userId) 
        }),

        // Diet Chain (Fix #3: explicit Stage 2 prefetch — eliminates DietCard skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.diets.today(userId),
            queryFn: () => getStudentDailyDiet(userId)
        }),

        // Cardio Session (prefetch eliminates CardioPlayer skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.session,
            queryFn: () => import('@/actions/cardio-actions').then(m => m.getActiveCardioSession())
        }),

        // Metrics & Profile
        queryClient.prefetchQuery({ 
            queryKey: QUERY_KEYS.student.metricsSummary(userId), 
            queryFn: () => getMetricsSummary(userId) 
        }),
        queryClient.prefetchQuery({ 
            queryKey: QUERY_KEYS.student.details(userId), 
            queryFn: () => getStudentProfile(userId) 
        })
    ])

    // Fire and forget background tracking
    ensureDailyTracking(userId).catch(console.error)

    // ─── CASE LOGIC ──────────────────────────────────────────────────────────
    const hasAutoTraining = autoTrainingStatus?.auto_training_status === 'active' ||
        (autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() <= new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000))

    const isTrialExpired = autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() > new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000)

    const showAutoTrainingModal = !autoTrainingStatus?.saw_auto_training_onboarding_modal && !trainerRel
    const showAnamnesis = details?.body_fat === null || details?.body_fat === undefined

    // ─── UI HANDLERS ─────────────────────────────────────────────────────────

    // Case: Trainer Inactive
    if (trainerRel && trainerRel.trainer.plan_tier === 'none' && !hasAutoTraining) {
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentMetaPixel />
                <div className="flex flex-col gap-section-gap animate-in fade-in duration-700">
                    <header className="space-y-8">
                        <div className="relative group overflow-hidden p-6 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-50" />
                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div className="space-y-5">
                                        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                            Seu Personal <br /><span className="text-red-500">ficou Inativo</span>
                                        </h2>
                                        <p className="text-zinc-500 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                                            Infelizmente, seu personal trainer {trainerRel.trainer.full_name} não utiliza mais a plataforma RepTrail.
                                            Para continuar seus treinos, você pode procurar um novo personal ou ativar o Auto-Training.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                        <Link href="/buscar-personal"><Button className="h-16 px-10 rounded-2xl bg-white text-zinc-950 font-black uppercase italic tracking-wide text-lg">Procurar Novo Personal</Button></Link>
                                        <Link href="/dashboard/student/plans"><Button variant="outline" className="h-16 px-10 rounded-2xl text-orange-500 font-black uppercase italic tracking-widest text-lg">Ativar Auto-Training</Button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </HydrationBoundary>
        )
    }

    // Case: No Trainer and No Auto-Training
    if (!trainerRel && !hasAutoTraining) {
        const topTrainers = ranking.slice(0, 3)
        const otherTrainers = ranking.slice(3, 6)

        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentMetaPixel />
                <div className="flex flex-col gap-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-6">
                    {/* Hero Section - Premium Marketplace Entry */}
                    <header className="relative">
                        <div className="absolute -inset-20 bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent blur-3xl opacity-50" />
                        <div className="relative group overflow-hidden p-8 sm:p-16 bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] backdrop-blur-md shadow-2xl">
                            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center text-center lg:text-left">
                                <div className="flex-1 space-y-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Plataforma Elite
                                    </div>
                                    <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                        Desbloqueie seu <br /><span className="text-orange-500">Potencial Máximo</span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                        Você ainda não possui um personal trainer. Conecte-se com a elite do treinamento físico e receba protocolos 100% personalizados.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                                        <Link href="/buscar-personal">
                                            <Button className="h-16 px-12 rounded-2xl bg-white hover:bg-orange-500 text-zinc-950 font-black uppercase italic tracking-wide text-lg transition-all shadow-2xl shadow-white/5 active:scale-95">
                                                Encontrar Personal
                                                <ArrowRight className="w-6 h-6 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden lg:block relative shrink-0">
                                    <div className="absolute -inset-10 bg-orange-500/20 rounded-full blur-[80px] opacity-20" />
                                    <div className="w-80 h-80 rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 relative overflow-hidden flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                        <Zap className="w-32 h-32 text-orange-500/20" />
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-xs font-black text-white uppercase italic tracking-widest">+500 Treinadores</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Auto-Training Promotion */}
                    <section className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    Treine de forma <span className="text-orange-500">Inteligente</span>
                                </h3>
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Sem tempo para um personal? Use o Auto-Training</p>
                            </div>
                            <Link href="/dashboard/student/plans">
                                <Button variant="link" className="text-orange-500 font-black uppercase text-xs tracking-widest gap-2 group p-0 h-auto">
                                    Ver Planos de IA
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        
                        <Link href="/dashboard/student/plans">
                            <div className="relative group overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-[3rem] shadow-2xl transition-all hover:border-orange-500/40">
                                <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                                    <Sparkles className="w-48 h-48 text-orange-500" />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="space-y-4 text-center md:text-left">
                                        <h4 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Auto-Training com <span className="text-orange-500">RepTrail AI</span></h4>
                                        <p className="text-zinc-500 text-sm md:text-lg max-w-xl font-medium">Protocolos gerados instantaneamente com base na sua rotina, objetivos e equipamentos disponíveis.</p>
                                    </div>
                                    <Button className="h-14 px-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-black uppercase italic tracking-wide text-sm whitespace-nowrap active:scale-95 transition-all">
                                        Ativar por R$ 10,90/mês
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </section>

                    {/* Top Trainers - Reusing Ranking Components */}
                    <section className="space-y-10 pb-20">
                        <div className="flex items-center gap-4 px-4 overflow-hidden">
                            <div className="h-px bg-zinc-800 flex-1" />
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight shrink-0">
                                Treinadores <span className="text-orange-500">Destaque</span>
                            </h3>
                            <div className="h-px bg-zinc-800 flex-1" />
                        </div>

                        <div className="grid gap-12 lg:grid-cols-3 px-2">
                            {topTrainers.map((t: any, idx: number) => (
                                <PodiumCard key={t.id} trainer={t} rank={idx + 1} />
                            ))}
                        </div>

                        {otherTrainers.length > 0 && (
                            <div className="space-y-6 pt-10">
                                <div className="flex items-center gap-3 px-4">
                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Outros Recomendados</h2>
                                </div>

                                <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-zinc-800/30">
                                            {otherTrainers.map((t: any, idx: number) => (
                                                <RankingRow key={t.id} trainer={t} rank={idx + 4} />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        
                        <div className="text-center pt-8">
                            <Link href="/buscar-personal">
                                <Button variant="outline" className="h-14 px-10 rounded-2xl border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white font-black uppercase italic tracking-widest text-xs">
                                    Ver Todos os Treinadores
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </HydrationBoundary>
        )
    }

    // Main Case: Active Training
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const hasProtocol = protocolStatus.hasWorkout || protocolStatus.hasDiet

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <StudentMetaPixel />
            <div className="max-w-7xl mx-auto flex flex-col gap-section-gap animate-in fade-in duration-500 ">
                <PaymentWarning relationship={trainerRel} />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-header-gap">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dashboard</h1>
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Hoje</span>
                        <span className="text-xs font-black text-white italic uppercase">{tzNow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                    </div>
                </div>
                {showAnamnesis && <AnamnesisForm initialData={details} />}
                {!hasProtocol && <AIProtocolEmptyState userId={userId} />}
                {hasProtocol && (
                    <div className="grid gap-section-gap lg:grid-cols-12">
                        <div className="lg:col-span-8 flex flex-col gap-section-gap">
                            <WorkoutCard userId={userId} />
                            <CardioCard userId={userId} />
                            <ErgogenicsCard userId={userId} />
                        </div>
                        <div className="lg:col-span-4 flex flex-col gap-section-gap">
                            <DietCard userId={userId} hasTrainer={!!trainerRel} />
                        </div>
                    </div>
                )}
                <StudentDashboardModals userId={userId} showModal={showAutoTrainingModal} hasTrainer={!!trainerRel} />
            </div>
        </HydrationBoundary>
    )
}

/**
 * ─── SKELETON (0ms Nav Frame) ──────────────────────────────────────────
 */
function StudentDashboardSkeleton() {
    return (
        <div className="space-y-10 animate-pulse pb-20">
            <div className="h-12 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="h-10 w-48 bg-zinc-900 rounded-xl" />
                    <div className="h-4 w-64 bg-zinc-900 rounded-md" />
                </div>
                <div className="h-16 w-32 bg-zinc-900 rounded-xl" />
            </div>
            <div className="grid gap-section-gap lg:grid-cols-12">
                <div className="lg:col-span-8 flex flex-col gap-section-gap">
                    <div className="h-[280px] bg-zinc-900 rounded-[2.5rem]" />
                    <div className="h-[300px] bg-zinc-900 rounded-[2.5rem]" />
                    <div className="h-[200px] bg-zinc-900 rounded-[2.5rem]" />
                </div>
                <div className="lg:col-span-4 h-[600px] bg-zinc-900 rounded-[2.5rem]" />
            </div>
        </div>
    )
}

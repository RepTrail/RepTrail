import { createClient } from '@/lib/supabase/server'
import { getStudentTrainer, getStudentDetails } from '@/actions/student-actions'
import { getStudentAutoTrainingStatus } from '@/actions/auto-training-actions'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { checkStudentHasProtocol } from '@/actions/ai-protocol-actions'
import { StudentMetaPixel } from './meta-pixel'

import { WorkoutCard } from '@/components/feature/student/dashboard/workout-card'
import { CardioCard } from '@/components/feature/student/dashboard/cardio-card'
import { DietCard } from '@/components/feature/student/dashboard/diet-card'
import { ErgogenicsCard } from '@/components/feature/student/dashboard/ergogenics-card'
import { AIProtocolEmptyState } from '@/components/feature/student/ai-protocol-empty-state'

import { PaymentWarning } from '@/components/feature/student/payment-warning'
import { StudentDashboardModals } from '@/components/feature/student/student-dashboard-modals'
import { AnamnesisForm } from '@/components/feature/student/anamnesis-form'

import { Activity, Utensils, Dumbbell, Star, Search, Trophy, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { ensureDailyTracking } from '@/actions/tracking-actions'

export default async function StudentDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null


    // Ensure tracking is initialized for today
    await ensureDailyTracking(user.id)

    // Fetch minimal core data for the shell
    const [trainerRel, autoTrainingStatus, details] = await Promise.all([
        getStudentTrainer(user.id),
        getStudentAutoTrainingStatus(user.id),
        getStudentDetails(user.id)
    ])

    const hasAutoTraining = autoTrainingStatus?.auto_training_status === 'active' ||
        (autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() <= new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000))
    const isTrialExpired = autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() > new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000)

    const showAutoTrainingModal = !autoTrainingStatus?.saw_auto_training_onboarding_modal && !trainerRel
    const showAnamnesis = details?.body_fat === null || details?.body_fat === undefined

    // Case: Trainer Inactive (plan_tier === 'none')
    if (trainerRel && trainerRel.trainer.plan_tier === 'none' && !hasAutoTraining) {
        return (
            <>
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
                                    <Link href="/buscar-personal">
                                        <Button className="h-16 px-10 rounded-2xl bg-white hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide group shadow-xl transition-all active:scale-95 text-lg">
                                            Procurar Novo Personal
                                            <Search className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/student/plans">
                                        <Button variant="outline" className="h-16 px-10 rounded-2xl border-orange-500/30 bg-orange-500/5 hover:bg-orange-500 hover:border-orange-500 text-orange-500 hover:text-zinc-950 font-black uppercase italic tracking-widest text-lg transition-all shadow-xl backdrop-blur-sm">
                                            Ativar Auto-Training
                                            <Zap className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative shrink-0">
                                <div className="absolute inset-0 bg-red-500 blur-[80px] opacity-20" />
                                <ShieldCheck className="w-48 h-48 text-zinc-800 relative z-10 opacity-50" />
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            </>
        )
    }

    // Case: Trial Expired
    if (!trainerRel && isTrialExpired && !hasAutoTraining) {
        return (
            <>
                <StudentMetaPixel />
                <div className="flex flex-col gap-section-gap animate-in fade-in duration-700">
                <header className="space-y-8">
                    <div className="relative group overflow-hidden p-6 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl mt-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-5">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 rounded-full border border-emerald-500/30 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Plano Pro</span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                        Seu Teste <span className="text-zinc-500">Expirou!</span>
                                    </h2>
                                    <p className="text-zinc-400 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                                        Os seus 7 dias gratuitos chegaram ao fim. Assine o Auto-Training Pro e não perca o seu histórico de evolução.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <Link href="/dashboard/student/plans">
                                        <Button className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide group shadow-xl transition-all active:scale-95 text-lg">
                                            Assinar Agora
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/buscar-personal">
                                        <Button variant="outline" className="h-16 px-10 rounded-2xl border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800 hover:border-zinc-700 text-white font-black uppercase italic tracking-widest text-lg transition-all shadow-xl backdrop-blur-sm">
                                            Procurar Personal
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative shrink-0">
                                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                                <ShieldCheck className="w-48 h-48 text-emerald-500 relative z-10 opacity-70" />
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            </>
        )
    }

    // Case: No Trainer and No Auto-Training (Public/Newbie View)
    if (!trainerRel && !hasAutoTraining) {
        const ranking = await getTrainerRanking()
        const topTrainers = ranking.slice(0, 3)

        return (
            <>
                <StudentMetaPixel />
                <div className="flex flex-col gap-section-gap animate-in fade-in duration-700 mt-12">
                <header className="space-y-8">
                    <div className="relative group overflow-hidden p-6 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-2 sm:space-y-5">
                                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                        Desbloqueie seu <br /><span className="text-orange-500">Potencial Máximo</span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                                        Você ainda não possui um personal trainer. Conecte-se com a elite e receba treinos e dietas 100% personalizados.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <Link href="/buscar-personal">
                                        <Button className="h-16 px-10 rounded-2xl bg-white hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide group shadow-xl transition-all active:scale-95 text-lg">
                                            Encontrar Personal
                                            <Search className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/student/ranking">
                                        <Button variant="outline" className="h-16 px-10 rounded-2xl border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800 hover:border-zinc-700 text-white font-black uppercase italic tracking-widest text-lg transition-all shadow-xl backdrop-blur-sm">
                                            Ver Ranking Elite
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative shrink-0">
                                <div className="absolute inset-0 bg-orange-500 blur-[80px] opacity-20" />
                                <Trophy className="w-48 h-48 text-zinc-800 relative z-10 animate-bounce transition-all duration-[3s]" />
                            </div>
                        </div>
                    </div>
                </header>

                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3 pb-4">
                            <div className="w-2 h-4 bg-amber-500 rounded-full" />
                            <h2 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest flex-wrap">
                                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                Elite RepTrail • Ranking Global
                            </h2>
                        </div>
                        <Link href="/dashboard/student/ranking" className="text-[9px] font-black bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white uppercase italic tracking-widest transition-all flex items-center gap-2 px-4 py-1.5 rounded-full">
                            Ver Todos
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topTrainers.map((trainer: any, index: number) => {
                            const CardContent = (
                                <Card className={`group bg-zinc-900 shadow-2xl rounded-3xl border-zinc-800/80 ${trainer.trainer_code ? 'hover:border-amber-500/30' : 'opacity-70'} transition-all duration-500 p-8 space-y-6 overflow-hidden relative h-full`}>
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Trophy className="w-32 h-32 text-amber-500" />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <Avatar className="h-16 w-16 border-2 border-zinc-800 group-hover:scale-105 transition-transform">
                                            <AvatarImage src={trainer.avatar_url} className="object-cover" />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase">
                                                {trainer.full_name?.substring(0, 2) || 'TR'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5">
                                            <h3 className="text-xl font-black text-white italic uppercase line-clamp-1 group-hover:text-amber-500 transition-colors">
                                                {trainer.full_name}
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{trainer.rating} Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-zinc-800/50 flex items-center justify-between relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block leading-none">Foco</span>
                                            <span className="text-xs font-black text-zinc-300 italic uppercase">{trainer.specialty || 'Alta Performance'}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 text-amber-500 font-black italic text-xs">
                                            #{index + 1}
                                        </div>
                                    </div>
                                </Card>
                            )

                            return trainer.trainer_code ? (
                                <Link key={trainer.id} href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`}>
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={trainer.id} className="h-full">
                                    {CardContent}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="p-6 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-6 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mx-auto shadow-2xl rotate-3">
                            <Search className="w-8 h-8 text-orange-500 -rotate-3" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">O suporte que você merece</h3>
                            <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">
                                Acesse mais de 400 produtos na nossa loja oficial para potencializar seus ganhos.
                            </p>
                        </div>
                        <Link href="/dashboard/student/loja" className="w-full sm:w-fit mx-auto">
                            <Button className="w-full sm:w-fit h-auto min-h-[3.5rem] py-4 px-10 rounded-2xl bg-zinc-100 hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl">
                                Acessar Loja RepTrail
                            </Button>
                        </Link>
                    </div>
                </section>

                <StudentDashboardModals userId={user.id} showModal={showAutoTrainingModal} hasTrainer={false} />
            </div>
            </>
        )
    }

    // Main Case: Active Training (Personal or Auto-Training)
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))

    // Check if auto-training student has an active protocol
    let hasProtocol = true
    if (!trainerRel && hasAutoTraining) {
        const protocolStatus = await checkStudentHasProtocol(user.id)
        hasProtocol = protocolStatus.hasWorkout || protocolStatus.hasDiet
    }

    return (
        <>
            <StudentMetaPixel />
            <div className="max-w-7xl mx-auto flex flex-col gap-section-gap animate-in fade-in duration-500 ">
            <PaymentWarning relationship={trainerRel} />

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-header-gap">
                <div className="space-y-2 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        {trainerRel ? (
                            <>
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                Seu Personal: <span className="text-zinc-400">{trainerRel.trainer.full_name}</span>
                            </>
                        ) : (
                            <>
                                <Dumbbell className="w-3 h-3 text-orange-500" />
                                Auto-Training Ativo
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50">
                    <div className=" py-2 bg-zinc-950 rounded-xl border border-zinc-800 px-4 w-full px-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Hoje</span>
                        <span className="text-xs font-black text-white italic uppercase">
                            {tzNow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                        </span>
                    </div>
                </div>
            </div>

            {showAnamnesis && (
                <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
                    <AnamnesisForm initialData={details} />
                </div>
            )}

            {/* Empty state: auto-training student with NO protocol yet */}
            {!hasProtocol && !trainerRel && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <AIProtocolEmptyState />
                </div>
            )}

            {hasProtocol && (
                <div className="grid gap-section-gap lg:grid-cols-12">
                    {/* Async Sections */}
                    <div className="lg:col-span-8 flex flex-col gap-section-gap">
                        <div className="flex flex-col gap-header-gap">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-widest">
                                    <Dumbbell className="w-4 h-4 text-emerald-500" />
                                    Treino de Hoje
                                </h2>
                                <Link href="/dashboard/student/workouts" className="text-[9px] font-black bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white uppercase italic tracking-widest transition-all flex items-center gap-2 px-4 py-1.5 rounded-full">
                                    Ver biblioteca
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <WorkoutCard userId={user.id} />
                        </div>

                        <div className="flex flex-col gap-header-gap">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-widest">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                    Cardio do Dia
                                </h2>
                            </div>
                            <CardioCard userId={user.id} />
                        </div>

                        <ErgogenicsCard userId={user.id} />
                    </div>

                    {/* Sidebar (Metrics & Diet) */}
                    <div className="lg:col-span-4 flex flex-col gap-section-gap">
                        <div className="flex flex-col gap-header-gap">
                            <h2 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-widest px-2">
                                <Utensils className="w-4 h-4 text-emerald-500" />
                                Sua Dieta
                            </h2>
                            <DietCard userId={user.id} hasTrainer={!!trainerRel} />
                        </div>
                    </div>
                </div>
            )}

            <StudentDashboardModals userId={user.id} showModal={showAutoTrainingModal} hasTrainer={!!trainerRel} />
        </div>
        </>
    )
}

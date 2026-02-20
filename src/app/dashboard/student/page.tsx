import { createClient } from '@/lib/supabase/server'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { getTodayWorkout } from '@/actions/workout-actions'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { getStudentTrainer } from '@/actions/student-actions'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { getStudentErgogenics } from '@/actions/ergogenics-actions'
import { CardioPlayer } from '@/components/feature/student/cardio-player'
import { DietAdherence } from '@/components/feature/student/diet-adherence'
import { PaymentWarning } from '@/components/feature/student/payment-warning'
import { Flame, Activity, Clock, Utensils, Dumbbell, Star, Search, ShieldCheck, Trophy, ArrowRight, Zap, Target, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { signOutAction } from '@/actions/auth-actions'

export default async function StudentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Check Personal Relationship
    const trainerRel = await getStudentTrainer(user.id)

    // 2. Details for steroid check
    const { data: details } = await supabase
        .from('student_details')
        .select('steroid_use')
        .eq('id', user.id)
        .single()

    const steroidUse = !!details?.steroid_use

    // 3. Fetch Daily Data
    const rawCardios = await getStudentCardioAssignments(user.id)
    // Pega a data no timezone de Brasília (evita bug de virada de dia quando UTC já avançou)
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const today = tzNow.getDay() // 0=Dom ... 6=Sab, correto para Brasília
    const todayStr = tzNow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    const cardios = rawCardios.filter((a: any) =>
        !a.days_of_week || a.days_of_week.length === 0 || a.days_of_week.includes(today)
    )
    const workout = await getTodayWorkout(user.id)
    const diet = await getStudentDailyDiet(user.id)

    // Ergogenics
    let todaysErgogenics: any[] = []
    if (steroidUse) {
        const { data: ergogenics } = await getStudentErgogenics(user.id)
        if (ergogenics) {
            todaysErgogenics = ergogenics.filter((e: any) =>
                e.application_days && Array.isArray(e.application_days) && e.application_days.includes(today)
            )
        }
    }

    // UI for students without personal
    if (!trainerRel) {
        const ranking = await getTrainerRanking()
        const topTrainers = ranking.slice(0, 3)

        return (
            <div className="space-y-12 pb-20 animate-in fade-in duration-700">
                <header className="space-y-8">


                    <div className="relative group overflow-hidden p-10 md:p-16 bg-zinc-900 border border-zinc-800 rounded-[3.5rem] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-2">
                                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
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
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-4 bg-amber-500 rounded-full" />
                            <h2 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.3em]">
                                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                Elite RepTrail • Ranking Global
                            </h2>
                        </div>
                        <Link href="/dashboard/student/ranking" className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                            Ver Todos
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topTrainers.map((trainer: any, index: number) => {
                            const CardContent = (
                                <Card className={`group bg-zinc-900 shadow-2xl rounded-[2.5rem] border-zinc-800/80 ${trainer.trainer_code ? 'hover:border-amber-500/30' : 'opacity-70'} transition-all duration-500 p-8 space-y-6 overflow-hidden relative h-full`}>
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
                                <div key={trainer.id}>
                                    {CardContent}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="p-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] text-center space-y-6 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mx-auto shadow-2xl rotate-3">
                            <Target className="w-8 h-8 text-orange-500 -rotate-3" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">O suporte que você merece</h3>
                            <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">
                                Acesse mais de 400 produtos na nossa loja oficial para potencializar seus ganhos.
                            </p>
                        </div>
                        <Link href="/dashboard/student/loja">
                            <Button className="h-14 px-10 rounded-2xl bg-zinc-100 hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl">
                                Acessar Loja RepTrail
                            </Button>
                        </Link>
                    </div>
                </section>


            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            <PaymentWarning relationship={trainerRel} />
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Dashboard
                    </h1>
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Seu Personal: <span className="text-zinc-400">{trainerRel.trainer.full_name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50">
                    <div className="px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Hoje</span>
                        <span className="text-xs font-black text-white italic uppercase">
                            {todayStr}
                        </span>
                    </div>
                </div>
            </div>



            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content (Workout & Cardio) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Workout Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Dumbbell className="w-4 h-4 text-emerald-500" />
                                Treino de Hoje
                            </h2>
                        </div>

                        {workout ? (
                            <Link href={`/dashboard/student/workout/${workout.id}`}>
                                <div className="group relative bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-sm overflow-hidden hover:border-emerald-500/30 transition-all duration-500 cursor-pointer shadow-xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Dumbbell className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="relative space-y-6">
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-black text-white italic uppercase leading-none">
                                                {workout.name}
                                            </h3>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                                {workout.exercises?.length || 0} Exercícios • Foco do dia
                                            </p>
                                        </div>
                                        <Button className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide">
                                            Iniciar Treino
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
                                    <Clock className="w-8 h-8 text-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Dia de Descanso</p>
                                    <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[250px]">
                                        Hoje é dia de descanso. Recuperação também faz parte do processo. Aproveite!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cardio Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Flame className="w-4 h-4 text-orange-500" />
                                Cardio do Dia
                            </h2>
                        </div>

                        {cardios.length > 0 ? (
                            <div className="grid gap-6">
                                {cardios.slice(0, 1).map((assignment: any) => (
                                    <CardioPlayer key={assignment.id} assignment={assignment} />
                                ))}
                                {cardios.length > 1 && (
                                    <div className="px-8 py-4 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl flex items-center justify-between">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                            Próximos Cardios: {cardios.length - 1} pendente(s)
                                        </span>
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic animate-pulse">
                                            Execute um por vez
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
                                    <Activity className="w-8 h-8 text-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhum cardio pendente</p>
                                    <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">
                                        Não há cardios atribuídos para este plano hoje.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ergogenics Section */}
                    {steroidUse && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Ergogênicos do Dia
                                </h2>
                            </div>

                            {todaysErgogenics.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {todaysErgogenics.map((erg: any) => (
                                        <div key={erg.id} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] backdrop-blur-sm space-y-4 hover:border-amber-500/30 transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight line-clamp-1">
                                                        {erg.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                        {(erg.weekly_dosage / (erg.application_days?.length || 1)).toFixed(2)} {erg.unit}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 text-amber-500">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                            </div>
                                            {erg.notes && (
                                                <div className="pt-4 border-t border-zinc-800/50">
                                                    <p className="text-[10px] text-zinc-400 font-medium italic line-clamp-2">
                                                        "{erg.notes}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
                                        <Sparkles className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhuma aplicação hoje</p>
                                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">
                                            Curta seu dia de descanso dos ergogênicos.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar (Diet & Info) */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] px-2">
                            <Utensils className="w-4 h-4 text-emerald-500" />
                            Sua Dieta
                        </h2>
                        {diet ? (
                            <DietAdherence diet={diet} />
                        ) : (
                            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 text-center space-y-3">
                                <Utensils className="w-8 h-8 text-zinc-700 mx-auto" />
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                                    Seu personal ainda não enviou sua dieta.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { getStudentTrainer } from '@/actions/student-actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    ShieldCheck, Star, MapPin, MessageCircle, Trophy,
    Dumbbell, Utensils, Activity, ArrowRight, UserCheck, Phone
} from 'lucide-react'
import { RatingModal } from '@/components/feature/student/RatingModal'

export default async function MeuPersonalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const trainerRel = await getStudentTrainer(user.id)
    if (!trainerRel || !trainerRel.trainer) redirect('/buscar-personal')

    const trainer = trainerRel.trainer

    // Validate trainer_code exists
    if (!trainer.trainer_code) {
        console.error('Trainer code is missing for trainer:', trainer.id)
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 ">
            {/* Header */}
            <div className="space-y-2 sm:space-y-5">
                <div className="flex items-center gap-3 pb-4">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Meu <span className="text-orange-500">Personal</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium max-w-md flex items-center gap-2">
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    Seu treinador de confiança
                </p>
            </div>

            {/* Trainer Hero Card */}
            <div className="relative group p-8 md:p-12 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full" />
                        <Avatar className="w-40 h-40 border-4 border-zinc-900 shadow-xl relative z-10">
                            <AvatarImage src={trainer.avatar_url} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-500 text-4xl font-black uppercase">
                                {trainer.full_name?.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        {trainer.is_elite && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-950 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg z-20 whitespace-nowrap">
                                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Elite Trainer</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
                                {trainer.full_name}
                            </h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-zinc-400">
                                {trainer.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span>{trainer.location}</span>
                                    </div>
                                )}
                                {trainer.cref && (
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>CREF: {trainer.cref}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    <span className="font-black italic text-lg">{Number(trainer.average_rating || 0).toFixed(1)}</span>
                                    <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest ml-1">Rating</span>
                                    {trainer.total_reviews > 0 && (
                                        <span className="text-zinc-500 text-[10px] lowercase font-bold tracking-widest ml-1">({trainer.total_reviews} avaliações)</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {trainer.bio && (
                            <p className="text-zinc-400 leading-relaxed max-w-xl">
                                {trainer.bio}
                            </p>
                        )}

                        {trainer.specialty && (
                            <span className="inline-block px-3 py-1 bg-zinc-800 rounded-lg text-xs font-bold text-zinc-300 uppercase tracking-wide">
                                {trainer.specialty}
                            </span>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                            {trainer.whatsapp ? (
                                <Link
                                    href={`https://wa.me/${trainer.whatsapp?.replace(/\D/g, '')}?text=Olá ${trainer.full_name}, tenho uma dúvida sobre meu treino!`}
                                    target="_blank"
                                >
                                    <Button className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-lg shadow-emerald-500/20">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Falar no WhatsApp
                                    </Button>
                                </Link>
                            ) : (
                                <Button disabled className="h-14 px-8 rounded-2xl bg-zinc-800 text-zinc-500 font-black uppercase italic tracking-wide cursor-not-allowed">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contato não disponível
                                </Button>
                            )}

                            {trainer.trainer_code ? (
                                <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`}>
                                    <Button variant="ghost" className="h-14 px-8 rounded-2xl border border-zinc-800 bg-transparent hover:bg-zinc-800/80 hover:border-zinc-700 text-white hover:text-white font-black uppercase italic tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] group/btn">
                                        Ver Perfil Completo
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button disabled variant="outline" className="h-14 px-8 rounded-2xl border-zinc-800 bg-transparent text-zinc-700 font-black uppercase italic tracking-wide cursor-not-allowed">
                                    Perfil Indisponível
                                </Button>
                            )}

                            <RatingModal
                                trainerId={trainer.id}
                                trainerName={trainer.full_name}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Info */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-3">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                            <Dumbbell className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Treinos</p>
                            <Link href="/dashboard/student/workouts">
                                <Button variant="ghost" className="h-auto p-0 text-white font-black italic uppercase text-lg hover:text-emerald-500 transition-colors">
                                    Ver Meus Treinos
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-3">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                            <Utensils className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dieta</p>
                            <Link href="/dashboard/student/diet">
                                <Button variant="ghost" className="h-auto p-0 text-white font-black italic uppercase text-lg hover:text-orange-500 transition-colors">
                                    Ver Minha Dieta
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-3">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Cardio</p>
                            <Link href="/dashboard/student/cardio">
                                <Button variant="ghost" className="h-auto p-0 text-white font-black italic uppercase text-lg hover:text-blue-500 transition-colors">
                                    Ver Cardios
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plan Details */}
            {(trainerRel.monthly_fee || trainerRel.payment_day) && (
                <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Detalhes do Plano</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {trainerRel.monthly_fee && (
                            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Mensalidade</p>
                                <p className="text-xl font-black text-white italic">R$ {Number(trainerRel.monthly_fee).toFixed(2)}</p>
                            </div>
                        )}
                        {trainerRel.payment_day && (
                            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Vencimento</p>
                                <p className="text-xl font-black text-white italic">Dia {trainerRel.payment_day}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

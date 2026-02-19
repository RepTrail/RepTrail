
import { getTrainerRanking } from '@/actions/trainer-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trophy, Users, Star, TrendingUp, Medal, ArrowRight, ShieldCheck, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Link from 'next/link'

export const revalidate = 0

export default async function StudentRankingPage() {
    const ranking = await getTrainerRanking()

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
                <div className="space-y-4">
                    <Logo size="lg" />
                    <p className="text-zinc-500 text-sm font-medium max-w-md leading-relaxed">
                        Conheça os profissionais que estão transformando o mercado fitness com resultados reais e suporte de elite.
                    </p>
                </div>

                <Link href="/buscar-personal">
                    <Button className="h-14 px-8 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-wide group shadow-xl transition-all active:scale-95">
                        Ver Todos os Profissionais
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            {/* Top 3 Podium */}
            <div className="grid gap-8 lg:grid-cols-3">
                {ranking.slice(0, 3).map((trainer: any, index: number) => (
                    <PodiumCard
                        key={trainer.id}
                        trainer={trainer}
                        rank={index + 1}
                    />
                ))}
            </div>

            {/* General List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Classificação Geral</h2>
                </div>

                <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-800/50">
                            {ranking.slice(3, 10).map((trainer: any, index: number) => (
                                <RankingRow
                                    key={trainer.id}
                                    trainer={trainer}
                                    rank={index + 4}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    )
}

function PodiumCard({ trainer, rank }: { trainer: any, rank: number }) {
    const colors = [
        "from-amber-500 to-amber-200 text-amber-500 border-amber-500/30", // 1st
        "from-zinc-400 to-zinc-100 text-zinc-400 border-zinc-400/30",    // 2nd
        "from-orange-600 to-orange-300 text-orange-600 border-orange-600/30" // 3rd
    ]

    const tierColors: Record<string, string> = {
        'elite': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        'pro': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'start': 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }

    return (
        <Card className={`group relative bg-zinc-900 border-zinc-800 shadow-2xl rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-amber-500/40 h-full`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Trophy className={`w-32 h-32 ${colors[rank - 1].split(' ')[2]}`} />
            </div>

            <CardContent className="p-10 flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${colors[rank - 1].split(' ').slice(0, 2).join(' ')} rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000`}></div>
                    <Avatar className="h-32 w-32 border-4 border-zinc-900 shadow-2xl relative">
                        <AvatarImage src={trainer.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black text-3xl italic uppercase">
                            {trainer.full_name?.substring(0, 2) || 'TR'}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl shadow-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center`}>
                        <span className={`text-2xl font-black italic uppercase ${colors[rank - 1].split(' ')[2]}`}>#{rank}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight line-clamp-1 group-hover:text-amber-500 transition-colors">
                            {trainer.full_name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <MapPin className="w-3 h-3" />
                            {trainer.region || 'Brasil'}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className={`${tierColors[trainer.plan_tier]} text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-lg`}>
                            {trainer.plan_tier}
                        </Badge>
                        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-amber-500">{Number(trainer.rating || 0).toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full pt-8 border-t border-zinc-900 grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Alunos</p>
                        <p className="text-2xl font-black text-white italic">{trainer.studentCount}+</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Impacto</p>
                        <p className="text-2xl font-black text-emerald-500 italic">Score {Math.round(trainer.score / 10)}</p>
                    </div>
                </div>

                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`} className="w-full pt-4">
                        <Button className="w-full h-14 rounded-2xl bg-white hover:bg-amber-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95">
                            Ver Perfil
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                ) : (
                    <div className="w-full pt-4">
                        <Button disabled className="w-full h-14 rounded-2xl bg-zinc-800 text-zinc-600 font-black uppercase italic tracking-wide cursor-not-allowed">
                            Sem código
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function RankingRow({ trainer, rank }: { trainer: any, rank: number }) {
    return (
        <div className="flex items-center p-8 hover:bg-zinc-800/20 transition-all group">
            <div className="w-16 flex-shrink-0 text-zinc-700 font-black italic text-2xl group-hover:text-amber-500/50 transition-colors">
                #{rank}
            </div>

            <div className="flex-1 flex items-center gap-6 min-w-0">
                <Avatar className="h-16 w-16 border border-zinc-800 shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    <AvatarImage src={trainer.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-zinc-900 text-zinc-500 font-bold text-xl uppercase">
                        {trainer.full_name?.substring(0, 2) || 'TR'}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden space-y-1">
                    <p className="text-xl font-black text-white italic uppercase truncate group-hover:text-amber-500 transition-colors tracking-tight">
                        {trainer.full_name}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-amber-500/50 fill-amber-500/50" />
                            <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase">{Number(trainer.rating || 0).toFixed(1)} Rating</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500/30" />
                            <span className="text-[11px] font-black text-zinc-600 tracking-widest uppercase">{trainer.plan_tier} tier</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-12 ml-6">
                <div className="text-center space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Alunos</p>
                    <p className="text-xl font-black text-zinc-300 italic leading-none">{trainer.studentCount}</p>
                </div>
                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`}>
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-zinc-800 bg-transparent hover:bg-white hover:text-zinc-950 text-white font-black uppercase italic tracking-wide transition-all group/btn">
                            Ver Perfil
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                ) : (
                    <Button disabled variant="outline" className="h-12 px-6 rounded-xl border-zinc-800 bg-transparent text-zinc-700 font-black uppercase italic tracking-wide cursor-not-allowed">
                        Sem código
                    </Button>
                )}
            </div>
        </div>
    )
}


import { getTrainerRanking } from '@/actions/trainer-actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Star, TrendingUp, Medal, ArrowRight } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const revalidate = 0
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function RankingPage() {
    const ranking = await getTrainerRanking()

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800/50">
                <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    Elite RepTrail
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                    Os 500 treinadores com maior impacto e performance na plataforma.
                </p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid gap-6 md:grid-cols-3">
                {ranking.slice(0, 3).map((trainer: any, index: number) => (
                    <PodiumCard
                        key={trainer.id}
                        trainer={trainer}
                        rank={index + 1}
                    />
                ))}
            </div>

            {/* List for 4 - 500 */}
            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/10">
                <CardHeader className="bg-zinc-900/10 border-b border-zinc-900/50 py-4">
                    <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Classificação Geral
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-900">
                        {ranking.slice(3).map((trainer: any, index: number) => (
                            <RankingRow
                                key={trainer.id}
                                trainer={trainer}
                                rank={index + 4}
                            />
                        ))}
                        {ranking.length === 0 && (
                            <div className="p-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
                                Nenhum treinador ranqueado ainda.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function PodiumCard({ trainer, rank }: { trainer: any, rank: number }) {
    const colors = [
        "from-amber-500 to-amber-200 text-amber-500", // 1st
        "from-zinc-400 to-zinc-100 text-zinc-400",    // 2nd
        "from-orange-600 to-orange-300 text-orange-600" // 3rd
    ]

    const tierColors: Record<string, string> = {
        'elite': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        'pro': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'start': 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }

    return (
        <Card className={`bg-zinc-950 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden relative group border-t-zinc-700/20 h-full`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Trophy className={`w-24 h-24 ${colors[rank - 1].split(' ')[2]}`} />
            </div>

            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${colors[rank - 1].split(' ').slice(0, 2).join(' ')} rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000`}></div>
                    <Avatar className="h-24 w-24 border-4 border-black relative">
                        <AvatarImage src={trainer.avatar_url} />
                        <AvatarFallback className="bg-zinc-900 text-zinc-400 font-black text-2xl italic uppercase">
                            {trainer.full_name?.substring(0, 2) || 'TR'}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-xl bg-black border border-zinc-800 flex items-center justify-center`}>
                        <span className={`text-xl font-black italic uppercase ${colors[rank - 1].split(' ')[2]}`}>#{rank}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight line-clamp-1">
                        {trainer.full_name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className={`${tierColors[trainer.plan_tier]} text-[9px] font-black uppercase tracking-widest px-2 py-0`}>
                            {trainer.plan_tier}
                        </Badge>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-zinc-300">{trainer.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full pt-6 border-t border-zinc-900 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Alunos</p>
                        <p className="text-lg font-black text-zinc-200 italic">{trainer.studentCount}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Score</p>
                        <p className="text-lg font-black text-emerald-500 italic">{Math.round(trainer.score)}</p>
                    </div>
                </div>

                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code}`} className="w-full pt-4">
                        <Button className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                            Ver Perfil
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                ) : (
                    <div className="w-full pt-4">
                        <Button disabled className="w-full h-12 rounded-2xl bg-zinc-800 text-zinc-600 font-black uppercase italic tracking-wide cursor-not-allowed">
                            Sem código
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function RankingRow({ trainer, rank }: { trainer: any, rank: number }) {
    const tierColors: Record<string, string> = {
        'elite': 'text-purple-500',
        'pro': 'text-blue-500',
        'start': 'text-zinc-500'
    }

    return (
        <div className="flex items-center p-6 hover:bg-zinc-900/50 transition-all group">
            <div className="w-12 flex-shrink-0 text-zinc-600 font-black italic text-lg group-hover:text-zinc-400">
                #{rank}
            </div>

            <div className="flex-1 flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 border border-zinc-800 shrink-0">
                    <AvatarImage src={trainer.avatar_url} />
                    <AvatarFallback className="bg-zinc-900 text-zinc-500 font-bold text-sm uppercase">
                        {trainer.full_name?.substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                        {trainer.full_name}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${tierColors[trainer.plan_tier]}`}>
                            {trainer.plan_tier}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-amber-500/50 fill-amber-500/50" />
                            <span className="text-[10px] font-bold text-zinc-500">{trainer.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 ml-4">
                <div className="hidden sm:block text-center px-2">
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Alunos</p>
                    <p className="text-sm font-black text-zinc-400 italic">{trainer.studentCount}</p>
                </div>
                <div className="text-right min-w-[60px] md:min-w-[80px]">
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Score</p>
                    <p className="text-sm md:text-lg font-black text-emerald-500 italic">{Math.round(trainer.score)}</p>
                </div>
                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code}`}>
                        <Button variant="outline" className="h-10 px-4 rounded-xl border-zinc-800 bg-transparent hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-500 text-white font-bold uppercase italic tracking-wide transition-all group/btn">
                            Ver Perfil
                            <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                ) : (
                    <Button disabled variant="outline" className="h-10 px-4 rounded-xl border-zinc-800 bg-transparent text-zinc-700 font-bold uppercase italic tracking-wide cursor-not-allowed">
                        Sem código
                    </Button>
                )}
            </div>
        </div>
    )
}

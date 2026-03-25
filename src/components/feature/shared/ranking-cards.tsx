'use client'

import { Trophy, Star, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface TrainerRanking {
    id: string
    full_name: string
    avatar_url?: string
    trainer_code?: string
    region?: string
    rating?: number
    studentCount: number
    score: number
}

export function PodiumCard({ trainer, rank }: { trainer: TrainerRanking, rank: number }) {
    const colors = [
        "from-orange-500 to-orange-200 text-orange-500 border-orange-500/30", // 1st
        "from-zinc-400 to-zinc-100 text-zinc-400 border-zinc-400/30",    // 2nd
        "from-orange-600 to-orange-300 text-orange-600 border-orange-600/30" // 3rd
    ]

    return (
        <Card className={`group relative bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 hover:border-orange-500/40 h-full`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Trophy className={`w-32 h-32 ${colors[rank - 1]?.split(' ')[2] || ''}`} />
            </div>

            <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${colors[rank - 1]?.split(' ').slice(0, 2).join(' ') || ''} rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000`}></div>
                    <Avatar className="h-32 w-32 border-4 border-zinc-900 shadow-2xl relative">
                        <AvatarImage src={trainer.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black text-3xl italic uppercase">
                            {trainer.full_name?.substring(0, 2) || 'TR'}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl shadow-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center`}>
                        <span className={`text-2xl font-black italic uppercase ${colors[rank - 1]?.split(' ')[2] || ''}`}>#{rank}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
                            {trainer.full_name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <MapPin className="w-3 h-3" />
                            {trainer.region || 'Brasil'}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                            <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span className="text-xs font-black text-orange-500">{Number(trainer.rating || 0).toFixed(1)}</span>
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
                        <p className="text-2xl font-black text-orange-500 italic">Score {Math.round(trainer.score / 10)}</p>
                    </div>
                </div>

                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`} className="w-full pt-4">
                        <Button className="w-full h-auto min-h-[3.5rem] py-4 rounded-2xl bg-white hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95">
                            Ver Perfil
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                ) : (
                    <div className="w-full pt-4">
                        <Button disabled className="w-full h-auto min-h-[3.5rem] py-4 rounded-2xl bg-zinc-800 text-zinc-600 font-black uppercase italic tracking-wide cursor-not-allowed">
                            Sem código
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function RankingRow({ trainer, rank }: { trainer: TrainerRanking, rank: number }) {
    return (
        <div className="flex items-center p-4 md:p-8 hover:bg-zinc-800/20 transition-all group">
            <div className="w-8 md:w-16 flex-shrink-0 text-zinc-700 font-black italic text-lg md:text-2xl group-hover:text-orange-500/50 transition-colors">
                #{rank}
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-6 min-w-0">
                <Avatar className="h-10 w-10 md:h-16 md:w-16 border border-zinc-800 shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    <AvatarImage src={trainer.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-zinc-900 text-zinc-500 font-bold text-lg md:text-xl uppercase">
                        {trainer.full_name?.substring(0, 2) || 'TR'}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden space-y-1 min-w-0 flex-1">
                    <p className="text-sm md:text-xl font-black text-white italic uppercase truncate group-hover:text-orange-500 transition-colors tracking-tight pr-2">
                        {trainer.full_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Star className="w-3 h-3 text-orange-500/50 fill-orange-500/50" />
                            <span className="text-[9px] md:text-[11px] font-black text-zinc-500 tracking-widest uppercase">{Number(trainer.rating || 0).toFixed(1)} Rating</span>
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
                        <Button variant="outline" className="h-auto min-h-[3rem] py-3 px-6 rounded-xl border-zinc-800 bg-transparent hover:bg-white hover:text-zinc-950 text-white font-black uppercase italic tracking-wide transition-all group/btn">
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

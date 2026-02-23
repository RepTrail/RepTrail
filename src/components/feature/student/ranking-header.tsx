"use client"

import { Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function RankingHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-xl">
                        <Trophy className="w-5 h-5 text-zinc-950" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Ranking <span className="text-orange-500">RepTrail</span>
                    </h1>
                </div>
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
    )
}

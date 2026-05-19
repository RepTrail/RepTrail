"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function RankingHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
            <div className="space-y-2 sm:space-y-5" suppressHydrationWarning>
                <div className="flex items-center gap-3 pb-4">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Ranking <span className="text-orange-500">RepTrail</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium max-w-md leading-relaxed">
                    Conheça os profissionais que estão transformando o mercado fitness com resultados reais e suporte de elite.
                </p>
            </div>
            <Link href="/buscar-personal" className="w-full md:w-fit">
                <Button className="w-full md:w-fit h-auto min-h-[3.5rem] py-4 px-8 rounded-system bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-wide group shadow-none transition-all active:scale-95 border border-zinc-200">
                    Ver Todos os Profissionais
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>
    )
}


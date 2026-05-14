'use client'

import { CheckCircle, Dumbbell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function MissionCompletedView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="relative p-8 bg-zinc-900 rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    Missão de Hoje <span className="text-emerald-500">Concluída!</span> <span className="align-middle">✅</span>
                </h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-relaxed">
                    Você já finalizou este treino hoje. Aproveite o descanso e volte amanhã para mais resultados!
                </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button asChild className="h-14 bg-white hover:bg-zinc-200 text-zinc-950 font-black italic uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-sm">
                    <Link href="/dashboard/student/workouts">
                        Voltar aos Treinos
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="h-14 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">
                    <Link href="/dashboard/student">
                        Ir para Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}

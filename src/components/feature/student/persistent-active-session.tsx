'use client'

import { useState, useEffect } from 'react'
import { getActiveCardioSession } from '@/actions/cardio-actions'
import { getActiveWorkoutSession } from '@/actions/log-actions'
import { Activity, Dumbbell, ChevronRight, Timer } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export function PersistentActiveSession() {
    const pathname = usePathname()

    // We only show this in student area
    if (!pathname.startsWith('/dashboard/student')) return null

    const { data: cardioSession } = useQuery({
        queryKey: ['active-cardio-session'],
        queryFn: () => getActiveCardioSession(),
        refetchInterval: 15000 // Check every 15s
    })

    const { data: workoutSession } = useQuery({
        queryKey: ['active-workout-session'],
        queryFn: () => getActiveWorkoutSession(),
        refetchInterval: 15000 // Check every 15s
    })

    // Prioritize cardio if it's explicitly running, otherwise fallback to workout
    const activeSession = (cardioSession?.is_running ? cardioSession : (workoutSession || cardioSession))
    const isCardio = activeSession && 'assigned_cardio_id' in activeSession

    // ... (lines 32-44)

    if (!activeSession) return null

    const isOnMainDash = pathname === '/dashboard/student'
    if (isOnMainDash) return null

    const name = isCardio
        ? (activeSession.assignment?.cardio?.name || 'Cardio')
        : (activeSession.workout?.name || 'Treino')

    const href = isCardio ? '/dashboard/student' : '/dashboard/student'

    return (
        <div className="fixed bottom-[108px] md:bottom-8 left-4 md:left-[312px] right-4 md:right-8 z-50 animate-in slide-in-from-bottom-8 duration-500">
            <Link href={href}>
                <div className="bg-zinc-950/90 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group hover:border-orange-500/60 transition-all active:scale-[0.98] ring-1 ring-white/5">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30 relative shrink-0">
                            {isCardio ? <Activity className="w-5 h-5 md:w-6 md:h-6 text-orange-500" /> : <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />}
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-zinc-950" />
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                            <p className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-[.20em] italic leading-none truncate drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                {isCardio ? 'CARDIO ATIVO' : 'TREINO ATIVO'}
                            </p>
                            <h4 className="text-xs md:text-sm font-black text-white uppercase italic tracking-tighter truncate">{name}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <div className="hidden xs:flex flex-col items-end">
                            <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Abrir</span>
                            <div className="flex items-center gap-1">
                                <Timer className="w-2.5 h-2.5 text-orange-500/70" />
                                <span className="text-[10px] md:text-xs font-black text-white tabular-nums">Ativo</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800/80 flex items-center justify-center group-hover:bg-orange-500/20 transition-all border border-zinc-700 group-hover:border-orange-500/30">
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 group-hover:text-orange-500" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

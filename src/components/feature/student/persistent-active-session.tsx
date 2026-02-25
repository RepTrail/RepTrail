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

    const activeSession = workoutSession || cardioSession
    const isCardio = !!cardioSession && !workoutSession

    // Don't show if we are ALREADY on the main dashboard where the player is visible
    // Wait, the user said it "pauses" when they leave the dash. 
    // If they go to /dashboard/student/cardio, they see a static card.
    // If they go to /dashboard/student/diet, it's gone.
    // So we show it if they are NOT on the main dash AND there is an active session.

    if (!activeSession) return null

    // If we are on the page that has the full player, we might want to hide this mini bar
    // BUT the CardioPlayer is only on the MAIN dash (/).
    const isOnMainDash = pathname === '/dashboard/student'

    if (isOnMainDash) return null

    const name = isCardio
        ? (activeSession.assignment?.cardio?.name || 'Cardio')
        : (activeSession.workout?.name || 'Treino')

    const href = isCardio ? '/dashboard/student' : '/dashboard/student' // Both link to dash for now as players are there

    return (
        <div className="fixed bottom-24 md:bottom-8 left-6 md:left-[312px] right-6 md:right-8 z-50 animate-in slide-in-from-bottom-8 duration-500">
            <Link href={href}>
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:border-orange-500/50 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 relative">
                            {isCardio ? <Activity className="w-6 h-6 text-orange-500" /> : <Dumbbell className="w-6 h-6 text-orange-500" />}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic leading-none">Sessão em Andamento</p>
                            <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate max-w-[150px]">{name}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Toque para Abrir</span>
                            <div className="flex items-center gap-1.5">
                                <Timer className="w-3 h-3 text-zinc-500" />
                                <span className="text-xs font-black text-white tabular-nums">Ativo</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { getActiveCardioSession } from '@/actions/cardio-actions'
import { getActiveWorkoutSession } from '@/actions/log-actions'
import { Activity, Dumbbell, ChevronRight, Timer, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

import { QUERY_KEYS } from '@/lib/query-keys'

export function PersistentActiveSession() {
    const pathname = usePathname()
    const [dismissedSessionId, setDismissedSessionId] = useState<string | null>(null)
    const [swipeOffset, setSwipeOffset] = useState(0)
    const [isSwiping, setIsSwiping] = useState(false)
    const touchStartRef = useRef<number>(0)

    // We only show this in student area
    if (!pathname.startsWith('/dashboard/student')) return null

    const { data: cardioSession } = useQuery({
        queryKey: QUERY_KEYS.cardio.session,
        queryFn: () => getActiveCardioSession(),
        refetchInterval: 5000
    })

    const { data: workoutSession } = useQuery({
        queryKey: QUERY_KEYS.workouts.session,
        queryFn: () => getActiveWorkoutSession(),
        refetchInterval: 5000
    })

    // Prioritize cardio if it's explicitly running, otherwise fallback to workout
    const activeSession = (cardioSession?.is_running ? cardioSession : (workoutSession || cardioSession))
    const isCardio = activeSession && 'assigned_cardio_id' in activeSession

    useEffect(() => {
        // Reset dismissal state if a new session starts
        if (activeSession?.id && activeSession.id !== dismissedSessionId) {
            setDismissedSessionId(null)
        }
    }, [activeSession?.id])

    if (!activeSession || dismissedSessionId === activeSession.id) return null
    if (activeSession.status === 'completed') return null

    const isOnMainDash = pathname === '/dashboard/student'
    if (isOnMainDash) return null

    const name = isCardio
        ? (activeSession.assignment?.cardio?.name || 'Cardio')
        : (activeSession.workout?.name || 'Treino')

    const href = isCardio ? '/dashboard/student' : '/dashboard/student'

    // Touch Event Handlers for Swiping
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX
        setIsSwiping(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.touches[0].clientX
        const delta = currentX - touchStartRef.current
        setSwipeOffset(delta)
    }

    const handleTouchEnd = () => {
        setIsSwiping(false)
        if (Math.abs(swipeOffset) > 100) {
            // Dismiss if swiped more than 100px
            setDismissedSessionId(activeSession.id)
        }
        setSwipeOffset(0)
    }

    const opacity = Math.max(0, 1 - Math.abs(swipeOffset) / 200)

    return (
        <div
            className="fixed bottom-[108px] md:bottom-8 left-4 md:left-[312px] right-4 md:right-8 z-50 animate-in slide-in-from-bottom-8 duration-500"
            style={{
                transform: `translateX(${swipeOffset}px)`,
                opacity: opacity,
                transition: isSwiping ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative group">
                {/* Visual Hint for Swipe on Mobile */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-800 rounded-full opacity-50 md:hidden" />

                <button
                    onClick={(e) => {
                        e.preventDefault()
                        setDismissedSessionId(activeSession.id)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors z-[60] shadow-lg md:opacity-0 group-hover:opacity-100"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                <Link href={href}>
                    <div className="bg-zinc-950/90 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-orange-500/60 transition-all active:scale-[0.98] ring-1 ring-white/5">
                        <div className="flex items-center gap-3 pb-4md:gap-4 overflow-hidden">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30 relative shrink-0">
                                {isCardio ? <Activity className="w-5 h-5 md:w-6 md:h-6 text-orange-500" /> : <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />}
                                {activeSession.is_running !== false && (
                                    <>
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-zinc-950" />
                                    </>
                                )}
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                                <p className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-[.20em] italic leading-none truncate drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                    {isCardio ? (activeSession.is_running === false ? 'CARDIO PAUSADO' : 'CARDIO ATIVO') : 'TREINO ATIVO'}
                                </p>
                                <h4 className="text-xs md:text-sm font-black text-white uppercase italic tracking-tighter truncate">{name}</h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            <div className="hidden xs:flex flex-col items-end">
                                <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Abrir</span>
                                <div className="flex items-center gap-1">
                                    <Timer className={cn("w-2.5 h-2.5", activeSession.is_running === false ? "text-zinc-500" : "text-orange-500/70")} />
                                    <span className="text-[10px] md:text-xs font-black text-white tabular-nums border-none shadow-none bg-transparent p-0 m-0">
                                        {activeSession.is_running === false ? 'Pausado' : 'Ativo'}
                                    </span>
                                </div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700 hover:bg-zinc-700 transition-all">
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

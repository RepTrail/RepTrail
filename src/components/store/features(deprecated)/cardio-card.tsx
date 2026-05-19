'use client'

import { getTodayCardio, getCardioStatus } from '@/actions/cardio-actions'

import { Activity } from 'lucide-react'
import { CardioPlayer } from '@/components/store/features(deprecated)/cardio-player'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'
import { outboxDB } from '@/lib/outbox-db'

interface CardioCardProps {
    userId: string
}

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CardioCard({ userId }: CardioCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useRealtimeSync({
        table: 'assigned_cardios',
        queryKey: QUERY_KEYS.cardio.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'cardio_logs',
        queryKey: QUERY_KEYS.cardio.logs(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: cardios, isLoading } = useQuery({
        queryKey: QUERY_KEYS.cardio.today(userId),
        queryFn: () => getTodayCardio(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    const { data: cardioLogs, isLoading: isLoadingLogs } = useQuery({
        queryKey: QUERY_KEYS.cardio.logs(userId),
        queryFn: async () => {
            const logs = await getCardioStatus(userId)
            const pending = await outboxDB.getPending()
            
            // Merge pending completions from Outbox
            const pendingCompletions = pending
                .filter(p => p.action === 'finish-cardio-session' && p.payload.status === 'completed')
                .map(p => ({
                    assigned_cardio_id: p.payload.assignmentId,
                    status: 'completed',
                    _optimistic: true
                }))

            return [...(logs || []), ...pendingCompletions]
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    if (!cardios || !Array.isArray(cardios) || cardios.length === 0) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Activity className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhum cardio pendente</p>
            </div>
        )
    }

    const currentAssignment = (Array.isArray(cardios) && cardios.length > 0) ? (cardios[currentIndex] || cardios[0]) : null
    const isCompleted = cardioLogs?.some(
        (l: any) => l.assigned_cardio_id === currentAssignment?.id && l.status === 'completed'
    )

    const nextCardio = () => {
        if (!Array.isArray(cardios) || cardios.length === 0) return
        setCurrentIndex((prev) => (prev + 1) % cardios.length)
    }

    const prevCardio = () => {
        if (!Array.isArray(cardios) || cardios.length === 0) return
        setCurrentIndex((prev) => (prev - 1 + cardios.length) % cardios.length)
    }

    return (
        <div className="relative group/carousel">
            <div className="relative">
                <div className="absolute top-2 right-6 z-10">
                    {cardios.length > 1 && (
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-black/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
                            Cardio {currentIndex + 1} de {cardios.length}
                        </span>
                    )}
                </div>
                <CardioPlayer assignment={currentAssignment} isCompleted={isCompleted} />
            </div>

            {cardios.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.preventDefault(); prevCardio(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all shadow-2xl z-20 group-hover/carousel:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); nextCardio(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all shadow-2xl z-20 group-hover/carousel:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {cardios.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-500 shadow-sm ${idx === currentIndex ? 'w-6 bg-orange-500' : 'w-1 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}



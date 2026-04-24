'use client'

import { getTodayCardio, getCardioStatus } from '@/actions/cardio-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Flame, Activity } from 'lucide-react'
import { CardioPlayer } from '@/components/feature/student/cardio-player'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { outboxDB } from '@/lib/outbox-db'

interface CardioCardProps {
    userId: string
}

export function CardioCard({ userId }: CardioCardProps) {
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

    // Skeleton Fallback: Only if loading AND no cache available
    if ((isLoading || isLoadingLogs) && (!cardios || cardios.length === 0)) {
        return <CardioCardSkeleton />
    }

    if (!cardios || cardios.length === 0) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Activity className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhum cardio pendente</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            {cardios.map((assignment: any) => {
                const isCompleted = cardioLogs?.some(
                    (l: any) => l.assigned_cardio_id === assignment.id && l.status === 'completed'
                )
                return <CardioPlayer key={assignment.id} assignment={assignment} isCompleted={isCompleted} />
            })}
            {cardios.length > 1 && (
                <div className="px-8 py-4 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        Próximos Cardios: {cardios.length - 1} pendente(s)
                    </span>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic animate-pulse">
                        Execute um por vez
                    </span>
                </div>
            )}
        </div>
    )
}

export function CardioCardSkeleton() {
    return <CardioPlayer.Skeleton />
}

CardioCard.Skeleton = CardioCardSkeleton

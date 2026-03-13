'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Flame, Activity } from 'lucide-react'
import { CardioPlayer } from '@/components/feature/student/cardio-player'
import { getTodayRangeBrazil } from '@/lib/date-utils'

interface CardioCardProps {
    userId: string
}

export function CardioCard({ userId }: CardioCardProps) {
    const { data: rawCardios, isLoading } = useQuery({
        queryKey: ['cardio-assignments', userId],
        queryFn: () => getStudentCardioAssignments(userId),
        staleTime: 1000 * 30, // 30 seconds
    })

    const { data: cardioLogs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['today-cardio-logs', userId],
        queryFn: async () => {
            const supabase = createClient()
            const { start, end } = getTodayRangeBrazil()
            const { data } = await supabase
                .from('cardio_logs')
                .select('assigned_cardio_id, status')
                .eq('student_id', userId)
                .gte('started_at', start)
                .lte('started_at', end)
            return data || []
        }
    })

    if (isLoading || isLoadingLogs) {
        return (
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl border-t-zinc-700/10 p-6 sm:p-10 rounded-3xl overflow-hidden backdrop-blur-sm space-y-8 min-h-[400px] animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-4">
                            <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                                <Activity className="w-5 h-5 text-zinc-800" />
                            </div>
                            <Skeleton className="h-6 w-40 rounded-lg bg-zinc-800/50" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-16 rounded-md bg-zinc-800/50" />
                            <Skeleton className="h-4 w-20 rounded-md bg-zinc-800/50" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                    <Skeleton className="h-20 w-48 rounded-2xl bg-zinc-800/50" />
                    <Skeleton className="h-2 w-full max-w-xs rounded-full bg-zinc-800/50" />
                </div>

                <div className="flex items-center justify-center gap-6">
                    <Skeleton className="w-20 h-20 rounded-full bg-zinc-800/50" />
                    <Skeleton className="w-16 h-16 rounded-full bg-zinc-800/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center justify-center gap-1">
                        <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                        <Skeleton className="h-4 w-16 bg-zinc-800/50" />
                    </div>
                    <div className="h-16 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center justify-center gap-1">
                        <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                        <Skeleton className="h-4 w-16 bg-zinc-800/50" />
                    </div>
                </div>
            </div>
        )
    }

    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const today = tzNow.getDay()

    const cardios = rawCardios?.filter((a: any) => {
        const hasDaysArray = a.days_of_week && Array.isArray(a.days_of_week) && a.days_of_week.length > 0;
        const hasDaySingular = a.day_of_week !== undefined && a.day_of_week !== null;

        if (hasDaysArray) return a.days_of_week.includes(today);
        if (hasDaySingular) return a.day_of_week === today;

        return true; // Show by default if no specific day constraint
    }) || []

    if (cardios.length === 0) {
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

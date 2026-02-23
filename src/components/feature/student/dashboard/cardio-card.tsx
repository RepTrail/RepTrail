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
        staleTime: 1000 * 60 * 10, // 10 min
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
        return <Skeleton className="h-[200px] w-full rounded-[2.5rem]" />
    }

    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const today = tzNow.getDay()

    const cardios = rawCardios?.filter((a: any) =>
        !a.days_of_week || a.days_of_week.length === 0 || a.days_of_week.includes(today)
    ) || []

    if (cardios.length === 0) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
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

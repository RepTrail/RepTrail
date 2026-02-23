'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentMetricsHistory } from '@/actions/metrics-actions'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

interface MetricsSummaryProps {
    userId: string
}

export function MetricsSummary({ userId }: MetricsSummaryProps) {
    const { data: metrics, isLoading } = useQuery({
        queryKey: ['student-metrics', userId],
        queryFn: async () => {
            const history = await getStudentMetricsHistory(userId)
            const supabase = createClient()
            const { data: details } = await supabase
                .from('student_details')
                .select('body_fat')
                .eq('id', userId)
                .single()

            return {
                latestWeight: history.weights[history.weights.length - 1]?.weight_kg,
                latestBF: history.bfs[history.bfs.length - 1]?.bf_percentage || details?.body_fat
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-5 space-y-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Peso</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white italic">{metrics?.latestWeight || '--'}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">kg</span>
                </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-5 space-y-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Gordura</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white italic">{metrics?.latestBF || '--'}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">%</span>
                </div>
            </div>
        </div>
    )
}

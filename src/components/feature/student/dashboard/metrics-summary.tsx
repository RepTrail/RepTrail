'use client'

import { getMetricsSummary } from '@/actions/metrics-actions'
import { Skeleton } from '@/components/ui/skeleton'

import { QUERY_KEYS } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

interface MetricsSummaryProps {
    userId: string
}

export function MetricsSummary({ userId }: MetricsSummaryProps) {
    const { data: metrics, isLoading } = useQuery({
        queryKey: QUERY_KEYS.student.metricsSummary(userId),
        enabled: !!userId,
        queryFn: () => getMetricsSummary(userId),
    })

    // Skeleton Fallback: Only if loading AND no cache available
    if (isLoading && !metrics) {
        return (
            <div className="grid grid-cols-2 gap-4 animate-pulse">
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-5 space-y-2">
                    <Skeleton className="h-2 w-10 bg-zinc-800/50" />
                    <Skeleton className="h-6 w-16 bg-zinc-800/50" />
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-5 space-y-2">
                    <Skeleton className="h-2 w-10 bg-zinc-800/50" />
                    <Skeleton className="h-6 w-16 bg-zinc-800/50" />
                </div>
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

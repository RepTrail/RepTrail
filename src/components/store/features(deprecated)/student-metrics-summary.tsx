'use client'

import { getMetricsSummary } from '@/actions/metrics-actions'
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

    if (isLoading && !metrics) {
        return null
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-system p-5 space-y-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Peso</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white italic">{metrics?.latestWeight || '--'}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">kg</span>
                </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-system p-5 space-y-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Gordura</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white italic">{metrics?.latestBF || '--'}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">%</span>
                </div>
            </div>
        </div>
    )
}

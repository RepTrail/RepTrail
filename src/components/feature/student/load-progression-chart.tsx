'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, TrendingUp } from 'lucide-react'

interface LoadProgressionChartProps {
    data: any[]
}

export function LoadProgressionChart({ data }: LoadProgressionChartProps) {
    // Process data to group by exercise and find top 3 exercises by entries
    const exerciseHistory = useMemo(() => {
        const grouped: any = {}
        data.forEach(entry => {
            const name = entry.exercises?.name || 'Exercício'
            if (!grouped[name]) grouped[name] = []
            grouped[name].push({
                val: entry.weight_kg,
                date: new Date(entry.recorded_at).getTime()
            })
        })

        return Object.entries(grouped)
            .sort((a: any, b: any) => b[1].length - a[1].length)
            .slice(0, 3)
    }, [data])

    if (exerciseHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-zinc-950/30 rounded-3xl border border-dashed border-zinc-800">
                <Dumbbell className="w-8 h-8 text-zinc-800" />
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Ainda não há histórico de cargas registrado.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {exerciseHistory.map(([name, history]: any) => (
                <Card key={name} className="bg-zinc-950/50 border-zinc-800/80 rounded-[2rem] overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <CardHeader className="p-6 pb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest truncate max-w-[150px]">{name}</span>
                            <TrendingUp className="w-3.5 h-3.5 text-zinc-700" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="mt-4 h-24 relative">
                            <MiniChart history={history} />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Carga Máxima</p>
                                <p className="text-xl font-black text-white italic uppercase">{Math.max(...history.map((h: any) => h.val))}KG</p>
                            </div>
                            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function MiniChart({ history }: { history: any[] }) {
    const points = useMemo(() => {
        if (history.length < 2) return []
        const minTime = Math.min(...history.map(h => h.date))
        const maxTime = Math.max(...history.map(h => h.date))
        const timeRange = maxTime - minTime || 1

        const minVal = Math.min(...history.map(h => h.val))
        const maxVal = Math.max(...history.map(h => h.val))
        const valRange = (maxVal - minVal) || 1
        const padding = valRange * 0.2

        return history.map(h => ({
            x: ((h.date - minTime) / timeRange) * 100,
            y: 100 - (((h.val - (minVal - padding)) / (valRange + padding * 2)) * 100)
        }))
    }, [history])

    if (points.length < 2) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        )
    }

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path
                d={d}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
        </svg>
    )
}

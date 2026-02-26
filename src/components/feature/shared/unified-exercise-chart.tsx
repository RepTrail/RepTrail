'use client'

import * as React from 'react'
import { useMemo, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadPoint {
    weight_kg: number
    recorded_at: string
    exercises?: { name: string }
}

interface UnifiedExerciseChartProps {
    data: LoadPoint[]
    mode?: 'mini' | 'detailed'
    exerciseName?: string
    limit?: number
    className?: string
}

export function UnifiedExerciseChart({
    data,
    mode = 'mini',
    exerciseName,
    limit = 3,
    className
}: UnifiedExerciseChartProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll for detailed mode
    useEffect(() => {
        if (mode === 'detailed' && scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
        }
    }, [data, mode])

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return []

        const grouped: Record<string, any[]> = {}
        data.forEach(entry => {
            const name = entry.exercises?.name || 'Exercício'
            if (!grouped[name]) grouped[name] = []
            grouped[name].push({
                val: entry.weight_kg,
                date: new Date(entry.recorded_at).getTime(),
                dateStr: new Date(entry.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                rawDate: new Date(entry.recorded_at)
            })
        })

        if (mode === 'detailed' && exerciseName) {
            const history = grouped[exerciseName] || []
            // Group by day for detailed view (max weight per session)
            const sessionMap = new Map<string, any>()
            history.forEach(h => {
                const dayKey = h.dateStr
                if (!sessionMap.has(dayKey) || h.val > sessionMap.get(dayKey).val) {
                    sessionMap.set(dayKey, h)
                }
            })
            return Array.from(sessionMap.values()).sort((a, b) => a.date - b.date)
        }

        // Mini mode: return top N exercises sorted by entry count
        return Object.entries(grouped)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, limit)
            .map(([name, history]) => ({
                name,
                history: history.sort((a, b) => a.date - b.date),
                maxWeight: Math.max(...history.map(h => h.val))
            }))
    }, [data, mode, exerciseName, limit])

    if (data.length === 0 || processedData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-zinc-950/30 rounded-[2.5rem] border border-dashed border-zinc-800/50">
                <Dumbbell className="w-10 h-10 text-zinc-800" />
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                    Nenhum histórico de cargas encontrado.
                </p>
            </div>
        )
    }

    if (mode === 'mini') {
        return (
            <div className={cn("grid gap-6 md:grid-cols-3", className)}>
                {(processedData as any[]).map((item) => (
                    <Card key={item.name} className="bg-zinc-900/40 border-zinc-800/80 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/50 transition-all shadow-2xl backdrop-blur-sm">
                        <CardHeader className="p-8 pb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest truncate max-w-[150px] italic">{item.name}</span>
                                <TrendingUp className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="mt-4 h-24 relative">
                                <MiniSVGChart history={item.history} />
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Máximo</p>
                                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{item.maxWeight}<span className="text-zinc-600 text-sm ml-1">KG</span></p>
                                </div>
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all duration-500">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // Detailed Mode
    const points = processedData as any[]
    const weights = points.map(p => p.val)
    const maxWeightTotal = Math.max(...weights)
    const minWeightTotal = Math.min(...weights)
    const weightEvo = points.length > 1 ? points[points.length - 1].val - points[0].val : 0

    return (
        <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", className)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none">Evolução de Cargas</p>
                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{exerciseName}</h4>
                </div>
                {weightEvo !== 0 && (
                    <div className={cn(
                        "flex items-center gap-4 px-6 py-3 rounded-2xl border-2 self-start",
                        weightEvo > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                        <TrendingUp className={cn("w-5 h-5", weightEvo < 0 && "rotate-180")} />
                        <span className="text-sm font-black uppercase italic tracking-tight">
                            {weightEvo > 0 ? '+' : ''}{weightEvo.toFixed(1)}kg de evolução
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-[3rem] p-8 space-y-6 shadow-3xl backdrop-blur-xl">
                <div
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto scrollbar-hide"
                >
                    <div className="min-w-max flex items-end gap-10 h-56 pt-10 px-4">
                        {points.map((p, i) => {
                            const h = maxWeightTotal === minWeightTotal ? 50 : ((p.val - minWeightTotal) / (maxWeightTotal - minWeightTotal)) * 100
                            return (
                                <div key={i} className="flex flex-col items-center gap-4 group">
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                                            {p.val}kg
                                        </div>
                                    </div>
                                    <div className="relative flex flex-col items-center justify-end h-32 w-14">
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-2xl transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                            style={{ height: `${Math.max(h, 8)}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                                        {p.dateStr}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-inner">
                    <Activity className="w-6 h-6 text-emerald-500/50" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nota Técnica</p>
                    <p className="text-[11px] font-medium text-zinc-400 italic leading-relaxed">
                        Este gráfico exibe apenas as cargas das <span className="text-white">séries de trabalho</span> para garantir uma análise precisa da força real.
                    </p>
                </div>
            </div>
        </div>
    )
}

function MiniSVGChart({ history }: { history: any[] }) {
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
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-20" />
                <div className="absolute w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
        )
    }

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`${d} L 100 100 L 0 100 Z`}
                fill="url(#grad)"
            />
            <path
                d={d}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
        </svg>
    )
}

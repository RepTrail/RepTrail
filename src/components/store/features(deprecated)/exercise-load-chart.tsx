'use client'

import { useMemo, useRef, useEffect } from 'react'
import { TrendingUp, Activity } from 'lucide-react'

interface LoadPoint {
    weight_kg: number
    recorded_at: string
}

interface ExerciseLoadChartProps {
    data: LoadPoint[]
    exerciseName: string
}

export function ExerciseLoadChart({ data, exerciseName }: ExerciseLoadChartProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to end on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
        }
    }, [data])

    const { points, maxWeight, minWeight } = useMemo(() => {
        if (!data || data.length === 0) return { points: [], maxWeight: 0, minWeight: 0 }

        // Filter out invalid dates or entries without weight
        const validData = data.filter(d => {
            if (!d.recorded_at || Number(d.weight_kg) <= 0) return false
            const date = new Date(d.recorded_at)
            return !isNaN(date.getTime())
        })

        if (validData.length === 0) return { points: [], maxWeight: 0, minWeight: 0 }

        // Group by workout/date to show "treino a treino" progress
        // We take the max weight of the working sets for each session
        const sessionMap = new Map<string, { weight: number, date: string, rawDate: Date }>()

        validData.forEach(d => {
            const dateObj = new Date(d.recorded_at)
            // Use date string as key to group by day
            const dayKey = dateObj.toLocaleDateString('pt-BR')
            const weight = Number(d.weight_kg)

            const existing = sessionMap.get(dayKey)
            if (!existing || weight > existing.weight) {
                sessionMap.set(dayKey, {
                    weight,
                    date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    rawDate: dateObj
                })
            }
        })

        const aggregatedPoints = Array.from(sessionMap.values())
            .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
            .map((p, i) => ({
                weight: p.weight,
                date: p.date,
                index: i
            }))

        const weights = aggregatedPoints.map(p => p.weight)
        const maxW = Math.max(...weights)
        const minW = Math.min(...weights)

        return { points: aggregatedPoints, maxWeight: maxW, minWeight: minW }
    }, [data])

    // If no data initially or after filtering
    if (data.length === 0 || points.length === 0) {
        return (
            <div className="py-12 text-center bg-zinc-900/20 rounded-system border border-zinc-800/50 border-dashed">
                <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em] italic">Nenhum dado de carga registrado para este exercício</p>
            </div>
        )
    }

    const weightEvolution = points.length > 1 ? points[points.length - 1].weight - points[0].weight : 0

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Carga Máxima (Working Sets)</p>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">{exerciseName}</h4>
                </div>
                {weightEvolution !== 0 && (
                    <div className={`flex items-center gap-3 pb-4border  py-2 rounded-system ${weightEvolution > 0
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                        }`}>
                        <TrendingUp className={`w-4 h-4 ${weightEvolution > 0 ? 'text-emerald-500' : 'text-red-500 rotate-180'}`} />
                        <span className={`text-xs font-black uppercase tracking-tight italic ${weightEvolution > 0 ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                            {weightEvolution > 0 ? '+' : ''}{weightEvolution.toFixed(1)}kg DE EVOLUÇÃO
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide bg-zinc-900/30 rounded-system border border-zinc-800 p-6"
                >
                    <div className="min-w-max flex items-end gap-8 h-48">
                        {points.map((point, i) => {
                            const heightPercent = maxWeight === minWeight
                                ? 50
                                : ((point.weight - minWeight) / (maxWeight - minWeight)) * 100

                            return (
                                <div key={i} className="flex flex-col items-center gap-3 group">
                                    {/* Weight Label */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-black text-emerald-500 uppercase italic">
                                            {point.weight}kg
                                        </span>
                                    </div>

                                    {/* Bar */}
                                    <div className="relative flex flex-col items-center justify-end" style={{ height: '120px' }}>
                                        <div
                                            className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-300 group-hover:w-14"
                                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                        />
                                    </div>

                                    {/* Date */}
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">
                                        {point.date}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Role para o lado para ver o histórico completo</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                </div>
            </div>

            {/* Technical Note */}
            <div className="bg-zinc-900/40 p-5 rounded-system border border-zinc-800/50 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-zinc-700" />
                    Nota Técnica
                </div>
                <p className="text-[11px] font-medium text-zinc-400 italic leading-relaxed">
                    Este gráfico mostra apenas a carga das **séries de trabalho**. Aquecimentos e feeders são filtrados para garantir uma visão clara do progresso de força real.
                </p>
            </div>
        </div>
    )
}


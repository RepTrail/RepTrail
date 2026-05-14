"use client"

import { useMemo, useRef, useEffect, useState } from 'react'
import { format, differenceInDays, addDays, parseISO, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts'

interface StudentMetricsChartProps {
    weights: { weight_kg: number; recorded_at: string }[]
    bfs: { bf_percentage: number; recorded_at: string }[]
    frequency: { week: string; date: string; sessions: number }[]
}

export function StudentMetricsChart({ weights, bfs, frequency }: StudentMetricsChartProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // 1. Process Data
    const chartData = useMemo(() => {
        // Collect all available dates
        const allDates = new Set<string>()
        weights.forEach(w => allDates.add(w.recorded_at.split('T')[0]))
        bfs.forEach(b => allDates.add(b.recorded_at.split('T')[0]))
        frequency.forEach(f => allDates.add(f.date.split('T')[0]))

        // Default range if no data
        if (allDates.size === 0) {
            const today = new Date()
            allDates.add(today.toISOString().split('T')[0])
            allDates.add(new Date(today.getTime() - 86400000 * 30).toISOString().split('T')[0])
        }

        const sortedUniqueDates = Array.from(allDates).sort()
        const minDateStr = sortedUniqueDates[0]
        const maxDateStr = sortedUniqueDates[sortedUniqueDates.length - 1]

        const minDate = parseISO(minDateStr)
        const maxDate = parseISO(maxDateStr)
        const daysDiff = Math.max(1, differenceInDays(maxDate, minDate))

        // Find the first available data point dates to avoid back-padding lines
        const sortedW = [...weights].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
        const sortedB = [...bfs].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
        const firstWDate = sortedW.length > 0 ? sortedW[0].recorded_at.split('T')[0] : null
        const firstBDate = sortedB.length > 0 ? sortedB[0].recorded_at.split('T')[0] : null

        // Generate full daily range
        const data = []
        
        const lastWDate = sortedW.length > 0 ? sortedW[sortedW.length - 1].recorded_at.split('T')[0] : null
        const lastBDate = sortedB.length > 0 ? sortedB[sortedB.length - 1].recorded_at.split('T')[0] : null
        
        // Initial values for back-filling and tracking
        let currentWeight: number | null = sortedW.length > 0 ? sortedW[0].weight_kg : null
        let currentBf: number | null = sortedB.length > 0 ? sortedB[0].bf_percentage : null

        const sortedFreq = [...frequency].sort((a, b) => a.date.localeCompare(b.date))
        let lastPerformance: number | null = sortedFreq.length > 0 ? sortedFreq[0].sessions : null

        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = addDays(minDate, i)
            const dateStr = format(currentDate, 'yyyy-MM-dd')

            const weightEntry = weights.find(w => w.recorded_at.startsWith(dateStr))
            const bfEntry = bfs.find(b => b.recorded_at.startsWith(dateStr))
            const freqEntry = frequency.find(f => f.date.startsWith(dateStr))

            if (weightEntry) currentWeight = weightEntry.weight_kg
            if (bfEntry) currentBf = bfEntry.bf_percentage
            if (freqEntry) lastPerformance = freqEntry.sessions

            const isWeightPastLast = lastWDate && dateStr > lastWDate
            const isWeightBeforeFirst = firstWDate && dateStr < firstWDate
            
            const isBfPastLast = lastBDate && dateStr > lastBDate
            const isBfBeforeFirst = firstBDate && dateStr < firstBDate

            data.push({
                date: dateStr,
                displayDate: format(currentDate, 'dd/MM'),
                // Only use value if it's a real entry, or if we are outside the [first, last] range
                weight: weightEntry ? weightEntry.weight_kg : ((isWeightPastLast || isWeightBeforeFirst) ? currentWeight : null),
                bf: bfEntry ? bfEntry.bf_percentage : ((isBfPastLast || isBfBeforeFirst) ? currentBf : null),
                performance: lastPerformance,
                realWeight: !!weightEntry,
                realBf: !!bfEntry,
                realPerformance: !!freqEntry
            })
        }
        return data
    }, [weights, bfs, frequency])

    // Weight/BF Domain calculation (Min/Max with padding)
    const weightDomain = useMemo(() => {
        const vals = weights.map(w => w.weight_kg)
        if (!vals.length) return [0, 100]
        const min = Math.min(...vals)
        const max = Math.max(...vals)
        const padding = (max - min) * 0.2 || 5
        return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)]
    }, [weights])

    const bfDomain = useMemo(() => {
        const vals = bfs.map(b => b.bf_percentage)
        if (!vals.length) return [0, 30]
        const min = Math.min(...vals)
        const max = Math.max(...vals)
        const padding = (max - min) * 0.2 || 2
        return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)]
    }, [bfs])

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-system shadow-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
                    {payload.map((entry: any) => {
                        if (entry.value === null) return null
                        return (
                            <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-bold text-zinc-300 capitalize">
                                    {entry.name}:
                                </span>
                                <span className="text-xs font-black text-white">
                                    {entry.value}{entry.unit}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return null
    }

    const CustomWeightDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (!payload.realWeight) return null;
        return <circle cx={cx} cy={cy} r={4} fill="#000" stroke="#eab308" strokeWidth={2} />;
    }

    const CustomBfDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (!payload.realBf) return null;
        return <circle cx={cx} cy={cy} r={4} fill="#000" stroke="#ef4444" strokeWidth={2} />;
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [chartData])

    // Calcule uma largura mínima para o gráfico baseada na quantidade de dados.
    // Ex: 50px de largura para cada dia para não ficar amassado (mínimo de 100% da tela)
    const minChartWidth = Math.max(100, chartData.length * 40)

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-end px-2">
                <LegendItem color="#10b981" label="Performance" />
                <LegendItem color="#eab308" label="Peso" />
                <LegendItem color="#ef4444" label="BF%" />
            </div>

            <div className="h-[300px] w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide" ref={scrollRef}>
                <div style={{ minWidth: mounted ? `${Math.max(100, chartData.length * 40)}px` : '100%', width: '100%', height: '100%' }} className="relative">
                    {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="displayDate"
                                    stroke="#52525b"
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#71717a' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                    minTickGap={30}
                                />

                                {/* Left Y Axis - Performance % */}
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    stroke="#10b981"
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#10b981' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                    unit="%"
                                    width={35}
                                />

                                {/* Right Y Axis - Weight */}
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#eab308"
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#eab308' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={weightDomain}
                                    unit="kg"
                                    width={35}
                                />

                                {/* Hidden Y Axis - BF (Keep it hidden but ensure it exists) */}
                                <YAxis
                                    yAxisId="bf-axis"
                                    orientation="right"
                                    stroke="#ef4444"
                                    domain={bfDomain}
                                    unit="%"
                                    hide={true}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                {/* Performance Line - Continuous */}
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="performance"
                                    name="Performance"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                                    connectNulls={true}
                                    unit="%"
                                />

                                {/* Weight Line - Manual Points Only, Linear Interp */}
                                <Line
                                    yAxisId="right"
                                    type="linear"
                                    dataKey="weight"
                                    name="Peso"
                                    stroke="#eab308"
                                    strokeWidth={2}
                                    dot={<CustomWeightDot />}
                                    activeDot={{ r: 6, fill: '#eab308' }}
                                    connectNulls={true}
                                    unit="kg"
                                />

                                {/* BF Line - Manual Points Only, Linear Interp */}
                                <Line
                                    yAxisId="bf-axis"
                                    type="linear"
                                    dataKey="bf"
                                    name="Gordura"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={<CustomBfDot />}
                                    activeDot={{ r: 6, fill: '#ef4444' }}
                                    connectNulls={true}
                                    unit="%"
                                />

                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full bg-zinc-900/10 animate-pulse rounded-system" />
                    )}
                </div>
            </div>
        </div>
    )
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-zinc-950/50" style={{ backgroundColor: color, '--tw-ring-color': color } as any} />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
        </div>
    )
}


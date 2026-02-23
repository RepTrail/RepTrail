'use client'

import { useMemo, useRef, useEffect } from 'react'
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
        // Back-fill: initialize with the first available value to make lines start from the beginning
        let lastWeight: number | null = sortedW.length > 0 ? sortedW[0].weight_kg : null
        let lastBf: number | null = sortedB.length > 0 ? sortedB[0].bf_percentage : null

        const sortedFreq = [...frequency].sort((a, b) => a.date.localeCompare(b.date))
        let lastPerformance: number | null = sortedFreq.length > 0 ? sortedFreq[0].sessions : null

        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = addDays(minDate, i)
            const dateStr = format(currentDate, 'yyyy-MM-dd')

            const weightEntries = weights.filter(w => w.recorded_at.startsWith(dateStr))
            const bfEntries = bfs.filter(b => b.recorded_at.startsWith(dateStr))

            const weightEntry = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null
            const bfEntry = bfEntries.length > 0 ? bfEntries[bfEntries.length - 1] : null
            const freqEntry = frequency.find(f => f.date.startsWith(dateStr))

            if (weightEntry) lastWeight = weightEntry.weight_kg
            if (bfEntry) lastBf = bfEntry.bf_percentage
            if (freqEntry) lastPerformance = freqEntry.sessions

            data.push({
                date: dateStr,
                displayDate: format(currentDate, 'dd/MM'),
                weight: lastWeight,
                bf: lastBf,
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
                <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl shadow-2xl backdrop-blur-md">
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
        return <circle cx={cx} cy={cy} r={4} fill="#000" stroke="#fff" strokeWidth={2} />;
    }

    const CustomBfDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (!payload.realBf) return null;
        return <circle cx={cx} cy={cy} r={4} fill="#000" stroke="#10b981" strokeWidth={2} />;
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
                <LegendItem color="#3b82f6" label="Performance" />
                <LegendItem color="#ffffff" label="Peso" />
                <LegendItem color="#10b981" label="BF%" />
            </div>

            <div className="h-[300px] w-full overflow-x-auto overflow-y-hidden" ref={scrollRef}>
                <div style={{ minWidth: `${minChartWidth}px`, width: '100%', height: '100%' }}>
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
                                stroke="#3b82f6"
                                tick={{ fontSize: 10, fontWeight: 800, fill: '#3b82f6' }}
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
                                stroke="#a1a1aa" // gray to match weight line better than green
                                tick={{ fontSize: 10, fontWeight: 800, fill: '#a1a1aa' }}
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
                                stroke="#10b981"
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
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 4, fill: '#3b82f6', stroke: '#1e3a8a', strokeWidth: 2 }}
                                connectNulls={true}
                                unit="%"
                            />

                            {/* Weight Line - Manual Points Only, Linear Interp */}
                            <Line
                                yAxisId="right"
                                type="linear"
                                dataKey="weight"
                                name="Peso"
                                stroke="#ffffff"
                                strokeWidth={2}
                                dot={<CustomWeightDot />}
                                activeDot={{ r: 6, fill: '#fff' }}
                                connectNulls={true}
                                unit="kg"
                            />

                            {/* BF Line - Manual Points Only, Linear Interp */}
                            <Line
                                yAxisId="bf-axis"
                                type="linear"
                                dataKey="bf"
                                name="Gordura"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={<CustomBfDot />}
                                activeDot={{ r: 6, fill: '#10b981' }}
                                connectNulls={true}
                                unit="%"
                            />

                        </LineChart>
                    </ResponsiveContainer>
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

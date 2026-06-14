"use client"

import { useMemo, useRef, useEffect, useState } from 'react'
import { format, differenceInDays, addDays, parseISO } from 'date-fns'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import { Stack } from '@/components/store/base/stack'
import { Box, BoxColor } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RechartsChartTooltip } from '@/components/store/intermediary/chart-tooltip'

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

    // Custom Tooltip handled by shared intermediary component

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

    const chartWidth = mounted ? Math.max(chartData.length * 40, 600) : 600

    return (
        <Box fullWidth minWidth={0}>
            <Stack fullWidth gap={STORE_TOKENS.SPACING.SECTION}>
                <Stack direction="row" wrap="wrap" gap={STORE_TOKENS.SPACING.CONTAINER} align="center" justify="end">
                    <LegendItem label="Performance" color="success" />
                    <LegendItem label="Peso" color="warning" />
                    <LegendItem label="BF%" color="red" />
                </Stack>
                {/* overflow-x: auto no wrapper, gráfico com largura fixa para evitar vazamento */}
                <Box
                    ref={scrollRef as any}
                    fullWidth
                    minWidth={0}
                    height="320px"
                    overflowX="auto"
                    overflowY="hidden"
                    customScrollbar
                >
                    {mounted ? (
                        <LineChart
                            width={chartWidth}
                            height={300}
                            data={chartData}
                            margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                        >
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

                            {/* Hidden Y Axis - BF */}
                            <YAxis
                                yAxisId="bf-axis"
                                orientation="right"
                                stroke="#ef4444"
                                domain={bfDomain}
                                unit="%"
                                hide={true}
                            />

                            <Tooltip
                                content={<RechartsChartTooltip layout="spaced" />}
                                wrapperStyle={{ zIndex: 50, outline: 'none' }}
                                cursor={{ stroke: STORE_TOKENS.COLORS.DIVIDER.STANDARD, strokeWidth: 1, strokeDasharray: '4 4' }}
                            />

                            {/* Performance Line */}
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

                            {/* Weight Line */}
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

                            {/* BF Line */}
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
                    ) : (
                        <Box fullWidth fullHeight bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    )}
                </Box>
            </Stack>
        </Box>
    );
}

function LegendItem({ color, label }: { color: BoxColor, label: string }) {
    return (
        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Box width="8px" height="8px" rounded={STORE_TOKENS.RADIUS.FULL} bg={color} />
            <Font
                variant="sub-tiny"
                weight="black"
                uppercase
                {...{
                    color: "zinc-500",
                }}>{label}</Font>
        </Stack>
    );
}


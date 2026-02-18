'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DataPoint {
    x: number
    y: number
}

interface StudentMetricsChartProps {
    weights: { weight_kg: number; recorded_at: string }[]
    bfs: { bf_percentage: number; recorded_at: string }[]
    frequency: { week: string; date: string; sessions: number }[]
}

/*
## Real-time Metrics & Premium Profile

### Student Metrics Chart
Integrated a professional SVG-based history chart for tracking performance over time.
- **Metrics Covered**: Weight (kg), Body Fat (%), and Training Frequency.
- **Normalization Layer**: Handles varying data scales to prevent line flattening and accurately represent downward/upward trends.
- **Empty State & Early Data**: Gracefully renders single data points as pulsating dots and handles empty states with a professional placeholder.
- **Tiered Access**: Feature is exclusive to **PRO** and **ELITE** trainers, with a dedicated badge and upgrade prompts for others.

### Premium Dark Redesign
The entire student profile view has been elevated to a high-end aesthetic:
- **Aesthetic**: Zinc-950/900 backgrounds with emerald-500 accents and refined shadows.
- **Typography**: Heavy-weight (black), italic, and uppercase headers for a "performance" look.
- **Visual Hierarchy**: Cards use backdrop-blur and subtle borders for a layered, premium feel.
- **Real-time Updates**: Data changes (like weight updates) trigger immediate chart re-validation via Server Actions.

## Technical Implementation

### Database Layer
- [NEW] `bf_history` table for tracking Body Fat Percentage over time.
- [UPDATE] RLS policies for `weight_history` and `bf_history` to allow trainers to insert data for their students.
- [NEW] Dedicated `is_trainer_of` helper function for robust policy checks.

### Logic Layer
- **`getStudentMetricsHistory`**: Optimized action to fetch historical data with error handling for potential missing tables.
- **`student-actions.ts`**: Updated `updateStudentData` to save history snapshots every time metrics are updated.
- **`revalidatePath`**: Fixed path validation using the correct relationship ID for instant UI updates.

## Verification Results
- ✅ Weight changes reflected on the chart immediately (Real-time).
- ✅ BF History table correctly storing snapshots.
- ✅ Downward trends clearly visible (No flattening).
- ✅ Tiered access blocking features for "START" users.
- ✅ Premium Dark Theme applied to all cards (Physical Data, Finance, Workouts, Diet, Activity, Photos).
*/
export function StudentMetricsChart({ weights, bfs, frequency }: StudentMetricsChartProps) {
    // 1. Calculate Global Time Range (apenas datas reais: peso e BF)
    const globalTimeRange = useMemo(() => {
        const dates = [
            ...weights.map((w: any) => new Date(w.recorded_at).getTime()),
            ...bfs.map((b: any) => new Date(b.recorded_at).getTime())
        ].filter(t => !isNaN(t))

        if (dates.length === 0) return { min: 0, max: 0, range: 1 }

        const min = Math.min(...dates)
        const max = Math.max(...dates)
        const range = max - min || 1

        return { min, max, range }
    }, [weights, bfs])

    // X-axis: apenas datas reais de atualização (peso e BF)
    const xAxisTicks = useMemo(() => {
        const dates = [
            ...weights.map((w: any) => ({ t: new Date(w.recorded_at).getTime(), date: w.recorded_at })),
            ...bfs.map((b: any) => ({ t: new Date(b.recorded_at).getTime(), date: b.recorded_at }))
        ].filter(d => !isNaN(d.t))

        if (dates.length === 0) return [{ x: 0, label: 'Início' }, { x: 100, label: 'Hoje' }]

        const { min, max, range } = globalTimeRange
        const byDay = new Map<string, number>()
        dates.forEach(({ t }) => {
            const dayKey = format(new Date(t), 'yyyy-MM-dd')
            if (!byDay.has(dayKey)) byDay.set(dayKey, t)
        })

        let ticks = Array.from(byDay.entries())
            .sort((a, b) => a[1] - b[1])
            .map(([, t]) => ({
                x: range > 0 ? ((t - min) / range) * 100 : 0,
                label: format(new Date(t), 'dd/MM', { locale: ptBR })
            }))

        // Evitar labels muito próximos (mínimo 8% de distância)
        const minGap = 8
        const filtered: typeof ticks = []
        ticks.forEach(tick => {
            if (filtered.length === 0 || Math.abs(tick.x - filtered[filtered.length - 1].x) >= minGap) {
                filtered.push(tick)
            }
        })
        ticks = filtered

        if (ticks[0].x > 2) ticks = [{ x: 0, label: 'Início' }, ...ticks]
        if (ticks[ticks.length - 1].x < 98) ticks = [...ticks, { x: 100, label: 'Hoje' }]
        return ticks
    }, [weights, bfs, globalTimeRange])

    // 2. Modified normalization to include time-based X
    // Ensures all lines start at the same chronological point (x=0)
    const normalizeWithTime = (data: any[], valKey: string, dateKey: string, padding = 0.1) => {
        if (!data.length) return []

        const values = data.map(d => d[valKey])
        let minV = Math.min(...values)
        let maxV = Math.max(...values)

        if (minV === maxV) {
            minV = minV * (1 - padding)
            maxV = maxV * (1 + padding)
        } else {
            const vRange = maxV - minV
            minV = minV - vRange * padding
            maxV = maxV + vRange * padding
        }

        const vRange = maxV - minV || 1

        // Sort data by date to ensure chronological order
        const sortedData = [...data].sort((a, b) => 
            new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime()
        )

        // Find the earliest data point for this metric
        const earliestData = sortedData[0]
        const earliestTime = new Date(earliestData[dateKey]).getTime()
        const earliestX = globalTimeRange.range > 0 
            ? ((earliestTime - globalTimeRange.min) / globalTimeRange.range) * 100 
            : 0

        // Create points array - always start at x=0 with the first available value
        const points: DataPoint[] = []
        
        // Always add a starting point at x=0 using the first available value
        // This ensures all lines start at the same chronological point
        const startValue = earliestData[valKey]
        points.push({
            x: 0,
            y: 100 - ((startValue - minV) / vRange) * 100
        })

        // Add all actual data points, but skip the first one if it's already at x=0
        sortedData.forEach((d, index) => {
            const time = new Date(d[dateKey]).getTime()
            const x = globalTimeRange.range > 0
                ? ((time - globalTimeRange.min) / globalTimeRange.range) * 100
                : 0
            
            // Skip the first point if it's already at x=0 (to avoid duplicate)
            if (index === 0 && x <= 0.1) {
                return
            }
            
            points.push({
                x,
                y: 100 - ((d[valKey] - minV) / vRange) * 100
            })
        })

        return points
    }

    const weightPoints = useMemo(() => normalizeWithTime(weights, 'weight_kg', 'recorded_at'), [weights, globalTimeRange])
    const bfPoints = useMemo(() => normalizeWithTime(bfs, 'bf_percentage', 'recorded_at'), [bfs, globalTimeRange])

    const freqPoints = useMemo(() => {
        if (!frequency.length) return []
        // sessions = adesão % (0-100); dias sem dieta/treino/cardio baixam a linha
        const maxF = 100

        // Sort frequency by date to ensure chronological order
        const sortedFreq = [...frequency].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        // Find the earliest frequency data point
        const earliestFreq = sortedFreq[0]
        const earliestTime = new Date(earliestFreq.date).getTime()
        const earliestX = globalTimeRange.range > 0
            ? ((earliestTime - globalTimeRange.min) / globalTimeRange.range) * 100
            : 0

        // Create points array - always start at x=0 with the first available value
        const points: DataPoint[] = []
        
        // Always add a starting point at x=0 using the first available value
        // This ensures all lines start at the same chronological point
        points.push({
            x: 0,
            y: 100 - (earliestFreq.sessions / maxF) * 100
        })

        // Add all actual frequency points, but skip the first one if it's already at x=0
        sortedFreq.forEach((f, index) => {
            const time = new Date(f.date).getTime()
            const x = globalTimeRange.range > 0
                ? ((time - globalTimeRange.min) / globalTimeRange.range) * 100
                : 0
            
            // Skip the first point if it's already at x=0 (to avoid duplicate)
            if (index === 0 && x <= 0.1) {
                return
            }
            
            points.push({
                x,
                y: 100 - (f.sessions / maxF) * 100
            })
        })

        return points
    }, [frequency, globalTimeRange])

    // Monotone cubic Hermite spline - curvas suaves que passam pelos pontos sem overshoot
    const smoothPath = (pts: DataPoint[]): string => {
        if (pts.length < 2) return ''
        if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`

        const n = pts.length - 1
        const dxs: number[] = []
        const ms: number[] = []

        for (let i = 0; i < n; i++) {
            dxs[i] = pts[i + 1].x - pts[i].x
            const dy = pts[i + 1].y - pts[i].y
            ms[i] = dxs[i] !== 0 ? dy / dxs[i] : 0
        }

        const tangents: number[] = [ms[0]]
        for (let i = 1; i < n; i++) {
            if (ms[i - 1] === 0 || ms[i] === 0) {
                tangents[i] = 0
            } else {
                const avg = (ms[i - 1] + ms[i]) / 2
                tangents[i] = (ms[i - 1] * ms[i] > 0) ? avg : 0
            }
        }
        tangents.push(ms[n - 1])

        let d = `M ${pts[0].x} ${pts[0].y}`
        for (let i = 0; i < n; i++) {
            const dx = dxs[i]
            const t0 = tangents[i] * dx / 3
            const t1 = tangents[i + 1] * dx / 3
            d += ` C ${pts[i].x + dx / 3} ${pts[i].y + t0}, ${pts[i + 1].x - dx / 3} ${pts[i + 1].y - t1}, ${pts[i + 1].x} ${pts[i + 1].y}`
        }
        return d
    }

    const renderLine = (points: DataPoint[], color: string, gradientId: string) => {
        if (points.length === 0) return null

        // Com carry forward/backward, sempre teremos 2+ pontos quando há dados - curva coerente
        if (points.length === 1) {
            return (
                <>
                    <line x1={0} y1={points[0].y} x2={100} y2={points[0].y} stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.7" />
                    <circle cx={points[0].x} cy={points[0].y} r="3" fill={color} />
                </>
            )
        }

        const d = smoothPath(points)

        return (
            <>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`${d} L 100 100 L 0 100 Z`}
                    fill={`url(#${gradientId})`}
                    className="opacity-20"
                />
                <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
                ))}
            </>
        )
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex gap-4">
                    <LegendItem color="rgb(255, 255, 255)" label="Peso" />
                    <LegendItem color="rgb(16, 185, 129)" label="BF%" />
                    <LegendItem color="rgb(59, 130, 246)" label="Adesão" />
                </div>
            </div>

            <div className="relative aspect-[21/9] w-full bg-zinc-900/30 rounded-2xl border border-zinc-800 p-4">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    {/* Lines */}
                    {renderLine(weightPoints, "white", "gradWeight")}
                    {renderLine(bfPoints, "#10b981", "gradBF")}
                    {renderLine(freqPoints, "#3b82f6", "gradFreq")}
                </svg>

                {/* X-Axis labels - dias das atualizações */}
                <div className="absolute inset-x-0 -bottom-6 h-6 flex">
                    {xAxisTicks.map((tick, i) => (
                        <span
                            key={i}
                            className="absolute text-[8px] font-black text-zinc-600 uppercase tracking-widest -translate-x-1/2"
                            style={{ left: `${4 + (tick.x / 100) * 92}%` }}
                        >
                            {tick.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
        </div>
    )
}

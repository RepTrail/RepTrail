'use client'

import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ChartTooltipRow {
    /** Hex color for the dot indicator */
    color: string
    label: string
    value: string
    /** If true, renders a glow on the dot (used in line charts) */
    glow?: boolean
}

export interface ChartTooltipProps {
    /** Header label (e.g. date, day) */
    title: string
    rows: ChartTooltipRow[]
    /**
     * 'inline' (default) — label: value side by side
     * 'spaced'           — label left, value right (used in line charts)
     */
    layout?: 'inline' | 'spaced'
}

// ── Base Panel ─────────────────────────────────────────────────────────────────

/**
 * ChartTooltip: Shared tooltip panel for all store charts.
 * Renders a glass box with a title and a list of labeled metric rows.
 * Use inside recharts <Tooltip content> or shadcn <TooltipContent>.
 */
export function ChartTooltip({ title, rows, layout = 'inline' }: ChartTooltipProps) {
    return (
        <Box
            bg="zinc"
            bgOpacity={90}
            padding={STORE_TOKENS.SPACING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            style={{ backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
        >
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    {...{
                        color: "zinc-500",
                    }}>
                    {title}
                </Font>

                {layout === 'spaced' && (
                    <Box style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
                )}

                {rows.map((row, i) =>
                    layout === 'spaced' ? (
                        /* ── Line chart style: label left / value right ── */
                        (<Box
                            key={i}
                            display="flex"
                            align="center"
                            style={{ justifyContent: 'space-between', gap: 24 }}
                        >
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Box
                                    width={8}
                                    height={8}
                                    rounded={STORE_TOKENS.RADIUS.FULL}
                                    style={{
                                        backgroundColor: row.color,
                                        flexShrink: 0,
                                        boxShadow: row.glow ? `0 0 10px ${row.color}` : undefined,
                                    }}
                                />
                                <Font
                                    variant="tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-400",
                                    }}>
                                    {row.label}
                                </Font>
                            </Stack>
                            <Font
                                variant="tiny"
                                weight="black"
                                {...{
                                    color: "white",
                                }}>
                                {row.value}
                            </Font>
                        </Box>)
                    ) : (
                        /* ── Status/adherence style: dot + label: value inline ── */
                        (<Stack key={i} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Box
                                width={8}
                                height={8}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                                style={{
                                    backgroundColor: row.color,
                                    flexShrink: 0,
                                    boxShadow: row.glow ? `0 0 10px ${row.color}` : undefined,
                                }}
                            />
                            <Font
                                variant="tiny"
                                weight="bold"
                                {...{
                                    color: "zinc-400",
                                }}>
                                {row.label}:
                            </Font>
                            <Font
                                variant="tiny"
                                weight="black"
                                {...{
                                    color: "white",
                                }}>
                                {row.value}
                            </Font>
                        </Stack>)
                    )
                )}
            </Stack>
        </Box>
    );
}

// ── Recharts Adapter ────────────────────────────────────────────────────────────

interface RechartsChartTooltipProps {
    active?: boolean
    payload?: any[]
    label?: string
    layout?: ChartTooltipProps['layout']
}

/**
 * RechartsChartTooltip: Drop-in replacement for recharts <Tooltip content>.
 * Automatically maps recharts payload to ChartTooltip rows.
 *
 * Usage:
 *   <Tooltip content={<RechartsChartTooltip />} />
 *   <Tooltip content={<RechartsChartTooltip layout="spaced" />} />
 */
export function RechartsChartTooltip({ active, payload, label, layout = 'inline' }: RechartsChartTooltipProps) {
    if (!active || !payload?.length) return null

    const rows: ChartTooltipRow[] = payload
        .filter((entry: any) => entry.value !== null && entry.value !== undefined)
        .map((entry: any) => ({
            color: entry.color ?? '#ffffff',
            label: entry.name ?? entry.dataKey,
            value: `${entry.value}${entry.unit ?? ''}`,
            glow: layout === 'spaced',
        }))

    if (!rows.length) return null

    return <ChartTooltip title={label ?? ''} rows={rows} layout={layout} />
}

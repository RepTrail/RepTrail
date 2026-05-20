'use client'

import * as React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/store/base/tooltip'
import { Activity, Dumbbell, Flame, Utensils, Sparkles } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Box, BoxProps } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ChartTooltip } from '@/components/store/intermediary/chart-tooltip'

/** Hex values for DS semantic colors used in adherence chart dots */
const COLOR_HEX: Record<string, string> = {
    emerald: '#10b981',
    amber:   '#f59e0b',
    red:     '#ef4444',
    blue:    '#3b82f6',
}

interface AdherenceHistoryItem {
    date: string
    diet_percentage: number
    diet_status?: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    workout_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    workout_percentage?: number
    cardio_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    cardio_percentage?: number
    ergogenics_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    ergogenics_percentage?: number
}

interface AdherenceChartProps {
    history: AdherenceHistoryItem[]
    showErgogenics?: boolean
    noCard?: boolean
}

export function UnifiedAdherenceChart({ history, showErgogenics = false, noCard = false }: AdherenceChartProps) {
    const sortedHistory = React.useMemo(() =>
        [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [history])

    const rows = React.useMemo(() => [
        { id: 'workout', label: 'Treino', icon: Dumbbell, color: STORE_TOKENS.COLORS.SUCCESS },
        { id: 'cardio', label: 'Cardio', icon: Flame, color: STORE_TOKENS.COLORS.INFO },
        { id: 'diet', label: 'Dieta', icon: Utensils, color: STORE_TOKENS.COLORS.WARNING },
        ...(showErgogenics ? [{ id: 'ergo', label: 'Ergo', icon: Sparkles, color: STORE_TOKENS.COLORS.ERROR }] : []),
    ], [showErgogenics])

    const getStatusProps = (status: string, percentage?: number): Partial<BoxProps> => {
        if (percentage !== undefined && percentage !== null && status !== 'none' && status !== 'assigned') {
            if (percentage >= 100) return { bg: STORE_TOKENS.COLORS.SUCCESS }
            if (percentage > 0) return { bg: STORE_TOKENS.COLORS.WARNING }
            if (status === 'skipped' || status === 'fail') return { bg: STORE_TOKENS.COLORS.ERROR }
            return { bg: STORE_TOKENS.COLORS.BACKGROUND }
        }
        switch (status) {
            case 'completed': return { bg: STORE_TOKENS.COLORS.SUCCESS }
            case 'partial': return { bg: STORE_TOKENS.COLORS.WARNING }
            case 'skipped': return { bg: STORE_TOKENS.COLORS.ERROR }
            case 'assigned': return { bg: STORE_TOKENS.COLORS.BACKGROUND, bgOpacity: 90, border: true, borderColor: 'zinc', borderOpacity: 50 }
            case 'none': default: return { bg: STORE_TOKENS.COLORS.BACKGROUND, bgOpacity: 100, border: true, borderColor: 'zinc', borderOpacity: 10, opacity: 40 }
        }
    }

    const content = (
        <Stack fullWidth minWidth={0} gap={STORE_TOKENS.SPACING.CONTAINER} padding={noCard ? 0 : { base: 0, md: STORE_TOKENS.PADDING.CONTAINER }}>
            <Box overflowX="auto" width="full" minWidth={0} noScrollbar={true}>
                <Stack fullWidth gap={STORE_TOKENS.SPACING.CONTAINER} minWidth={600}>
                    {rows.map(row => (
                        <Grid key={row.id} cols={12} gap={STORE_TOKENS.SPACING.CONTAINER} align="center" fullWidth>
                            <Stack colSpan={2} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={row.icon} size="sm" color={row.color as any} />
                                <Font variant="tiny" weight="black" uppercase color={`${row.color}-500` as any}>{row.label}</Font>
                            </Stack>
                            
                            <Stack colSpan={10} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} bg={STORE_TOKENS.COLORS.SURFACE} bgOpacity={STORE_TOKENS.OPACITY.HIGH} rounded={STORE_TOKENS.RADIUS.SYSTEM} border={true} borderColor={STORE_TOKENS.COLORS.BACKGROUND} borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} padding={STORE_TOKENS.PADDING.ELEMENT}>
                                {sortedHistory.map((day) => {
                                    let status = 'none'
                                    let percentage = undefined

                                    if (row.id === 'workout') {
                                        status = day.workout_status
                                        percentage = day.workout_percentage
                                    } else if (row.id === 'cardio') {
                                        status = day.cardio_status
                                        percentage = day.cardio_percentage
                                    } else if (row.id === 'ergo') {
                                        status = day.ergogenics_status
                                        percentage = day.ergogenics_percentage
                                    } else if (row.id === 'diet') {
                                        percentage = day.diet_percentage
                                        if (percentage > 0) {
                                            status = percentage >= 100 ? 'completed' : 'partial'
                                        } else {
                                            status = day.diet_status || 'none'
                                        }
                                    }

                                    const boxProps = getStatusProps(status, percentage)
                                    const dateObj = new Date(day.date)
                                    const dateLabel = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

                                    return (
                                        <TooltipProvider key={day.date}>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Box flex1={true} fullHeight={true} minWidth={10} transition={true} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={boxProps.bg} bgOpacity={boxProps.bgOpacity ?? STORE_TOKENS.OPACITY.FULL} border={boxProps.border} borderColor={boxProps.borderColor} borderOpacity={boxProps.borderOpacity} opacity={boxProps.opacity} />
                                                </TooltipTrigger>
                                                <TooltipContent side="top" variant="transparent">
                                                    <ChartTooltip
                                                        title={dateLabel}
                                                        rows={[{
                                                            color: COLOR_HEX[row.color] ?? '#ffffff',
                                                            label: row.label,
                                                            value: row.id === 'diet'
                                                                ? `${percentage || 0}% de adesão`
                                                                : status === 'none' ? 'Folga / Sem Meta'
                                                                : status === 'assigned' ? 'Pendente'
                                                                : status === 'skipped' ? 'Falhou'
                                                                : status === 'partial' ? `Parcial (${percentage || 0}%)`
                                                                : 'Concluído'
                                                        }]}
                                                    />
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                            </Stack>
                        </Grid>
                    ))}
                </Stack>
            </Box>

            <Stack direction="row" wrap="wrap" align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER} opacity={STORE_TOKENS.OPACITY.OVERLAY}>
                <LegendItem color={STORE_TOKENS.COLORS.SUCCESS} label="Meta Batida" />
                <LegendItem color={STORE_TOKENS.COLORS.WARNING} label="Parcial" />
                <LegendItem color={STORE_TOKENS.COLORS.ERROR} label="Não Realizado" />
                <LegendItem color={STORE_TOKENS.COLORS.BACKGROUND} label="Programado" />
            </Stack>
        </Stack>
    )

    if (noCard) return content

    return (
        <GlassPanel>
            <Stack padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={Activity} size="lg" color="primary" className="animate-pulse" />
                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h3" weight="black" color="primary" italic uppercase>Adesão Consolidada</Font>
                        <Font variant="sub-tiny" weight="normal" color={STORE_TOKENS.COLORS.TEXT.MUTED}>(30 Dias)</Font>
                    </Stack>
                </Stack>
                {content}
            </Stack>
        </GlassPanel>
    )
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Box width={8} height={8} rounded={STORE_TOKENS.RADIUS.FULL} bg={color as any} bgOpacity={STORE_TOKENS.OPACITY.FULL} />
            <Font variant="tiny" weight="black" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase>{label}</Font>
        </Stack>
    )
}

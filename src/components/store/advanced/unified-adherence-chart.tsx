'use client'

import * as React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Activity, Dumbbell, Flame, Utensils, Sparkles } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
        { id: 'cardio', label: 'Cardio', icon: Flame, color: STORE_TOKENS.COLORS.WARNING },
        { id: 'diet', label: 'Dieta', icon: Utensils, color: '#3b82f6' },
        ...(showErgogenics ? [{ id: 'ergo', label: 'Ergo', icon: Sparkles, color: STORE_TOKENS.COLORS.WARNING }] : []),
    ], [showErgogenics])

    const getStatusStyles = (status: string, percentage?: number) => {
        if (percentage !== undefined && percentage !== null && status !== 'none' && status !== 'assigned') {
            if (percentage >= 100) return { bg: STORE_TOKENS.COLORS.SUCCESS, shadow: '0 0 10px rgba(16,185,129,0.3)', border: 'none' }
            if (percentage > 0) return { bg: STORE_TOKENS.COLORS.WARNING, shadow: 'none', border: 'none' }
            if (status === 'skipped' || status === 'fail') return { bg: STORE_TOKENS.COLORS.ERROR, shadow: 'none', border: 'none' }
            return { bg: STORE_TOKENS.COLORS.BACKGROUND, shadow: 'none', border: 'none' }
        }
        switch (status) {
            case 'completed': return { bg: STORE_TOKENS.COLORS.SUCCESS, shadow: '0 0 10px rgba(16,185,129,0.3)', border: 'none' }
            case 'partial': return { bg: STORE_TOKENS.COLORS.WARNING, shadow: 'none', border: 'none' }
            case 'skipped': return { bg: STORE_TOKENS.COLORS.ERROR, shadow: 'none', border: 'none' }
            case 'assigned': return { bg: STORE_TOKENS.COLORS.BACKGROUND, shadow: 'none', border: `1px solid ${STORE_TOKENS.COLORS.DIVIDER.STANDARD}` }
            case 'none': default: return { bg: STORE_TOKENS.COLORS.BACKGROUND, shadow: 'none', border: `1px solid ${STORE_TOKENS.COLORS.DIVIDER.STANDARD}`, opacity: 0.4 }
        }
    }

    const content = (
        <Stack fullWidth gap={STORE_TOKENS.SPACING.SECTION} paddingBottom={noCard ? undefined : STORE_TOKENS.SPACING.CONTAINER}>
            <Stack fullWidth gap={STORE_TOKENS.SPACING.ELEMENT} style={{ minWidth: '450px' }}>
                {rows.map(row => (
                    <Grid key={row.id} cols={{ base: '90px 1fr' }} gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={row.icon} size="sm" style={{ color: row.color }} />
                            <Font variant="tiny" weight="black" uppercase color="zinc-500">{row.label}</Font>
                        </Stack>
                        
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} bg="zinc" bgOpacity={30} rounded={STORE_TOKENS.RADIUS.SYSTEM} border={true} borderColor="zinc" borderOpacity={10} style={{ height: '28px', padding: 6 }}>
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

                                const styles = getStatusStyles(status, percentage)
                                const dateObj = new Date(day.date)
                                const dateLabel = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

                                return (
                                    <TooltipProvider key={day.date}>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Box style={{ flex: 1, height: '100%', backgroundColor: styles.bg, boxShadow: styles.shadow, border: styles.border, opacity: styles.opacity || 1, cursor: 'crosshair', transition: 'all 0.2s ease' }} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-white text-[10px] p-3 rounded-system shadow-2xl backdrop-blur-xl">
                                                <div className="space-y-1">
                                                    <p className="font-black text-zinc-500 uppercase tracking-widest">{dateLabel}</p>
                                                    <p className="font-bold text-white italic uppercase">
                                                        {row.id === 'diet'
                                                            ? `${percentage || 0}% de adesão`
                                                            : status === 'none' ? 'Folga / Sem Meta' : status === 'assigned' ? 'Pendente' : status === 'skipped' ? 'Falhou' : status === 'partial' ? `Parcial (${percentage || 0}%)` : 'Concluído'}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })}
                        </Stack>
                    </Grid>
                ))}
            </Stack>

            <Stack direction="row" wrap="wrap" align="center" justify="center" gap={STORE_TOKENS.SPACING.SECTION} style={{ opacity: 0.6, marginTop: '2rem' }}>
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
            <Stack padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER} paddingBottom={STORE_TOKENS.PADDING.CONTAINER}>
                    <Icon icon={Activity} size="lg" color="brand" className="animate-pulse" />
                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h3" weight="black" color="primary" italic uppercase>Adesão Consolidada</Font>
                        <Font variant="sub-tiny" weight="normal" color="zinc-500">(30 Dias)</Font>
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
            <Box width={8} height={8} rounded={STORE_TOKENS.RADIUS.FULL} style={{ backgroundColor: color }} />
            <Font variant="tiny" weight="black" color="zinc-500" uppercase>{label}</Font>
        </Stack>
    )
}

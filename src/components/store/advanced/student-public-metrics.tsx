'use client'

import { PerformanceAnalysisSection } from '@/components/store/advanced/performance-analysis-section'
import { UnifiedAdherenceChart } from '@/components/store/advanced/unified-adherence-chart'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { Target, TrendingUp, Droplet } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { GlassPanel } from '@/components/store/base/surface'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentPublicMetricsProps {
    fullMetrics: any
    adherenceHistory: any[]
    steroidUse: boolean
}

export function StudentPublicMetrics({ fullMetrics, adherenceHistory, steroidUse }: StudentPublicMetricsProps) {
    if (!fullMetrics) return null

    // ── Trend Calculations ─────────────────────────────────────────────────────
    const weights = fullMetrics.weights || []
    const lastWeight = weights[weights.length - 1]?.weight_kg
    const firstWeight = weights[0]?.weight_kg

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const weight30d =
        [...weights].reverse().find((w) => w.recorded_at < thirtyDaysAgoStr)?.weight_kg || firstWeight
    const weightChange30d =
        weight30d && lastWeight ? (lastWeight - weight30d).toFixed(1) : null

    const bfs = fullMetrics.bfs || []
    const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : fullMetrics.details?.body_fat
    const firstBF = bfs.length > 0 ? bfs[0]?.bf_percentage : fullMetrics.details?.body_fat

    const bf30d =
        [...bfs].reverse().find((b) => b.recorded_at < thirtyDaysAgoStr)?.bf_percentage || firstBF
    const bfChange30d =
        bfs.length > 1 && bf30d !== lastBF ? (lastBF - bf30d).toFixed(1) : null

    // ── Adherence Avg (30D) ────────────────────────────────────────────────────
    const last30dAdherence = (adherenceHistory || []).filter(
        (h) =>
            (h.diet_percentage || 0) > 0 ||
            h.workout_status === 'completed' ||
            h.cardio_status === 'completed'
    )
    const avgAdherence =
        last30dAdherence.length > 0
            ? (
                last30dAdherence.reduce((acc: number, h: any) => {
                    const pillars = [
                        h.diet_percentage || 0,
                        h.workout_status === 'completed' ? 100 : 0,
                        h.cardio_status === 'completed' ? 100 : 0,
                        h.ergogenics_status === 'completed' ? 100 : 0,
                    ]
                    return acc + pillars.reduce((a, b) => a + b, 0) / 4
                }, 0) / last30dAdherence.length
            ).toFixed(0)
            : 0

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            {/* ── Stats Cards ─────────────────────────────────────────── */}
            <Grid cols={{ base: 1, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <StatsCard
                    label="Peso Atual"
                    value={lastWeight ? `${lastWeight} kg` : '--'}
                    description={weightChange30d ? `${parseFloat(weightChange30d) > 0 ? '+' : ''}${weightChange30d} kg no último mês` : 'Sem histórico recente'}
                    icon={TrendingUp}
                    {...{
                        color: "primary",
                    }} />
                <StatsCard
                    label="BF (Estimado)"
                    value={lastBF ? `${lastBF} %` : '--'}
                    description={bfChange30d ? `${parseFloat(bfChange30d) > 0 ? '+' : ''}${bfChange30d}% no último mês` : 'Sem histórico recente'}
                    icon={Droplet}
                    {...{
                        color: "primary",
                    }} />
                <StatsCard
                    label="Adesão (30D)"
                    value={`${avgAdherence}%`}
                    description="Média consolidada dos 4 pilares"
                    icon={Target}
                    {...{
                        color: "primary",
                    }} />
            </Grid>
            {/* ── Consistência Section ────────────────────────────────── */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="h3" weight="black" color="primary">Consistência (30D)</Font>
                    <Font variant="body-sm" color="zinc-400">Acompanhamento diário da consistência de treinos, dieta, cardio e ergogênicos nas últimas 4 semanas.</Font>
                </Stack>
                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} minWidth={0}>
                    <Box fullWidth minWidth={0} overflow="hidden">
                        <UnifiedAdherenceChart
                            history={adherenceHistory || []}
                            showErgogenics={steroidUse}
                            noCard={true}
                        />
                    </Box>
                </GlassPanel>
            </Stack>
            {/* ── Evolução Analítica Section ──────────────────────────── */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth minWidth={0}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="h3" weight="black" color="primary">Evolução Analítica</Font>
                    <Font variant="body-sm" color="zinc-400">Histórico estatístico do percentual de gordura corporal, peso e frequência de treinos semanais.</Font>
                </Stack>
                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} overflow="hidden" minWidth={0}>
                    <PerformanceAnalysisSection
                        weights={fullMetrics.weights}
                        bfs={fullMetrics.bfs}
                        frequency={fullMetrics.frequency}
                        trainerTier="elite"
                        isStudentView={true}
                    />
                </GlassPanel>
            </Stack>
        </Stack>
    );
}

'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { GlassPanel } from '@/components/store/base/surface'
import { BodyMetricItem } from '@/components/store/intermediary/body-metric-item'
import { SkinfoldGauge } from '@/components/store/intermediary/skinfold-gauge'
import { TrendingUp, Activity } from 'lucide-react'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentBodyCompositionPanel: Detailed physical assessment dashboard.
 * - Encapsulates physical metrics and skinfold measurements.
 * - Manages the grid-based layout for gauges and metric lists.
 * - Responsibility: Physical assessment domain display logic.
 */
export function StudentBodyCompositionPanel() {
    return (
        <Grid cols={{ base: 1.2, lg: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {/* Card 1: Estado Atual */}
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} variant="glass" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={TrendingUp} size="sm" color={STORE_TOKENS.COLORS.WARNING} />
                        <Stack gap="none">
                            <Font variant="body" weight="black" uppercase italic tracking="widest">
                                ESTADO ATUAL
                            </Font>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                ATUALIZADO EM 10 DE MAIO
                            </Font>
                        </Stack>
                    </Stack>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <BodyMetricItem label="PESO ATUAL" value="85.5" unit="KG" />
                        <Box height="px" fullWidth bg={STORE_TOKENS.COLORS.WHITE} opacity={STORE_TOKENS.OPACITY.LOW} />
                        <BodyMetricItem label="PERCENTUAL DE GORDURA (BF)" value="12.4" unit="%" />
                        <Box height="px" fullWidth bg={STORE_TOKENS.COLORS.WHITE} opacity={STORE_TOKENS.OPACITY.LOW} />
                        <BodyMetricItem
                            label="MASSA MAGRA ESTIMADA"
                            value="75.2"
                            unit="KG"
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <Box height="px" fullWidth bg={STORE_TOKENS.COLORS.WHITE} opacity={STORE_TOKENS.OPACITY.LOW} />
                        <BodyMetricItem
                            label="MASSA GORDA ESTIMADA"
                            value="10.3"
                            unit="KG"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }} />
                    </Stack>
                </Stack>
            </GlassPanel>
            {/* Card 2: Avaliação Física (Skinfolds) */}
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} variant="glass" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Activity} size="sm" color={STORE_TOKENS.COLORS.SUCCESS} />
                        <Stack gap="none">
                            <Font variant="body" weight="black" uppercase italic tracking="widest">
                                ÚLTIMA AVALIAÇÃO
                            </Font>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                PROTOCOLO DE 7 DOBRAS
                            </Font>
                        </Stack>
                    </Stack>

                    <Grid cols={4} gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <SkinfoldGauge
                            label="PEITORAL"
                            value={12}
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <SkinfoldGauge
                            label="ABDOMINAL"
                            value={18}
                            {...{
                                color: STORE_TOKENS.COLORS.WARNING,
                            }} />
                        <SkinfoldGauge
                            label="COXA"
                            value={14}
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <SkinfoldGauge
                            label="TRÍCEPS"
                            value={8}
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <SkinfoldGauge
                            label="SUBESCAP."
                            value={15}
                            {...{
                                color: STORE_TOKENS.COLORS.WARNING,
                            }} />
                        <SkinfoldGauge
                            label="SUPRAIL."
                            value={11}
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <SkinfoldGauge
                            label="AXILAR"
                            value={9}
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }} />
                        <SkinfoldGauge
                            label="MÉDIA"
                            value={12.4}
                            {...{
                                color: STORE_TOKENS.COLORS.WARNING,
                            }} />
                    </Grid>
                </Stack>
            </GlassPanel>
        </Grid>
    );
}

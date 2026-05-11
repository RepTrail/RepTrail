'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { GlassPanel } from '../base/surface'
import { BodyMetricItem } from '../intermediary/body-metric-item'
import { SkinfoldGauge } from '../intermediary/skinfold-gauge'
import { TrendingUp, Activity } from 'lucide-react'
import { Icon } from '../base/icon'

/**
 * BodyCompositionSectionContent: A high-fidelity section for physical assessment data.
 * Faithful to Image 27's two-card layout.
 */
export function BodyCompositionSectionContent() {
    return (
        <Grid cols={{ base: 1, lg: 2 }} gap={5}>
            {/* Card 1: Estado Atual */}
            <GlassPanel padding={5} variant="glass" rounded="system">
                <Stack gap={5}>
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={TrendingUp} size="sm" color="amber" />
                        <Stack gap={0}>
                            <Font variant="body" weight="black" uppercase italic tracking="widest">
                                ESTADO ATUAL
                            </Font>
                            <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase>
                                ATUALIZADO EM 10 DE MAIO
                            </Font>
                        </Stack>
                    </Stack>

                    <Stack gap={2.5}>
                        <BodyMetricItem label="PESO ATUAL" value="85.5" unit="KG" />
                        <Box height="px" fullWidth bg="white" opacity={5} />
                        <BodyMetricItem label="PERCENTUAL DE GORDURA (BF)" value="12.4" unit="%" />
                        <Box height="px" fullWidth bg="white" opacity={5} />
                        <BodyMetricItem label="MASSA MAGRA ESTIMADA" value="75.2" unit="KG" color="emerald" />
                        <Box height="px" fullWidth bg="white" opacity={5} />
                        <BodyMetricItem label="MASSA GORDA ESTIMADA" value="10.3" unit="KG" color="white" />
                    </Stack>
                </Stack>
            </GlassPanel>

            {/* Card 2: Avaliação Física (Skinfolds) */}
            <GlassPanel padding={5} variant="glass" rounded="system">
                <Stack gap={5}>
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={Activity} size="sm" color="emerald" />
                        <Stack gap={0}>
                            <Font variant="body" weight="black" uppercase italic tracking="widest">
                                ÚLTIMA AVALIAÇÃO
                            </Font>
                            <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase>
                                PROTOCOLO DE 7 DOBRAS
                            </Font>
                        </Stack>
                    </Stack>

                    <Grid cols={4} gap={2.5}>
                        <SkinfoldGauge label="PEITORAL" value={12} color="emerald" />
                        <SkinfoldGauge label="ABDOMINAL" value={18} color="amber" />
                        <SkinfoldGauge label="COXA" value={14} color="emerald" />
                        <SkinfoldGauge label="TRÍCEPS" value={8} color="emerald" />
                        <SkinfoldGauge label="SUBESCAP." value={15} color="amber" />
                        <SkinfoldGauge label="SUPRAIL." value={11} color="emerald" />
                        <SkinfoldGauge label="AXILAR" value={9} color="emerald" />
                        <SkinfoldGauge label="MÉDIA" value={12.4} color="amber" />
                    </Grid>
                </Stack>
            </GlassPanel>
        </Grid>
    )
}

'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Swatch } from '../base/swatch'
import { GlassPanel, CardHeader, CardContent } from '../base/surface'
import { RegistrySection } from '../advanced/registry-section'
import { Palette } from 'lucide-react'

export function ColorsSectionContent({ id }: { id?: string }) {
    const brandColors = [
        { name: 'RepTrail Orange', color: 'orange', value: '#FF5733' },
        { name: 'Performance Emerald', color: 'emerald', value: '#10B981' },
        { name: 'Premium Amber', color: 'amber', value: '#F59E0B' },
        { name: 'Danger Red', color: 'red', value: '#EF4444' },
        { name: 'System Blue', color: 'blue', value: '#3B82F6' },
    ] as const

    const systemColors = [
        { name: 'Zinc 950 (Black)', color: 'zinc', opacity: 100, value: '#09090b' },
        { name: 'Zinc 900 (Surface)', color: 'zinc', opacity: 50, value: '#18181b' },
        { name: 'Zinc 800 (Raised)', color: 'zinc', opacity: 30, value: '#27272a' },
        { name: 'White (Glass Base)', color: 'white', opacity: 10, value: '#ffffff' },
    ] as const

    return (
        <RegistrySection 
            id={id}
            title="Paleta de Cores" 
            icon={Palette} 
            subtitle="Cores institucionais e funcionais aplicadas no ecossistema RepTrail."
        >
            <Stack gap={5}>
                {/* Brand Colors with Opacity Variations */}
                <GlassPanel padding={0}>
                    <Stack gap={0}>
                        <CardHeader>
                            <Font variant="label-caps" color="zinc-500">Brand Color Spectrum (100%, 30%, 20%)</Font>
                        </CardHeader>
                        <CardContent padding={5}>
                            <Stack gap={7.5}>
                                {brandColors.map((c) => (
                                    <Grid key={c.color} cols={1} mdCols={3} gap={5} align="center">
                                        {/* 100% Solid */}
                                        <Stack direction="row" align="center" gap={5}>
                                            <Swatch color={c.color} opacity={100} size="md" />
                                            <Stack gap={2.5}>
                                                <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                                <Font variant="sub-tiny" color="zinc-500">Solid (100%)</Font>
                                            </Stack>
                                        </Stack>

                                        {/* 30% Opacity */}
                                        <Stack direction="row" align="center" gap={5}>
                                            <Swatch color={c.color} opacity={30} size="md" />
                                            <Stack gap={2.5}>
                                                <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                                <Font variant="sub-tiny" color="zinc-500">Glass (30%)</Font>
                                            </Stack>
                                        </Stack>

                                        {/* 20% Opacity */}
                                        <Stack direction="row" align="center" gap={5}>
                                            <Swatch color={c.color} opacity={20} size="md" />
                                            <Stack gap={2.5}>
                                                <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                                <Font variant="sub-tiny" color="zinc-500">Subtle (20%)</Font>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Stack>
                        </CardContent>
                    </Stack>
                </GlassPanel>

                {/* Functional System Colors */}
                <GlassPanel padding={0}>
                    <Stack gap={0}>
                        <CardHeader>
                            <Font variant="label-caps" color="zinc-500">System & Background Tokens</Font>
                        </CardHeader>
                        <CardContent padding={5}>
                            <Grid cols={1} mdCols={4} gap={5}>
                                {systemColors.map((c) => (
                                    <Stack key={c.name} gap={2.5}>
                                        <Swatch color={c.color as any} opacity={c.opacity as any} size="full" />
                                        <Stack gap={2.5}>
                                            <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                            <Font variant="sub-tiny" color="zinc-500">{c.value}</Font>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Grid>
                        </CardContent>
                    </Stack>
                </GlassPanel>
            </Stack>
        </RegistrySection>
    )
}

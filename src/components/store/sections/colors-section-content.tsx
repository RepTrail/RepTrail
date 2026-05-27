'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Swatch } from '@/components/store/base/swatch'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Palette } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Brand Colors with Opacity Variations */}
                <GlassPanel padding={STORE_TOKENS.PADDING.NONE}>
                    <Stack gap={STORE_TOKENS.SPACING.NONE}>
                        <CardHeader>
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Brand Color Spectrum (100%, 30%, 20%)</Font>
                        </CardHeader>
                        <CardContent
                            {...{
                                padding: STORE_TOKENS.PADDING.CONTAINER,
                            }}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                {brandColors.map((c) => (
                                    <Grid key={c.color} cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        {/* 100% Solid */}
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Swatch
                                                opacity={STORE_TOKENS.OPACITY.FULL}
                                                size="md"
                                                {...{
                                                    color: c.color,
                                                }} />
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    uppercase
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>{c.name}</Font>
                                                <Font
                                                    variant="sub-tiny"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                    }}>Solid (100%)</Font>
                                            </Stack>
                                        </Stack>

                                        {/* 30% Opacity */}
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Swatch
                                                opacity={STORE_TOKENS.OPACITY.INTERMEDIATE}
                                                size="md"
                                                {...{
                                                    color: c.color,
                                                }} />
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    uppercase
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>{c.name}</Font>
                                                <Font
                                                    variant="sub-tiny"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                    }}>Glass (30%)</Font>
                                            </Stack>
                                        </Stack>

                                        {/* 20% Opacity */}
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Swatch
                                                opacity={STORE_TOKENS.OPACITY.MEDIUM}
                                                size="md"
                                                {...{
                                                    color: c.color,
                                                }} />
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    uppercase
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>{c.name}</Font>
                                                <Font
                                                    variant="sub-tiny"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                    }}>Subtle (20%)</Font>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Stack>
                        </CardContent>
                    </Stack>
                </GlassPanel>

                {/* Functional System Colors */}
                <GlassPanel padding={STORE_TOKENS.PADDING.NONE}>
                    <Stack gap={STORE_TOKENS.SPACING.NONE}>
                        <CardHeader>
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>System & Background Tokens</Font>
                        </CardHeader>
                        <CardContent
                            {...{
                                padding: STORE_TOKENS.PADDING.CONTAINER,
                            }}>
                            <Grid cols={1} mdCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                {systemColors.map((c) => (
                                    <Stack key={c.name} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Swatch
                                            opacity={c.opacity as any}
                                            size="full"
                                            {...{
                                                color: c.color as any,
                                            }} />
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                weight="black"
                                                uppercase
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                }}>{c.name}</Font>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>{c.value}</Font>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Grid>
                        </CardContent>
                    </Stack>
                </GlassPanel>
            </Stack>
        </RegistrySection>
    );
}

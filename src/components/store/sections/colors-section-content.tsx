import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ColorsSectionContent() {
    const brandColors = [
        { name: 'Orange', color: 'orange', hex: '#F97316' },
        { name: 'Emerald', color: 'emerald', hex: '#10B981' },
        { name: 'Amber', color: 'amber', hex: '#F59E0B' },
        { name: 'Red', color: 'red', hex: '#EF4444' },
        { name: 'Blue', color: 'blue', hex: '#3B82F6' },
    ]

    return (
        <Stack gap="section">
            <RegistrySection 
                title="Paleta de Cores & Transparências" 
                icon={Palette} 
                subtitle="O núcleo visual do RepTrail, focado em alta densidade e variações de opacidade para interface."
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
                                            <div className="flex flex-row items-center gap-5">
                                                <div className={cn(
                                                    "w-24 h-12 rounded-[5px] border border-white/10",
                                                    c.color === 'orange' && "bg-orange-500",
                                                    c.color === 'emerald' && "bg-emerald-500",
                                                    c.color === 'amber' && "bg-amber-500",
                                                    c.color === 'red' && "bg-red-500",
                                                    c.color === 'blue' && "bg-blue-500"
                                                )} />
                                                <Stack gap={0}>
                                                    <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                                    <Font variant="sub-tiny" color="zinc-500">Solid (100%)</Font>
                                                </Stack>
                                            </div>

                                            {/* 30% Opacity */}
                                            <div className="flex flex-row items-center gap-5">
                                                <div className={cn(
                                                    "w-24 h-12 rounded-[5px] border",
                                                    c.color === 'orange' && "bg-orange-500/30 border-orange-500/30",
                                                    c.color === 'emerald' && "bg-emerald-500/30 border-emerald-500/30",
                                                    c.color === 'amber' && "bg-amber-500/30 border-amber-500/30",
                                                    c.color === 'red' && "bg-red-500/30 border-red-500/30",
                                                    c.color === 'blue' && "bg-blue-500/30 border-blue-500/30"
                                                )} />
                                                <Stack gap={0}>
                                                    <Font variant="sub-tiny" weight="black" uppercase color={c.color as any}>30% Opaque</Font>
                                                    <Font variant="sub-tiny" color="zinc-600">Surface Overlay</Font>
                                                </Stack>
                                            </div>

                                            {/* 20% Opacity */}
                                            <div className="flex flex-row items-center gap-5">
                                                <div className={cn(
                                                    "w-24 h-12 rounded-[5px] border border-dashed",
                                                    c.color === 'orange' && "bg-orange-500/20 border-orange-500/30",
                                                    c.color === 'emerald' && "bg-emerald-500/20 border-emerald-500/30",
                                                    c.color === 'amber' && "bg-amber-500/20 border-amber-500/30",
                                                    c.color === 'red' && "bg-red-500/20 border-red-500/30",
                                                    c.color === 'blue' && "bg-blue-500/20 border-blue-500/30"
                                                )} />
                                                <Stack gap={0}>
                                                    <Font variant="sub-tiny" weight="black" uppercase color={c.color as any}>20% Opaque</Font>
                                                    <Font variant="sub-tiny" color="zinc-600">Subtle Background</Font>
                                                </Stack>
                                            </div>
                                        </Grid>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Stack>
                    </GlassPanel>

                    {/* Neutral Colors */}
                    <GlassPanel padding={0}>
                        <Stack gap={0}>
                            <CardHeader>
                                <Font variant="label-caps" color="zinc-500">Neutral & Interface</Font>
                            </CardHeader>
                            <CardContent padding={5}>
                                <Grid cols={2} mdCols={4} gap={5}>
                                    {[
                                        { name: 'Zinc 950', color: 'bg-zinc-950', hex: '#09090b' },
                                        { name: 'Zinc 900', color: 'bg-zinc-900', hex: '#18181b' },
                                        { name: 'Zinc 800', color: 'bg-zinc-800', hex: '#27272a' },
                                        { name: 'Zinc 400', color: 'bg-zinc-400', hex: '#a1a1aa' },
                                    ].map((c) => (
                                        <Stack key={c.color} gap={2.5}>
                                            <div className={cn("h-12 rounded-[5px] border border-white/10", c.color)} />
                                            <Stack gap={0}>
                                                <Font variant="sub-tiny" weight="black" uppercase color="white">{c.name}</Font>
                                                <Font variant="sub-tiny" color="zinc-500">{c.hex}</Font>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Stack>
                    </GlassPanel>
                </Stack>
            </RegistrySection>
        </Stack>
    )
}

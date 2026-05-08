import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { GlassPanel, CardHeader, CardContent, ActionSurface } from '@/components/store/base/surface'
import { Logo } from '@/components/store/base/logo'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandingSectionContent() {
    const brands = [
        { label: 'ALUNO', color: 'orange' },
        { label: 'PERSONAL', color: 'emerald' },
        { label: 'AFILIADO', color: 'amber' },
        { label: 'ADMIN', color: 'red' },
    ]

    return (
        <Stack gap="section">
            <RegistrySection 
                title="Logos & Identidade" 
                icon={Zap} 
                subtitle="Diretrizes de marca para as diferentes instâncias do ecossistema RepTrail."
            >
                <GlassPanel padding={0}>
                    <Stack gap={0}>
                        <CardHeader>
                            <Font weight="bold">Logos & Identidade</Font>
                        </CardHeader>
                        <CardContent padding={5}>
                            <Grid cols={1} mdCols={4} gap={5}>
                                {brands.map((brand) => (
                                    <ActionSurface key={brand.label} className="h-48 flex items-center justify-center">
                                        <Stack align="center" gap={5}>
                                            <Logo color={brand.color as any} size="md" />
                                            <div className={cn(
                                                "px-2.5 py-2.5 rounded-full border flex items-center justify-center",
                                                brand.color === 'orange' && "bg-orange-500/10 border-orange-500/30",
                                                brand.color === 'emerald' && "bg-emerald-500/10 border-emerald-500/30",
                                                brand.color === 'amber' && "bg-amber-500/10 border-amber-500/30",
                                                brand.color === 'red' && "bg-red-500/10 border-red-500/30"
                                            )}>
                                                <Font variant="auxiliary" color={brand.color as any} weight="black" italic uppercase nowrap>
                                                    {brand.label}
                                                </Font>
                                            </div>
                                        </Stack>
                                    </ActionSurface>
                                ))}
                            </Grid>
                        </CardContent>
                    </Stack>
                </GlassPanel>
            </RegistrySection>
        </Stack>
    )
}

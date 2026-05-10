import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { GlassPanel, CardHeader, CardContent, Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Logo } from '@/components/store/base/logo'
import { Badge } from '@/components/store/base/badge'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandingSectionContent({ id }: { id?: string }) {
    const brands = [
        { label: 'ALUNO', color: 'orange' },
        { label: 'PERSONAL', color: 'emerald' },
        { label: 'AFILIADO', color: 'amber' },
        { label: 'ADMIN', color: 'red' },
    ] as const

    return (
        <RegistrySection
            id={id}
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
                                <Surface
                                    key={brand.label}
                                    variant="glass"
                                    align="center"
                                    justify="center"
                                    padding={12}
                                    transition
                                    cursor="pointer"
                                    group
                                    hoverBgOpacity={10}
                                    hoverBorder="white/10"
                                    activeScale={95}
                                >
                                    <Stack align="center" gap={5}>
                                        <Box transition groupHoverScale={110}>
                                            <Logo 
                                                color={brand.color as any} 
                                                size="md" 
                                            />
                                        </Box>
                                        <Badge
                                            label={brand.label}
                                            color={brand.color as any}
                                            variant="glass"
                                            rounded="full"
                                        />
                                    </Stack>
                                </Surface>
                            ))}
                        </Grid>
                    </CardContent>
                </Stack>
            </GlassPanel>
        </RegistrySection>
    )
}

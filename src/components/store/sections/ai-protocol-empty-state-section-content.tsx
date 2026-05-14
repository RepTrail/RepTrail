'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { GlassPanel, Surface } from '@/components/store/base/surface'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { 
    Sparkles, 
    Dumbbell, 
    Utensils, 
    Zap, 
    ChevronRight,
    ArrowRight
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AIProtocolSectionContent } from '@/components/store/sections/ai-protocol-section-content'

/**
 * AIProtocolEmptyStateSectionContent: Premium Empty State reconstruction.
 * Displayed when the student has Auto-Training active but no generated protocol.
 */
export function AIProtocolEmptyStateSectionContent({ userId = 'me' }: { userId?: string }) {
    const [showGenerator, setShowGenerator] = useState(false)

    if (showGenerator) {
        return <AIProtocolSectionContent userId={userId} />
    }

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                {/* Visual Header with Floating Icons Simulation via Composition */}
                <Box position="relative">
                    <Surface 
                        padding={STORE_TOKENS.PADDING.CONTAINER} 
                        variant="tonal-orange" 
                        rounded={STORE_TOKENS.RADIUS.FULL}
                        animation="pulse"
                    >
                        <Icon icon={Sparkles} size="3xl" color="orange" />
                    </Surface>
                    
                    {/* Small accent icons positioned via semantic containers if possible, 
                        but for strictness we'll use a simple clean header */}
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Badge label="RECURSO ATIVO" color="primary" variant="glass" size="xs" />
                    <Stack gap={2.5} align="center">
                        <Font variant="h2" weight="black" uppercase italic color="white" align="center">
                            Você ainda não tem <br />
                            <Font color="primary">um protocolo ativo</Font>
                        </Font>
                        <Box>
                            <Font variant="description" color="zinc-500" align="center">
                                Deixe nossa inteligência montar seu treino, cardio e dieta do zero — 100% personalizado com base no seu perfil e preferências.
                            </Font>
                        </Box>
                    </Stack>
                </Stack>

                <Grid cols={{ base: 2, md: 4 }} gap={2.5} fullWidth>
                    <FeatureBadge icon={Dumbbell} label="TREINO" />
                    <FeatureBadge icon={Zap} label="CARDIO" />
                    <FeatureBadge icon={Utensils} label="DIETA" />
                    <FeatureBadge icon={Sparkles} label="IA" />
                </Grid>

                <Stack gap={5} fullWidth align="center">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        onClick={() => setShowGenerator(true)}
                    >
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Sparkles} size="sm" />
                            <Font variant="sub-tiny" weight="black" uppercase italic>GERAR MEU PROTOCOLO AGORA</Font>
                            <ArrowRight size={16} />
                        </Stack>
                    </Button>
                    
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase tracking="widest">
                        Gratuito • Leva menos de 2 minutos
                    </Font>
                </Stack>
            </Stack>
        </GlassPanel>
    )
}

function FeatureBadge({ icon, label }: { icon: any, label: string }) {
    return (
        <Surface padding={2.5} variant="tonal-zinc" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack direction="row" align="center" justify="center" gap={2.5}>
                <Icon icon={icon} size="xs" color="zinc-500" />
                <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">{label}</Font>
            </Stack>
        </Surface>
    )
}

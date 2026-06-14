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
    ArrowRight
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AIProtocolContent } from '@/components/store/advanced/ai-protocol-content'

/**
 * AIProtocolTeaserPanel: Premium teaser for the AI Protocol Generator.
 * - Handles the toggle logic to show the generator.
 * - Encapsulates the visual complexity of the teaser cards and badges.
 * - Responsibility: AI protocol promotion and initial interaction.
 */
export function AIProtocolTeaserPanel({ userId = 'me' }: { userId?: string }) {
    const [showGenerator, setShowGenerator] = useState(false)

    if (showGenerator) {
        return <AIProtocolContent userId={userId} />
    }

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" flex1={true} display="flex" direction="col" justify="center">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" justify="center" flex1={true}>
                {/* Visual Header */}
                <Box position="relative">
                    <Surface 
                        padding={STORE_TOKENS.PADDING.CONTAINER} 
                        variant="tonal-orange" 
                        rounded={STORE_TOKENS.RADIUS.FULL}
                        animation="pulse"
                    >
                        <Icon icon={Sparkles} size="3xl" color={STORE_TOKENS.COLORS.BRAND} />
                    </Surface>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Badge label="RECURSO ATIVO" color={STORE_TOKENS.COLORS.BRAND} variant="glass" size="xs" />
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font
                            variant="h2"
                            weight="black"
                            uppercase
                            italic
                            align="center"
                            {...{
                                color: "white",
                            }}>Você ainda não tem{" "}
                            <Font
                                variant="h2"
                                weight="black"
                                uppercase
                                italic
                                {...{
                                    color: "primary",
                                }}>um protocolo ativo</Font>
                        </Font>
                        <Box>
                            <Font
                                variant="description"
                                align="center"
                                {...{
                                    color: "zinc-500",
                                }}>
                                Deixe nossa inteligência montar seu treino, cardio e dieta do zero — 100% personalizado com base no seu perfil e preferências.
                            </Font>
                        </Box>
                    </Stack>
                </Stack>

                <Grid cols={{ base: 2, md: 4 }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <FeatureBadge icon={Dumbbell} label="TREINO" />
                    <FeatureBadge icon={Zap} label="CARDIO" />
                    <FeatureBadge icon={Utensils} label="DIETA" />
                    <FeatureBadge icon={Sparkles} label="IA" />
                </Grid>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth align="center">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        onClick={() => setShowGenerator(true)}
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Sparkles} size="sm" />
                            <Font variant="sub-tiny" weight="black" uppercase italic>GERAR MEU PROTOCOLO AGORA</Font>
                            <ArrowRight size={16} />
                        </Stack>
                    </Button>
                    
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "zinc-600",
                        }}>
                        Gratuito • Leva menos de 2 minutos
                    </Font>
                </Stack>
            </Stack>
        </GlassPanel>
    );
}

function FeatureBadge({ icon, label }: { icon: any, label: string }) {
    return (
        <Surface padding={STORE_TOKENS.PADDING.ELEMENT} variant="tonal-zinc" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Icon icon={icon} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    tracking="widest"
                    {...{
                        color: "zinc-400",
                    }}>{label}</Font>
            </Stack>
        </Surface>
    );
}

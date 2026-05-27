'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { 
    Sparkles, 
    ChevronRight, 
    Dumbbell, 
    Activity, 
    Zap, 
    Utensils 
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useRouter } from 'next/navigation'
import { AIProtocolSummaryStat } from './ai-protocol-summary-stat'

interface AIProtocolSuccessViewProps {
    summary: {
        workoutsCount: number
        cardiosCount: number
        targetCalories: number
        proteinG: number
    }
}

/**
 * AIProtocolSuccessView: Advanced component displaying the generated protocol summary.
 * Extracted from AIProtocolSectionContent.
 * Preserves exact layout: GlassPanel -> Stack -> Surface/Grid.
 */
export function AIProtocolSuccessView({ summary }: AIProtocolSuccessViewProps) {
    const router = useRouter()

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                <Surface 
                    padding={STORE_TOKENS.PADDING.CONTAINER} 
                    variant="tonal-primary" 
                    rounded={STORE_TOKENS.RADIUS.FULL}
                >
                    <Icon icon={Sparkles} size="lg" color="primary" />
                </Surface>
                <Stack gap="element" align="center">
                    <Font
                        variant="h2"
                        weight="black"
                        uppercase
                        italic
                        {...{
                            color: "white",
                        }}>
                        Protocolo <Font
                        variant="h2"
                        weight="black"
                        uppercase
                        italic
                        {...{
                            color: "primary",
                        }}>Gerado!</Font>
                    </Font>
                    <Font
                        variant="description"
                        align="center"
                        {...{
                            color: "zinc-500",
                        }}>Seu plano personalizado está pronto.</Font>
                </Stack>
                <Grid cols={{ base: 2, md: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    <AIProtocolSummaryStat icon={Dumbbell} value={summary.workoutsCount} label="Treinos" />
                    <AIProtocolSummaryStat icon={Activity} value={summary.cardiosCount} label="Cardios" />
                    <AIProtocolSummaryStat icon={Zap} value={`${summary.targetCalories}`} label="Calorias" />
                    <AIProtocolSummaryStat icon={Utensils} value={`${summary.proteinG}g`} label="Proteína" />
                </Grid>
                <Button variant="primary" size="lg" fullWidth onClick={() => window.location.href = '/dashboard/student'}>
                    VER NO DASHBOARD <ChevronRight size={16} />
                </Button>
            </Stack>
        </GlassPanel>
    );
}

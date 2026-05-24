'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Award, Activity, Zap, Sparkles, Crown } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

type TrainerTier = 'on_demand' | 'start' | 'pro' | 'elite'

interface TrainerProfileGamificationCardProps {
    planTier?: string
    rating?: number
    activeStudents?: number
}

const TIER_CONFIG: Record<
    TrainerTier,
    { icon: typeof Activity; color: 'zinc-500' | 'blue' | 'emerald' | 'amber'; surface: 'tonal-zinc' | 'tonal-blue' | 'tonal-emerald' | 'tonal-amber' }
> = {
    on_demand: { icon: Activity, color: 'zinc-500', surface: 'tonal-zinc' },
    start: { icon: Zap, color: 'blue', surface: 'tonal-blue' },
    pro: { icon: Sparkles, color: 'emerald', surface: 'tonal-emerald' },
    elite: { icon: Crown, color: 'amber', surface: 'tonal-amber' },
}

export function TrainerProfileGamificationCard({
    planTier = 'on_demand',
    rating = 0,
    activeStudents = 0,
}: TrainerProfileGamificationCardProps) {
    const tier = (planTier?.toLowerCase() as TrainerTier) || 'on_demand'
    const config = TIER_CONFIG[tier] || TIER_CONFIG.on_demand
    const TierIcon = config.icon
    const displayRating = rating > 0 ? `${rating} ★` : '0.0'

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={Award} size="sm" color={config.color} />
                    <Font variant="auxiliary" color={config.color} weight="black" uppercase tracking="widest">
                        Gamificação
                    </Font>
                </Stack>

                <Surface variant={config.surface} padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                            Nível
                        </Font>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" uppercase italic>
                                {tier.replace('_', ' ')}
                            </Font>
                            <Icon icon={TierIcon} size="md" color={config.color} />
                        </Stack>
                    </Stack>
                </Surface>

                <Grid cols={2} gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.SURFACE}
                        bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                        border
                        borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                    >
                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase tracking="widest">
                                Avaliação
                            </Font>
                            <Font variant="heading" color={config.color} weight="bold">
                                {displayRating}
                            </Font>
                            {rating <= 0 && (
                                <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="bold" uppercase align="center">
                                    Sem avaliações ainda
                                </Font>
                            )}
                        </Stack>
                    </Box>
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.SURFACE}
                        bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                        border
                        borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                    >
                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase tracking="widest">
                                Alunos
                            </Font>
                            <Font variant="heading" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="bold">
                                {activeStudents}
                            </Font>
                        </Stack>
                    </Box>
                </Grid>
            </Stack>
        </Surface>
    )
}

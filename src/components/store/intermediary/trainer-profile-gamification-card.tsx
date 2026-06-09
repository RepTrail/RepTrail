'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Award, Activity } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

type TrainerTier = 'on_demand'

interface TrainerProfileGamificationCardProps {
    planTier?: string
    rating?: number
    activeStudents?: number
}

const TIER_CONFIG: Record<
    TrainerTier,
    { icon: typeof Activity; color: 'zinc-500'; surface: 'tonal-zinc' }
> = {
    on_demand: { icon: Activity, color: 'zinc-500', surface: 'tonal-zinc' },
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
                    <Font
                        variant="auxiliary"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: config.color,
                        }}>
                        Gamificação
                    </Font>
                </Stack>

                <Surface variant={config.surface} padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="auxiliary"
                            weight="black"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Nível
                        </Font>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="h3"
                                weight="black"
                                uppercase
                                italic
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
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
                            <Font
                                variant="tiny"
                                weight="black"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                Avaliação
                            </Font>
                            <Font
                                variant="heading"
                                weight="bold"
                                {...{
                                    color: config.color,
                                }}>
                                {displayRating}
                            </Font>
                            {rating <= 0 && (
                                <Font
                                    variant="tiny"
                                    weight="bold"
                                    uppercase
                                    align="center"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>
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
                            <Font
                                variant="tiny"
                                weight="black"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                Alunos
                            </Font>
                            <Font
                                variant="heading"
                                weight="bold"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                {activeStudents}
                            </Font>
                        </Stack>
                    </Box>
                </Grid>
            </Stack>
        </Surface>
    );
}

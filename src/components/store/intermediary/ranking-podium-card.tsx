'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { GlassPanel } from '@/components/store/base/surface'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Trophy, Star, MapPin, ArrowRight } from 'lucide-react'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import Link from 'next/link'

interface RankingPodiumCardProps {
    trainer: {
        full_name: string
        avatar_url?: string
        region?: string
        rating?: number
        studentCount: number
        score: number
        trainer_code?: string | null
    }
    rank: number
}

/**
 * RankingPodiumCard: Premium card for the top 3 community members.
 * Refactored without any classNames outside the Base folder.
 */
export function RankingPodiumCard({ trainer, rank }: RankingPodiumCardProps) {
    let avatarVariant: "amber" | "orange" | "zinc" = 'amber'
    if (rank === 1) avatarVariant = 'orange'
    else if (rank === 2) avatarVariant = 'zinc'

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.CONTAINER}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            position="relative"
            overflow="hidden"
            display="flex"
            direction="col"
            gap={STORE_TOKENS.SPACING.CONTAINER}
            fullHeight
        >
            <BackgroundIcon
                icon={Trophy}
                size="100"
                opacity={STORE_TOKENS.OPACITY.SUBTLE}
                groupHoverOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                {...{
                    top: 5,
                    right: 5,
                }} />
            <Stack flex1 align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box position="relative">
                    <BaseAvatar
                        initials={trainer?.full_name.substring(0, 2).toUpperCase()}
                        src={trainer.avatar_url}
                        size="xxl"
                        variant={avatarVariant}
                    />
                    <Box
                        position="absolute"
                        bottom={2.5}
                        right={2.5}
                        zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                    >
                        <Badge 
                            label={`#${rank}`} 
                            variant="solid" 
                            color={rank === 1 ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.BACKGROUND} 
                            size="xs" 
                        />
                    </Box>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" fullWidth>
                    <Box fullWidth overflow="hidden">
                        <Font
                            variant="h3"
                            weight="black"
                            align="center"
                            truncate
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>
                            {trainer?.full_name}
                        </Font>
                    </Box>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={MapPin} size="xs" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                        <Font
                            variant="label-caps"
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {trainer.region || 'BRASIL'}
                        </Font>
                    </Stack>
                    <Badge
                        label={`${Number(trainer.rating || 0).toFixed(1)} Rating`}
                        icon={Star}
                        color={STORE_TOKENS.COLORS.BRAND}
                        size="xs"
                        variant="glass"
                    />
                </Stack>
            </Stack>
            <Stack fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box fullWidth height="px" bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />

                <Grid cols={2} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.NONE}>
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>Alunos</Font>
                        <Font
                            variant="body"
                            weight="black"
                            italic
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>{trainer.studentCount}</Font>
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.NONE} align="end">
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>Impacto</Font>
                        <Font
                            variant="body"
                            weight="black"
                            italic
                            align="right"
                            {...{
                                color: "orange",
                            }}>Score {trainer.score}</Font>
                    </Stack>
                </Grid>

                {trainer.trainer_code ? (
                    <Box width="full">
                        <Link href={`/personal/${trainer.trainer_code}`}>
                            <Button
                                variant="outline-emerald"
                                size="md"
                                fullWidth
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                transition
                                text="Ver Perfil"
                                iconRight={ArrowRight} />
                        </Link>
                    </Box>
                ) : (
                    <Button
                        variant="outline-emerald"
                        size="md"
                        fullWidth
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        transition
                        disabled
                        text="Ver Perfil"
                        iconRight={ArrowRight} />
                )}
            </Stack>
        </GlassPanel>
    );
}

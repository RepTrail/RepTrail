'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import {
    Trash2,
    Edit3,
    Copy,
    Maximize2,
    Calendar,
    Dumbbell
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface WorkoutCardPremiumProps {
    title: string
    description: string
    day: string
    exercisesCount: number
    date: string
    mode?: 'auto' | 'personal'
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
}

/**
 * WorkoutCardPremium: High-fidelity card for training management.
 * Supports 'Auto Treino' (Full Actions) and 'Personal' (View Only) modes.
 * - Restored 'Agendar' for Auto mode as per latest feedback.
 * - Removed CSS darkening hovers in favor of JS glow.
 */
export function WorkoutCardPremium({
    title,
    description,
    day,
    exercisesCount,
    date,
    mode = 'auto',
    color = 'primary'
}: WorkoutCardPremiumProps) {
    const isAuto = mode === 'auto'

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            group
            position="relative"
            overflow="hidden"
        >
            <BackgroundIcon
                icon={Dumbbell}
                size="100"
                top={-10}
                right={-10}
                opacity={STORE_TOKENS.OPACITY.SUBTLE}
                groupHoverOpacity={STORE_TOKENS.OPACITY.SUBTLE}
            />
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                {/* Header Actions - Hidden in Personal Mode */}
                <Stack direction="row" align="center" justify="between">
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.WHITE}
                        bgOpacity={STORE_TOKENS.OPACITY.LOW}
                        cursor="pointer"
                        transition
                    >
                        <Icon icon={Maximize2} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                    </Box>
                    {isAuto && (
                        <Box
                            padding={STORE_TOKENS.PADDING.ELEMENT}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            cursor="pointer"
                            transition
                        >
                            <Icon icon={Trash2} size="xs" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                        </Box>
                    )}
                </Stack>

                {/* Body Content */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                            {title}
                        </Font>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION} color={STORE_TOKENS.COLORS.TEXT.DIM}>
                            {description}
                        </Font>
                    </Stack>

                    <Box>
                        <Badge
                            label={day}
                            variant="glass"
                            color={color}
                            size="xs"
                        />
                    </Box>
                </Stack>

                {/* Meta Info */}
                <Stack direction="row" align="center" justify="between">
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {exercisesCount} EXERCÍCIOS
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {date}
                    </Font>
                </Stack>

                {/* Footer Buttons & Actions */}
                {isAuto && (
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Button variant={color as any} flex1>
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Calendar} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.BLACK}>AGENDAR</Font>
                            </Stack>
                        </Button>
                        <Button variant="outline-zinc" flex1>
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Edit3} size="xs" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} />
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>EDITAR</Font>
                            </Stack>
                        </Button>
                        <Button variant="outline-zinc" isIconOnly size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                            <Icon icon={Copy} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                        </Button>
                    </Stack>
                )}
            </Stack>
        </GlassPanel>
    )
}

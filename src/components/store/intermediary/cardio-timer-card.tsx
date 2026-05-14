'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { cn } from '@/lib/utils'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Activity, Play, Timer, Zap, CheckCircle } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from './empty-state'
import { RegistryActionModal } from '@/components/store/advanced/registry-action-modal'
import { Edit3 } from 'lucide-react'

interface CardioTimerCardProps {
    title: string
    duration: string
    intensity: string
    remainingTime: string
    estimatedBurn: string
    status?: 'not_started' | 'completed' | 'empty'
}

/**
 * CardioTimerCard: Refactored to normal GlassPanel.
 * - All containers (main and sub-cards) now use GlassPanel variant="glass".
 */
export function CardioTimerCard({
    title,
    duration,
    intensity,
    remainingTime,
    estimatedBurn,
    status = 'not_started'
}: CardioTimerCardProps) {

    if (status === 'empty') {
        return (
            <EmptyState
                icon={Activity}
                title={title}
                description="NENHUMA ATIVIDADE DE CARDIO AGENDADA PARA HOJE."
            />
        )
    }

    const isCompleted = status === 'completed'

    return (
        <GlassPanel
            padding={0}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            overflow="hidden"
            variant="glass"
            position="relative"
        >
            <BackgroundIcon
                icon={Activity}
                size="100"
                top={0}
                right={0}
                opacity={STORE_TOKENS.OPACITY.SUBTLE}
                groupHoverOpacity={STORE_TOKENS.OPACITY.MEDIUM}
            />
            <Box padding={STORE_TOKENS.PADDING.CONTAINER} position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'start', lg: 'center' }} justify="between" fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Activity} color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : "orange"} size="sm" />
                            <Font variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {title}
                            </Font>
                        </Stack>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {isCompleted ? (
                                <Badge
                                    label="CONCLUÍDO"
                                    icon={CheckCircle}
                                    variant="glass"
                                    color={STORE_TOKENS.COLORS.SUCCESS}
                                    size="xs"
                                />
                            ) : (
                                <Badge
                                    label={duration}
                                    icon={Timer}
                                    variant="glass"
                                    color={STORE_TOKENS.COLORS.BACKGROUND}
                                    size="xs"
                                />
                            )}
                            <Badge
                                label={intensity}
                                icon={Zap}
                                variant="glass"
                                color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING}
                                size="xs"
                            />
                            
                        </Stack>
                    </Stack>

                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                            {isCompleted ? 'DURAÇÃO TOTAL' : 'TEMPO RESTANTE'}
                        </Font>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h1" color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.TEXT.PRIMARY} align="center">
                            {isCompleted ? duration : remainingTime}
                        </Font>
                    </Stack>

                    <Box
                        width={96}
                        height={96}
                        rounded={STORE_TOKENS.RADIUS.FULL}
                        bg={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : "primary"}
                        bgOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}
                        display="flex"
                        align="center"
                        justify="center"
                        cursor={isCompleted ? "default" : "pointer"}
                        shrink={0}
                        transition
                        hoverBgOpacity={isCompleted ? STORE_TOKENS.OPACITY.INTERMEDIATE : STORE_TOKENS.OPACITY.MEDIUM}
                        border={true}
                        borderColor={isCompleted ? "emerald-500/20" : STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                    >
                        <Icon icon={isCompleted ? CheckCircle : Play} size="lg" color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.BRAND} />
                    </Box>

                    <Grid cols={{ base: 2.5, lg: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" display="flex" direction="col" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING} opacity={80}>QUEIMA EST.</Font>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} align="center">
                                ~{estimatedBurn} KCAL
                            </Font>
                        </GlassPanel>
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" display="flex" direction="col" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING} opacity={80}>INTENSIDADE</Font>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} align="center">
                                {intensity}
                            </Font>
                        </GlassPanel>
                    </Grid>
                </Stack>
            </Box>

        </GlassPanel>
    )
}

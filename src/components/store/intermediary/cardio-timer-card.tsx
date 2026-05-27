'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Activity, Play, Timer, Zap, CheckCircle, Pause, Square } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from './empty-state'

interface CardioTimerCardProps {
    title: string
    duration: string
    intensity: string
    remainingTime: string
    estimatedBurn: string
    status?: 'not_started' | 'completed' | 'empty'
    isRunning?: boolean
    progress?: number
    onAction?: () => void
    onPlay?: () => void
    onPause?: () => void
    onStop?: () => void
}

/**
 * CardioTimerCard: Premium card for cardio activities.
 */
export function CardioTimerCard({
    title,
    duration,
    intensity,
    remainingTime,
    estimatedBurn,
    status = 'not_started',
    isRunning = false,
    progress = 0,
    onAction,
    onPlay,
    onPause,
    onStop
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
            padding={STORE_TOKENS.PADDING.NONE}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            overflow="hidden"
            variant="glass"
            position="relative"
        >
            <BackgroundIcon
                icon={Activity}
                size="100"
                opacity={STORE_TOKENS.OPACITY.SUBTLE}
                groupHoverOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                {...{
                    top: 0,
                    right: 0,
                }} />
            <Box padding={STORE_TOKENS.PADDING.CONTAINER} position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'start', lg: 'center' }} justify="between" fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Activity} color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.BRAND} size="sm" />
                            <Font
                                variant="h4"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
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
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {isCompleted ? 'DURAÇÃO TOTAL' : 'TEMPO RESTANTE'}
                        </Font>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                            variant="h1"
                            align="center"
                            {...{
                                color: isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>
                            {isCompleted ? duration : remainingTime}
                        </Font>
                    </Stack>

                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <Box
                            width={80}
                            height={80}
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            bg={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : isRunning ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.BRAND}
                            bgOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}
                            display="flex"
                            align="center"
                            justify="center"
                            cursor={isCompleted ? "default" : "pointer"}
                            shrink={0}
                            transition
                            hoverBgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                            border={true}
                            borderColor={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : isRunning ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                            onClick={isCompleted ? undefined : isRunning ? onPause : onPlay || onAction}
                        >
                            <Icon icon={isCompleted ? CheckCircle : isRunning ? (remainingTime === "00:00" ? CheckCircle : Pause) : Play} size="lg" color={isCompleted ? STORE_TOKENS.COLORS.SUCCESS : isRunning ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.BRAND} />
                        </Box>

                        {isRunning && (
                            <Box
                                width={60}
                                height={60}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                                bg={STORE_TOKENS.COLORS.ERROR}
                                bgOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}
                                display="flex"
                                align="center"
                                justify="center"
                                cursor="pointer"
                                shrink={0}
                                transition
                                hoverBgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                                border={true}
                                borderColor={STORE_TOKENS.COLORS.ERROR}
                                onClick={onStop}
                            >
                                <Icon icon={Square} size="md" color={STORE_TOKENS.COLORS.ERROR} />
                            </Box>
                        )}
                    </Stack>

                    <Grid cols={{ base: 2, lg: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" display="flex" direction="col" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                opacity={STORE_TOKENS.OPACITY.SHELF}
                                {...{
                                    color: isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING,
                                }}>CALORIAS</Font>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                variant="body"
                                align="center"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                ~{estimatedBurn} KCAL
                            </Font>
                        </GlassPanel>
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" display="flex" direction="col" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                opacity={STORE_TOKENS.OPACITY.SHELF}
                                {...{
                                    color: isCompleted ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING,
                                }}>INTENSIDADE</Font>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                variant="body"
                                align="center"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                {intensity}
                            </Font>
                        </GlassPanel>
                    </Grid>
                </Stack>
            </Box>
        </GlassPanel>
    );
}

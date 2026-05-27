'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Icon } from '@/components/store/base/icon'
import { LucideIcon, CheckCircle, Sparkles, Zap, Eye } from 'lucide-react'
import { RegistryColor } from '@/components/store/advanced/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from './empty-state'
import { WorkoutReviewModal } from '@/components/store/advanced/workout-review-modal'
import { WorkoutExercisesModal } from '@/components/store/advanced/workout-exercises-modal'

interface ProtocolCardProps {
    title: string
    subtitle: string
    icon: LucideIcon
    status?: 'not_started' | 'in_progress' | 'completed' | 'empty'
    statusLabel?: string
    color?: RegistryColor
    actionLabel?: string
    onAction?: () => void
    footer?: string
    variant?: 'large' | 'compact'
    count?: { current: number, total: number }
    logId?: string
    userId?: string
    workoutId?: string
}

export function ProtocolCard({
    title,
    subtitle,
    icon,
    status = 'not_started',
    statusLabel,
    actionLabel = 'Iniciar',
    onAction,
    footer,
    logId,
    userId,
    workoutId
}: ProtocolCardProps) {
    const [isReviewOpen, setIsReviewOpen] = React.useState(false)
    const [isExercisesOpen, setIsExercisesOpen] = React.useState(false)
    
    const isCompleted = status === 'completed'
    const isInProgress = status === 'in_progress'
    const isEmpty = status === 'empty'

    if (isEmpty) {
        return (
            <EmptyState
                icon={icon}
                title={title}
                description={subtitle}
            />
        )
    }

    const handleButtonClick = (e: React.MouseEvent) => {
        if (isCompleted && logId && userId) {
            e.preventDefault()
            e.stopPropagation()
            setIsReviewOpen(true)
        } else if (onAction) {
            onAction()
        }
    }

    const handleViewExercises = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsExercisesOpen(true)
    }

    return (
        <>
            <GlassPanel
                padding={STORE_TOKENS.PADDING.CONTAINER}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                position="relative"
                overflow="hidden"
                transition
                group
                onClick={onAction}
                variant="glass"
            >
                <BackgroundIcon
                    icon={icon}
                    size="100"
                    opacity={STORE_TOKENS.OPACITY.SUBTLE}
                    groupHoverOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                    {...{
                        top: 0,
                        right: 0,
                    }} />

                <Box position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position="relative">
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box>
                                {isCompleted ? (
                                    <Badge
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.SUCCESS}
                                        label={statusLabel || 'MISSÃO CUMPRIDA'}
                                        icon={CheckCircle}
                                        size="sm"
                                    />
                                ) : isInProgress ? (
                                    <Badge
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.WARNING}
                                        label={statusLabel || 'EM ANDAMENTO'}
                                        icon={Zap}
                                        size="sm"
                                    />
                                ) : (
                                    <Badge
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.BRAND}
                                        label={statusLabel || 'PRONTO PARA TREINAR'}
                                        icon={Sparkles}
                                        size="sm"
                                    />
                                )}
                            </Box>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                    variant="h3"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    {title}
                                </Font>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>
                                    {subtitle}
                                </Font>
                            </Stack>
                        </Stack>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Button
                                variant={isCompleted ? 'outline-emerald' : isInProgress ? 'outline-amber' : 'outline-primary'}
                                flex1
                                size="sm"
                                onClick={handleButtonClick}
                            >
                                {isCompleted ? 'REVISAR ANOTAÇÕES' : isInProgress ? 'CONTINUAR TREINO' : actionLabel.toUpperCase()}
                            </Button>

                            <Button
                                variant="outline-zinc"
                                isIconOnly
                                size="sm"
                                onClick={handleViewExercises}
                            >
                                <Icon icon={Eye} size="xs" />
                            </Button>
                        </Stack>

                        {footer && (
                            <Box padding={STORE_TOKENS.PADDING.NONE} border={false}>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>
                                    {footer}
                                </Font>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </GlassPanel>
            {isCompleted && logId && userId && (
                <WorkoutReviewModal 
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    logId={logId}
                    userId={userId}
                />
            )}
            <WorkoutExercisesModal
                isOpen={isExercisesOpen}
                onClose={() => setIsExercisesOpen(false)}
                workoutId={workoutId || (logId ? `mock-${logId}` : 'mock-workout')}
                workoutName={title}
            />
        </>
    );
}

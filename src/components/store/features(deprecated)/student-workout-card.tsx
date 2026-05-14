'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Icon } from '@/components/store/base/icon'
import { LucideIcon, CheckCircle, Sparkles, Zap, Eye, Dumbbell } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { WorkoutReviewModal } from '@/components/store/advanced/workout-review-modal'
import { WorkoutExercisesModal } from '@/components/store/advanced/workout-exercises-modal'

interface StudentWorkoutCardProps {
    title: string
    subtitle: string
    icon?: LucideIcon
    status: 'not_started' | 'in_progress' | 'completed'
    actionLabel?: string
    onAction?: () => void
    logId?: string | null
    userId: string
    workoutId: string
}

export function StudentWorkoutCard({
    title,
    subtitle,
    icon = Dumbbell,
    status,
    actionLabel = 'Iniciar Agora',
    onAction,
    logId,
    userId,
    workoutId
}: StudentWorkoutCardProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [isExercisesOpen, setIsExercisesOpen] = useState(false)
    
    const isCompleted = status === 'completed'
    const isInProgress = status === 'in_progress'

    const handleButtonClick = (e: React.MouseEvent) => {
        if (isCompleted && logId) {
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
                padding={STORE_TOKENS.PADDING.ELEMENT}
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
                    top={0}
                    right={0}
                    opacity={STORE_TOKENS.OPACITY.SUBTLE}
                    groupHoverOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                />

                <Box position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position="relative">
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box>
                                {isCompleted ? (
                                    <Badge
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.SUCCESS}
                                        label="MISSÃO CUMPRIDA"
                                        icon={CheckCircle}
                                        size="sm"
                                    />
                                ) : isInProgress ? (
                                    <Badge
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.WARNING}
                                        label="EM ANDAMENTO"
                                        icon={Zap}
                                        size="sm"
                                    />
                                ) : (
                                    <Badge
                                        variant="glass"
                                        color="orange"
                                        label="PRONTO PARA TREINAR"
                                        icon={Sparkles}
                                        size="sm"
                                    />
                                )}
                            </Box>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                    variant="h3"
                                    color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
                                >
                                    {title}
                                </Font>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                    {subtitle}
                                </Font>
                            </Stack>
                        </Stack>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Button
                                variant={isCompleted ? 'outline-emerald' : isInProgress ? 'outline-amber' : 'outline-emerald'}
                                flex1
                                size="lg"
                                onClick={handleButtonClick}
                            >
                                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm">
                                    {isCompleted ? 'REVISAR ANOTAÇÕES' : isInProgress ? 'CONTINUAR TREINO' : actionLabel.toUpperCase()}
                                </Font>
                            </Button>

                            <Button
                                variant="outline-zinc"
                                isIconOnly
                                size="lg"
                                onClick={handleViewExercises}
                            >
                                <Icon icon={Eye} size="sm" />
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </GlassPanel>

            {isCompleted && logId && (
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
                workoutId={workoutId}
                workoutName={title}
            />
        </>
    )
}

export function WorkoutCardSkeleton() {
    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            height={200}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box width={120} height={24} rounded={STORE_TOKENS.RADIUS.FULL} bg="zinc" bgOpacity={20} />
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box width={200} height={32} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg="zinc" bgOpacity={20} />
                    <Box width={120} height={16} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg="zinc" bgOpacity={10} />
                </Stack>
                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box flex1 height={48} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg="zinc" bgOpacity={20} />
                    <Box width={48} height={48} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg="zinc" bgOpacity={20} />
                </Stack>
            </Stack>
        </GlassPanel>
    )
}

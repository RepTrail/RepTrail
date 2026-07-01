'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Play } from 'lucide-react'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { LinearProgress } from '@/components/store/base/linear-progress'

interface WorkoutExecutionStateProps {
    currentStep: any
    currentExercise: any
    nextSet: any
    progress: number
    totalCompletedSets: number
    totalSteps: number
    isBiSet: boolean
    onAction: () => void
}

export function WorkoutExecutionState({
    currentStep,
    currentExercise,
    nextSet,
    progress,
    totalCompletedSets,
    totalSteps,
    isBiSet,
    onAction
}: WorkoutExecutionStateProps) {
    // Dynamic expected reps based on current set phase
    let expectedReps = '10'
    if (currentStep.phase === 'WARMUP') expectedReps = currentExercise.warmup_reps || '10'
    else if (currentStep.phase === 'FEEDER') expectedReps = currentExercise.feeder_reps || '10'
    else expectedReps = currentExercise.reps || '10'

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} padding={STORE_TOKENS.PADDING.CONTAINER} width="full">
            {/* Progress Section */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Stack direction="row" align="end" justify="between" padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="label-caps"
                            {...{
                                color: "SECONDARY",
                            }}>Progresso Geral</Font>
                        <Font
                            variant="h3"
                            italic
                            uppercase
                            {...{
                                color: "white",
                            }}>
                            {totalCompletedSets} <Font
                            {...{
                                color: "zinc-700",
                            }}>/ {totalSteps}</Font>
                        </Font>
                    </Stack>
                    <Badge label={`${Math.round(progress)}%`} variant="solid" color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />
                </Stack>
                <LinearProgress value={progress} color="success" height={6} />
            </Stack>
            {/* Execution State */}
            <Stack flex1 justify={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} position="relative">
                <BackgroundIcon
                    icon={Play}
                    size="100"
                    opacity={STORE_TOKENS.OPACITY.SUBTLE}
                    {...{
                        top: 0,
                        right: 0,
                    }} />

                {/* Main Exercise Card */}
                <Surface variant="glass" border="standard" rounded={STORE_TOKENS.RADIUS.SYSTEM} padding={STORE_TOKENS.PADDING.CONTAINER} overflow="hidden" position="relative">
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Box width="6px" height="6px" bg={STORE_TOKENS.COLORS.SUCCESS} rounded={STORE_TOKENS.RADIUS.FULL} shrink={0} />
                                <Font
                                    variant="label-caps"
                                    {...{
                                        color: "SECONDARY",
                                    }}>
                                    {isBiSet ? "EXERCÍCIO CONJUGADO" : "EXERCÍCIO ATUAL"}
                                </Font>
                            </Stack>
                            <Font
                                variant="h1"
                                {...{
                                    color: "white",
                                }}>
                                {isBiSet ? "BI-SET ATIVO" : currentStep.exerciseName}
                            </Font>
                        </Stack>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Badge 
                                label={({ WARMUP: 'Aquecimento', FEEDER: 'Feeder Set', WORKING: 'Série de Trabalho' } as any)[currentStep.phase]} 
                                color={({ WARMUP: STORE_TOKENS.COLORS.BRAND, FEEDER: STORE_TOKENS.COLORS.INFO, WORKING: STORE_TOKENS.COLORS.SUCCESS } as any)[currentStep.phase]}
                                variant="solid"
                                size="sm"
                            />
                            <Badge label={`Série ${currentStep.setNumber}`} variant="solid" color={STORE_TOKENS.COLORS.BACKGROUND} size="sm" />
                        </Stack>
                    </Stack>
                </Surface>

                {/* Targets & Stats */}
                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} width="full">
                    <Surface variant="tonal-zinc" flex1 padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Font
                                variant="label-caps"
                                {...{
                                    color: "SECONDARY",
                                }}>Alvo</Font>
                            <Font
                                variant="h3"
                                mono
                                {...{
                                    color: "white",
                                }}>{expectedReps}</Font>
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                {...{
                                    color: "zinc-600",
                                }}>Reps</Font>
                        </Stack>
                    </Surface>
                    <Surface variant="tonal-zinc" flex1 padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Font
                                variant="label-caps"
                                {...{
                                    color: "SECONDARY",
                                }}>Descanso</Font>
                            <Font
                                variant="h3"
                                mono
                                {...{
                                    color: "orange",
                                }}>{currentExercise.rest_seconds}s</Font>
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                {...{
                                    color: "zinc-600",
                                }}>Recuperar</Font>
                        </Stack>
                    </Surface>
                </Stack>
            </Stack>
            {/* Action Area */}
            <Box padding={STORE_TOKENS.PADDING.NONE}>
                <Button
                    variant="emerald"
                    fullWidth
                    size="lg"
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    onClick={onAction}
                    text="Registrar Série"
                    iconRight={Play} />
            </Box>
        </Stack>
    );
}

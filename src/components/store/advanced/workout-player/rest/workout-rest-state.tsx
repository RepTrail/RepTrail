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
import { Coffee, ChevronRight, X, Timer, Play } from 'lucide-react'
import { BackgroundIcon } from '@/components/store/base/background-icon'

interface WorkoutRestStateProps {
    restTimeLeft: number
    nextSet: any
    onSkip: () => void
}

export function WorkoutRestState({
    restTimeLeft,
    nextSet,
    onSkip
}: WorkoutRestStateProps) {
    const minutes = Math.floor(restTimeLeft / 60)
    const seconds = restTimeLeft % 60
    const colorTheme = nextSet?.variant || 'orange'
    const shadowColor = colorTheme === 'orange' ? 'rgba(249, 115, 22, 0.05)' : colorTheme === 'blue' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(16, 185, 129, 0.05)'

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} padding={STORE_TOKENS.PADDING.CONTAINER} flex1 align="center" justify="center" position="relative">
            <BackgroundIcon icon={Play} size="100" opacity={10} top={0} right={0} />

            {/* Top Icon and Badge */}
            <Stack align="center" gap={2.5}>
                <Badge label="Descanso Ativo" variant="glass" color={colorTheme} icon={Timer} animatePulse />
            </Stack>

            {/* Circle Timer */}
            <Box 
                width={220} 
                height={220} 
                rounded="full" 
                bg={colorTheme} 
                bgOpacity={10} 
                border 
                borderColor={colorTheme}
                borderOpacity={20}
                display="flex" 
                align="center" 
                justify="center"
                style={{
                    boxShadow: `0 0 40px ${shadowColor}, inset 0 0 20px rgba(255, 255, 255, 0.02)`,
                    borderWidth: '2px'
                }}
            >
                <Stack align="center" gap={2.5}>
                    <Font variant="display" color={colorTheme}>
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </Font>
                    <Font variant="label-caps" color="SECONDARY">
                        Recuperar
                    </Font>
                </Stack>
            </Box>

            {nextSet && (
                <Box width="full" maxWidth="md">
                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={2.5}>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">A Seguir</Font>
                                <Box flex1 height="px" bg="zinc" bgOpacity={20} />
                            </Stack>
                            <Stack direction="row" align="center" justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant={nextSet.isNewExercise ? 'h2' : 'h3'} weight="black" color={nextSet.variant === 'orange' ? 'orange' : nextSet.variant === 'emerald' ? 'emerald' : 'blue'} uppercase italic tracking="tight">
                                        {nextSet.isNewExercise ? nextSet.exerciseName : `${nextSet.label} ${nextSet.set}`}
                                    </Font>
                                    <Font variant="tiny" color="zinc-500" weight="bold" uppercase>{nextSet.isNewExercise ? "Novo Exercício" : "Próxima Série do Bloco"}</Font>
                                </Stack>
                                <Icon icon={ChevronRight} size="sm" color="zinc-700" />
                            </Stack>
                        </Stack>
                    </Surface>
                </Box>
            )}

            <Box width="full" maxWidth="md">
                <Button variant="outline-zinc" fullWidth onClick={onSkip}>
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={X} size="xs" />
                        <span>Pular Descanso</span>
                    </Stack>
                </Button>
            </Box>
        </Stack>
    )
}

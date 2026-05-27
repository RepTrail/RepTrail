'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CheckCircle, Activity, XCircle, Play } from 'lucide-react'

interface WorkoutFinishedStateProps {
    adherenceStatus: 'success' | 'partial' | 'fail'
    perceivedEffort: string
    feedback: string
    onUpdateAdherence: (status: 'success' | 'partial' | 'fail') => void
    onUpdateEffort: (effort: string) => void
    onUpdateFeedback: (feedback: string) => void
    onFinish: () => void
}

export function WorkoutFinishedState({
    adherenceStatus,
    perceivedEffort,
    feedback,
    onUpdateAdherence,
    onUpdateEffort,
    onUpdateFeedback,
    onFinish
}: WorkoutFinishedStateProps) {
    return (
        <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.CONTAINER} gap={STORE_TOKENS.SPACING.CONTAINER} flex1>
            <Box position="relative">
                <Box position="absolute" pin="inset" bg={STORE_TOKENS.COLORS.SUCCESS} bgOpacity={STORE_TOKENS.OPACITY.MEDIUM} rounded={STORE_TOKENS.RADIUS.FULL} style={{ filter: 'blur(40px)' }} />
                <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.FULL}>
                    <Box>
                        <Icon icon={CheckCircle} size="lg" color={STORE_TOKENS.COLORS.SUCCESS} />
                    </Box>
                </Surface>
            </Box>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                <Font
                    variant="h2"
                    weight="black"
                    italic
                    uppercase
                    tracking="tight"
                    {...{
                        color: "white",
                    }}>Treino Finalizado!</Font>
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    tracking="widest"
                    {...{
                        color: "zinc-500",
                    }}>Como foi o seu desempenho hoje?</Font>
            </Stack>
            <Box width="full" maxWidth="md">
                <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: "zinc-500",
                                }}>Execução</Font>
                            <Grid columns={3} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                {(['success', 'partial', 'fail'] as const).map((status) => (
                                    <Button
                                        key={status}
                                        variant={adherenceStatus === status ? (status === 'success' ? 'emerald' : status === 'partial' ? 'orange' : 'red') : 'ghost'}
                                        onClick={() => onUpdateAdherence(status)}
                                        height="12"
                                        flex1
                                    >
                                        <Icon icon={status === 'success' ? CheckCircle : status === 'partial' ? Activity : XCircle} size="xs" />
                                    </Button>
                                ))}
                            </Grid>
                        </Stack>

                        <Input
                            label="Percepção de Esforço (1-10)"
                            type="number"
                            min="1"
                            max="10"
                            value={perceivedEffort}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateEffort(e.target.value)}
                            textAlign="center"
                            weight="black"
                        />

                        <Input
                            label="Feedback Adicional"
                            placeholder="Como você se sentiu? Alguma dor ou observação?"
                            value={feedback}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateFeedback(e.target.value)}
                        />

                        <Button variant="emerald" fullWidth onClick={onFinish}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body" weight="black" italic uppercase tracking="widest">Finalizar e Registrar</Font>
                                <Icon icon={Play} size="sm" />
                            </Stack>
                        </Button>
                    </Stack>
                </Surface>
            </Box>
        </Stack>
    );
}

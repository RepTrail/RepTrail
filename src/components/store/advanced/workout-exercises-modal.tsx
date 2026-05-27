'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { 
    List,
    Loader2,
    Clock
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { getWorkoutExercises } from '@/actions/workout-actions'

interface SetInfo {
    sets: number
    reps: string
    rest: string
}

interface Exercise {
    id: string
    name: string
    warmup?: SetInfo
    feeder?: SetInfo
    working: SetInfo
    rest_time?: string
}

interface WorkoutExercisesModalProps {
    isOpen: boolean
    onClose: () => void
    workoutId: string | null
    workoutName?: string
}

export function WorkoutExercisesModal({ 
    isOpen, 
    onClose, 
    workoutId,
    workoutName = 'Lista de Exercícios'
}: WorkoutExercisesModalProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [exercises, setExercises] = useState<Exercise[]>([])

    useEffect(() => {
        if (isOpen && workoutId) {
            setIsLoading(true)
            
            // Mock data for Design System preview
            if (workoutId.startsWith('mock-')) {
                setTimeout(() => {
                    setExercises([
                        { 
                            id: '1', 
                            name: 'Supino Reto com Barra', 
                            warmup: { sets: 1, reps: '15', rest: '60s' },
                            feeder: { sets: 1, reps: '10', rest: '60s' },
                            working: { sets: 2, reps: '8-12', rest: '90s' },
                            rest_time: '90s' 
                        },
                        { 
                            id: '2', 
                            name: 'Crucifixo Inclinado', 
                            feeder: { sets: 1, reps: '12', rest: '45s' },
                            working: { sets: 3, reps: '12-15', rest: '60s' },
                            rest_time: '60s' 
                        },
                        { 
                            id: '3', 
                            name: 'Desenvolvimento Arnold', 
                            warmup: { sets: 2, reps: '15', rest: '60s' },
                            working: { sets: 3, reps: '10', rest: '60s' },
                            rest_time: '60s' 
                        },
                        { 
                            id: '4', 
                            name: 'Elevação Lateral', 
                            working: { sets: 4, reps: 'FALHA', rest: '30s' },
                            rest_time: '30s' 
                        },
                        { 
                            id: '5', 
                            name: 'Tríceps Corda', 
                            feeder: { sets: 1, reps: '15', rest: '45s' },
                            working: { sets: 3, reps: '15', rest: '45s' },
                            rest_time: '45s' 
                        },
                    ])
                    setIsLoading(false)
                }, 500)
                return
            }

            getWorkoutExercises(workoutId).then((data: any) => {
                if (data) {
                    setExercises(data)
                }
                setIsLoading(false)
            })
        }
    }, [isOpen, workoutId])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={workoutName}
            subtitle="Estrutura técnica detalhada por série"
            icon={List}
            variant="emerald"
            confirmLabel="Entendido"
            onConfirm={onClose}
            confirmVariant="outline-emerald"
            isLoading={isLoading}
            hideCancel
        >
            {isLoading ? (
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" align="center" justify="center" fullWidth>
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Loader2} size="md" color="emerald" spin />
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            {...{
                                color: "zinc-500",
                            }}>Buscando detalhes técnicos...</Font>
                    </Stack>
                </Box>
            ) : (
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg="zinc" bgOpacity={5} rounded="system">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} divide>
                            {exercises.map((ex, index) => (
                                <Box key={ex.id} padding={STORE_TOKENS.PADDING.ELEMENT}>
                                    <Stack direction="row" align="start" fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
                                        {/* Left Container: Index Circle */}
                                        <Box 
                                            width="10" 
                                            height="10" 
                                            rounded="full" 
                                            bg="emerald" 
                                            bgOpacity={10} 
                                            display="flex" 
                                            align="center" 
                                            justify="center"
                                            shrink={0}
                                        >
                                            <Font
                                                variant="sub-tiny"
                                                weight="black"
                                                {...{
                                                    color: "emerald",
                                                }}>{index + 1}</Font>
                                        </Box>

                                        {/* Right Container: Exercise Info + Inline Badges */}
                                        <Stack flex1 gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font
                                                    variant="body-sm"
                                                    weight="black"
                                                    uppercase
                                                    italic
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>
                                                    {ex.name}
                                                </Font>
                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Icon icon={Clock} size="xs" color="zinc-500" />
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        uppercase
                                                        {...{
                                                            color: "zinc-500",
                                                        }}>
                                                        DESCANSO: {ex.rest_time || '60S'}
                                                    </Font>
                                                </Stack>
                                            </Stack>

                                            <Stack direction="row" wrap="wrap" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                {ex.warmup && (
                                                    <Badge 
                                                        label={`WARM UP: ${ex.warmup.sets}X ${ex.warmup.reps} (${ex.warmup.rest})`} 
                                                        color="blue" 
                                                        variant="glass" 
                                                        size="xs" 
                                                    />
                                                )}
                                                {ex.feeder && (
                                                    <Badge 
                                                        label={`FEEDER: ${ex.feeder.sets}X ${ex.feeder.reps} (${ex.feeder.rest})`} 
                                                        color="orange" 
                                                        variant="glass" 
                                                        size="xs" 
                                                    />
                                                )}
                                                {ex.working && (
                                                    <Badge 
                                                        label={`WORKING: ${ex.working.sets}X ${ex.working.reps} (${ex.working.rest})`} 
                                                        color="emerald" 
                                                        variant="glass" 
                                                        size="xs" 
                                                    />
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            )}
        </Modal>
    );
}

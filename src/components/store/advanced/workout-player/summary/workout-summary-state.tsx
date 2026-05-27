'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CheckCircle } from 'lucide-react'
import { SummarySetRow } from './summary-set-row'

interface WorkoutSummaryStateProps {
    currentExercise: any
    setsToSummary: any[]
    lastSession: any
    summaryInputs: Record<number, { weight: string, reps: string }>
    exerciseNote: string
    onUpdateInput: (index: number, weight: string, reps: string) => void
    onUpdateNote: (note: string) => void
    onSave: () => void
}

export function WorkoutSummaryState({
    currentExercise,
    setsToSummary,
    lastSession,
    summaryInputs,
    exerciseNote,
    onUpdateInput,
    onUpdateNote,
    onSave
}: WorkoutSummaryStateProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} padding={STORE_TOKENS.PADDING.CONTAINER} flex1 width="full">
            {/* Header */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font
                    variant="h3"
                    weight="black"
                    uppercase
                    italic
                    tracking="tight"
                    {...{
                        color: "white",
                    }}>
                    Última Sessão
                </Font>
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    tracking="widest"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                    }}>
                    Preencha os dados das séries realizadas
                </Font>
            </Stack>
            {/* Exercise Name Card */}
            <Surface 
                variant="tonal-zinc" 
                padding={STORE_TOKENS.PADDING.ELEMENT} 
                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                border="standard"
            >
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box 
                        width={10} 
                        height={10} 
                        bg="emerald" 
                        rounded={STORE_TOKENS.RADIUS.FULL} 
                        display="flex" 
                        align="center" 
                        justify="center"
                        style={{ width: '10px', height: '10px' }}
                    >
                        <Icon icon={CheckCircle} size="xs" color="white" />
                    </Box>
                    <Font
                        variant="body"
                        weight="black"
                        uppercase
                        italic
                        tracking="tight"
                        {...{
                            color: "white",
                        }}>
                        {currentExercise.exercise.name}
                    </Font>
                </Stack>
            </Surface>
            {/* List of Sets */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                {setsToSummary.map((set: any, i: number) => {
                    const lastSessionSet = lastSession?.loads?.find((l: any) =>
                        l.exercise_id === set.exerciseId &&
                        l.set_type === set.type &&
                        l.sub_index === set.subIndex
                    )

                    const currentInput = summaryInputs[i] || { weight: '', reps: '' }

                    return (
                        <SummarySetRow
                            key={i}
                            set={set}
                            lastSessionSet={lastSessionSet}
                            initialWeight={currentInput.weight}
                            initialReps={currentInput.reps}
                            onUpdate={(w, r) => onUpdateInput(i, w, r)}
                        />
                    )
                })}
            </Stack>
            {/* Exercise Notes */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    tracking="widest"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                    }}>
                    Observações do Exercício
                </Font>
                <Input
                    placeholder="Ex: Senti um pouco o ombro, reduzir carga na próxima..."
                    value={exerciseNote}
                    onChange={e => onUpdateNote((e.target as HTMLInputElement).value)}
                    color="zinc"
                />
            </Stack>
            {/* Save Button */}
            <Button 
                variant="emerald" 
                fullWidth 
                onClick={onSave}
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="body" weight="black" uppercase italic tracking="widest">
                        Salvar e Continuar
                    </Font>
                    <Icon icon={CheckCircle} size="xs" />
                </Stack>
            </Button>
        </Stack>
    );
}

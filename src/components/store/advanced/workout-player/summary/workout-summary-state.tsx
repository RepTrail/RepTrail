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

interface ExerciseInfo {
    exercise: { name: string }
}

interface SummarySet {
    exerciseId: string
    type: string
    subIndex?: number
    [key: string]: unknown
}

interface LastSession {
    loads?: Array<{ exercise_id: string, set_type: string, sub_index?: number, weight?: number | string, reps?: number | string }>
}

interface WorkoutSummaryStateProps {
    currentExercise: ExerciseInfo
    setsToSummary: SummarySet[]
    lastSession: LastSession | null
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
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} padding={STORE_TOKENS.PADDING.CONTAINER} flex1 width="full" minHeight={0}>

            {/* Exercise Name Card */}
            <Surface
                variant="tonal-zinc"
                padding={STORE_TOKENS.PADDING.ELEMENT}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                border="standard"
                shrink={0}
            >
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box
                        width="10px"
                        height="10px"
                        bg={STORE_TOKENS.COLORS.SUCCESS}
                        rounded={STORE_TOKENS.RADIUS.FULL}
                        display="flex"
                        align="center"
                        justify="center"
                    >
                        <Icon icon={CheckCircle} size="xs" color={STORE_TOKENS.COLORS.WHITE} />
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
            <Box flex1 overflowY="auto" minHeight={0}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {setsToSummary.map((set, i: number) => {
                        const lastSessionSet = lastSession?.loads?.find((l) =>
                            l.exercise_id === set.exerciseId &&
                            l.set_type === set.type &&
                            l.sub_index === set.subIndex
                        )

                        const currentInput = summaryInputs[i] || { weight: '', reps: '' }

                        return (
                            <SummarySetRow
                                key={i}
                                set={set}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                lastSessionSet={lastSessionSet as any}
                                initialWeight={currentInput.weight}
                                initialReps={currentInput.reps}
                                onUpdate={(w, r) => onUpdateInput(i, w, r)}
                            />
                        )
                    })}
                </Stack>
            </Box>
            {/* Exercise Notes */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
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
                    color={STORE_TOKENS.COLORS.BACKGROUND}
                />
            </Stack>
            {/* Save Button */}
            <Button
                variant="emerald"
                fullWidth
                onClick={onSave}
                shrink={0}
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

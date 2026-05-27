'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React, { useState, useTransition } from 'react'
import { FormSelect } from '@/components/store/base/form-select'
import { updateStudentWorkoutDay } from '@/actions/student-workout-schedule-actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'

interface WorkoutDaySelectorProps {
    userId: string
    assignmentId: string
    dayOfWeek: number | null
}

/**
 * WorkoutDaySelector: A modern, design-system-compliant dropdown to schedule student workouts.
 * Uses FormSelect and adheres to the Atomic Design Rules.
 */
export function WorkoutDaySelector({ assignmentId, dayOfWeek }: WorkoutDaySelectorProps) {
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [currentDay, setCurrentDay] = useState(dayOfWeek === null ? 'none' : String(dayOfWeek))

    const options = [
        { label: 'Sem Dia Definido', value: 'none' },
        { label: 'Segunda-feira', value: '1' },
        { label: 'Terça-feira', value: '2' },
        { label: 'Quarta-feira', value: '3' },
        { label: 'Quinta-feira', value: '4' },
        { label: 'Sexta-feira', value: '5' },
        { label: 'Sábado', value: '6' },
        { label: 'Domingo', value: '0' },
    ]

    const handleChange = (val: string) => {
        setCurrentDay(val)
        const targetDay = val === 'none' ? null : parseInt(val)

        startTransition(async () => {
            try {
                await updateStudentWorkoutDay(assignmentId, targetDay)
                toast({
                    title: 'Cronograma atualizado!',
                    description: val === 'none' ? 'Treino definido como sem dia fixo.' : `Treino agendado para ${options.find(o => o.value === val)?.label}.`,
                })
            } catch (err: any) {
                toast({
                    title: 'Falha ao atualizar!',
                    description: err.message || 'Houve um erro ao salvar o novo dia.',
                })
            }
        })
    }

    return (
        <Box width={240}>
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                {isPending && <Icon icon={Loader2} size="xs" color={STORE_TOKENS.COLORS.BRAND} spin />}
                <FormSelect
                    options={options}
                    value={currentDay}
                    onChange={handleChange}
                    placeholder="Agendar Dia"
                />
            </Stack>
        </Box>
    );
}

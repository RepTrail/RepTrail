'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React, { useState } from 'react'
import { FormSelect } from '@/components/store/base/form-select'
import { useToast } from '@/components/store/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { useOptimisticMutation } from '@/lib/dal'
import { useQueryClient } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface WorkoutDaySelectorProps {
    userId: string
    assignmentId: string
    dayOfWeek: number | null
}

/**
 * WorkoutDaySelector: A modern, design-system-compliant dropdown to schedule student workouts.
 * Uses FormSelect and adheres to the Atomic Design Rules.
 */
export function WorkoutDaySelector({ userId, assignmentId, dayOfWeek }: WorkoutDaySelectorProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [currentDay, setCurrentDay] = useState(dayOfWeek === null ? 'none' : String(dayOfWeek))

    const options = [
        { label: 'Sem Dia Definido', value: 'none' },
        { label: 'Segunda-feira', value: '1' },
        { label: 'TerÃ§a-feira', value: '2' },
        { label: 'Quarta-feira', value: '3' },
        { label: 'Quinta-feira', value: '4' },
        { label: 'Sexta-feira', value: '5' },
        { label: 'SÃ¡bado', value: '6' },
        { label: 'Domingo', value: '0' },
    ]

    const { mutate: updateDayMutation, isPending } = useOptimisticMutation({
        actionName: 'update-student-workout-day',
        queryKey: QUERY_KEYS.workouts.all(userId),
        entity: ENTITIES.ASSIGNED_WORKOUT,
        entityId: assignmentId,
        onMutate: (variables: any) => {
            // Optimistic update of the workouts list query
            queryClient.setQueryData(QUERY_KEYS.workouts.all(userId), (old: any) => {
                if (!old) return old;
                return old.map((aw: any) => {
                    if (aw.id === variables.assignmentId) {
                        return { ...aw, day_of_week: variables.dayOfWeek };
                    }
                    return aw;
                });
            });

            toast({
                title: 'Cronograma atualizado!',
                description: variables.dayOfWeek === null 
                    ? 'Treino definido como sem dia fixo.' 
                    : `Treino agendado para ${options.find(o => o.value === String(variables.dayOfWeek))?.label || 'o dia selecionado'}.`,
            });
        },
        onError: (err: any) => {
            toast({
                title: 'Falha ao atualizar!',
                description: err.message || 'Houve um erro ao salvar o novo dia.',
            });
        }
    })

    const handleChange = (val: string) => {
        setCurrentDay(val)
        const targetDay = val === 'none' ? null : parseInt(val)
        updateDayMutation({ assignmentId, dayOfWeek: targetDay })
    }

    return (
        <Box width="240px">
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

'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useToast } from '@/hooks/use-toast'
import { ENTITIES } from '@/lib/outbox-db'

const dayNames = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Segunda-feira' },
    { value: '2', label: 'Terça-feira' },
    { value: '3', label: 'Quarta-feira' },
    { value: '4', label: 'Quinta-feira' },
    { value: '5', label: 'Sexta-feira' },
    { value: '6', label: 'Sábado' },
]

export function WorkoutDaySelector({
    userId,
    assignmentId,
    dayOfWeek,
}: {
    userId: string
    assignmentId: string
    dayOfWeek: number | null
}) {
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.workouts.all(userId),
        actionName: 'update-workout-day',
        entity: ENTITIES.ASSIGNED_WORKOUT,
        entityId: assignmentId,
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
        updateFn: (oldData: any, variables: any) => {
            const list = oldData?.data || oldData || []
            if (!Array.isArray(list)) return oldData
            return {
                ...oldData,
                data: list.map((item: any) =>
                    item.id === assignmentId ? { ...item, day_of_week: variables.day_of_week } : item
                )
            }
        },
        onSuccess: () => {
            toast({ title: 'Dia de treino atualizado!' })
        },
        onError: (err) => {
            toast({ variant: 'destructive', title: 'Erro ao atualizar dia.', description: err.message })
        }
    })

    const value = dayOfWeek === null || dayOfWeek === undefined ? 'none' : String(dayOfWeek)

    return (
        <Select
            value={value}
            onValueChange={(v) => {
                const next = v === 'none' ? null : parseInt(v)
                mutate({
                    id: assignmentId,
                    day_of_week: Number.isNaN(next as any) ? null : next
                })
            }}
        >
            <SelectTrigger className="h-10 w-[170px] bg-zinc-950 border-zinc-800 text-zinc-300">
                <SelectValue placeholder="Escolher dia" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                <SelectItem value="none">Sem agendar</SelectItem>
                {dayNames.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                        {d.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

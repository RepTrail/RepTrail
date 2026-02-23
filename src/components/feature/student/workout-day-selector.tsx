'use client'

import { useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateStudentWorkoutDay } from '@/actions/student-workout-schedule-actions'

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
    assignmentId,
    dayOfWeek,
}: {
    assignmentId: string
    dayOfWeek: number | null
}) {
    const [isPending, startTransition] = useTransition()

    const value = dayOfWeek === null || dayOfWeek === undefined ? 'none' : String(dayOfWeek)

    return (
        <Select
            value={value}
            disabled={isPending}
            onValueChange={(v) => {
                startTransition(async () => {
                    const next = v === 'none' ? null : parseInt(v)
                    await updateStudentWorkoutDay(assignmentId, Number.isNaN(next as any) ? null : next)
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

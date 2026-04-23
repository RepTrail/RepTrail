'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'
import { unassignWorkout } from '@/actions/workout-actions'
import { unassignDiet } from '@/actions/diet-actions'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

interface UnassignButtonProps {
    type: 'workout' | 'diet'
    contentId: string
    studentId: string
    revalidateKey?: any[]
}

export function UnassignButton({ type, contentId, studentId, revalidateKey }: UnassignButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { mutate } = useOptimisticMutation({
        actionName: type === 'workout' ? 'unassign-workout' : 'unassign-diet',
        queryKey: type === 'workout' ? QUERY_KEYS.workouts.assignments(studentId) : QUERY_KEYS.diets.assignments(studentId),
        entity: type === 'workout' ? ENTITIES.ASSIGNED_WORKOUT : ENTITIES.DIET,
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.assignments(studentId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diets.assignments(studentId) })
            if (revalidateKey) {
                queryClient.invalidateQueries({ queryKey: revalidateKey })
            }
            toast({
                title: "Sucesso!",
                description: `${type === 'workout' ? 'Treino' : 'Dieta'} desatribuído com sucesso!`,
            })
        }
    })

    const handleUnassign = () => {
        if (!confirm(`Deseja realmente desatribuir esta ${type === 'workout' ? 'planilha' : 'dieta'}?`)) return
        mutate({ contentId, studentId })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            onClick={handleUnassign}
        >
            <X className="w-4 h-4" />
        </Button>
    )
}

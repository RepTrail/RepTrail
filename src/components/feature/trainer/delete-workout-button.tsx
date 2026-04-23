'use client'

import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteWorkout } from "@/actions/workout-actions"
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { ENTITIES } from '@/lib/outbox-db'

interface DeleteWorkoutButtonProps {
    workoutId: string
}

export function DeleteWorkoutButton({ workoutId }: DeleteWorkoutButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { mutate } = useOptimisticMutation({
        queryKey: ['workouts'],
        actionName: 'delete-workout',
        entity: ENTITIES.WORKOUT,
        entityId: workoutId,
        mutationFn: () => deleteWorkout(workoutId),
        onMutate: () => {
            // Optimistic: remove from all workout lists in cache immediately
            queryClient.setQueriesData({ queryKey: ['workouts'] }, (old: any) => {
                if (!Array.isArray(old)) return old
                return old.filter((w: any) => w.id !== workoutId)
            })
        },
        onError: () => {
            toast({ variant: 'destructive', title: 'Erro ao excluir', description: 'Revertendo...' })
        }
    })

    function handleDelete() {
        if (!confirm('Deseja realmente excluir este treino?')) return
        mutate({ id: workoutId })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}

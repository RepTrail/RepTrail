'use client'

import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteDiet } from "@/actions/diet-actions"
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { ENTITIES } from '@/lib/outbox-db'

interface DeleteDietButtonProps {
    dietId: string
}

export function DeleteDietButton({ dietId }: DeleteDietButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { mutate } = useOptimisticMutation({
        queryKey: ['diets'],
        actionName: 'delete-diet',
        entity: ENTITIES.DIET,
        entityId: dietId,
        mutationFn: () => deleteDiet(dietId),
        onMutate: () => {
            // Optimistic: remove from all diet lists in cache immediately
            queryClient.setQueriesData({ queryKey: ['diets'] }, (old: any) => {
                if (!Array.isArray(old)) return old
                return old.filter((d: any) => d.id !== dietId)
            })
        },
        onError: () => {
            toast({ variant: 'destructive', title: 'Erro ao excluir', description: 'Revertendo...' })
        }
    })

    function handleDelete() {
        if (!confirm('Deseja realmente excluir esta dieta?')) return
        mutate({ id: dietId })
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

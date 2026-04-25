'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { outboxDB, ENTITIES } from '@/lib/outbox-db'
import { nanoid } from 'nanoid'
import { cn } from '@/lib/utils'

interface UnifiedDeleteButtonProps {
    actionType: 'workout' | 'diet' | 'cardio' | 'ergogenic' | 'delete-workout' | 'delete-diet'
    id: string 
    contentId?: string // The actual ID of the diet/workout/cardio (needed for some actions)
    studentId: string 
    relationshipId?: string // Optional for student-owned content
    itemName: string
    queryKey: any[]
    className?: string
}

const ACTION_MAP = {
    workout: 'unassign-workout',
    diet: 'unassign-diet',
    cardio: 'delete-student-cardio',
    ergogenic: 'delete-student-ergogenic',
    'delete-workout': 'delete-workout',
    'delete-diet': 'delete-diet',
    'delete-cardio': 'delete-cardio'
} as const

const ENTITY_MAP = {
    workout: ENTITIES.ASSIGNED_WORKOUT,
    diet: ENTITIES.ASSIGNED_DIET,
    cardio: ENTITIES.CARDIO,
    ergogenic: ENTITIES.ERGOGENIC,
    'delete-workout': ENTITIES.WORKOUT,
    'delete-diet': ENTITIES.DIET,
    'delete-cardio': ENTITIES.CARDIO
} as const

export function UnifiedDeleteButton({ 
    actionType, 
    id, 
    contentId,
    studentId, 
    relationshipId, 
    itemName, 
    queryKey,
    className 
}: UnifiedDeleteButtonProps) {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: { id: string; contentId: string; studentId: string; relationshipId?: string }) => {
            const clientMutationId = nanoid()
            
            // 🚀 ELITE LOCAL-FIRST: Enqueue in Outbox
            await outboxDB.enqueue({
                id: nanoid(),
                clientMutationId,
                clientId: 'trainer-web',
                action: ACTION_MAP[actionType],
                entity: ENTITY_MAP[actionType],
                entityId: relationshipId || studentId,
                payload: {
                    ...payload,
                    clientMutationId
                }
            })

            // Trigger sync immediately
            const { syncEngine } = await import('@/lib/sync-engine')
            syncEngine.trigger()
            
            return { success: true }
        },
        onMutate: async () => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey })

            // Snapshot the previous value
            const previousData = queryClient.getQueryData(queryKey)

            // 🚀 INSTANT UPDATE (Elite UX)
            if (queryKey) {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (Array.isArray(old)) {
                        return old.filter((item: any) => item.id !== id)
                    }
                    return old
                })
            }

            return { previousData }
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData)
            }
            toast({ 
                variant: 'destructive',
                title: 'Erro ao remover',
                description: `Falha ao remover ${itemName}` 
            })
        },
        onSuccess: () => {
            toast({ 
                title: 'Removido com sucesso',
                description: `${itemName} foi removido da lista.` 
            })
        }
    })

    function handleDelete() {
        if (!confirm(`Deseja realmente excluir "${itemName}"? Esta ação não pode ser desfeita.`)) return
        mutate({ id, contentId: contentId || id, studentId, relationshipId })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDelete()
            }}
            disabled={isPending}
            className={cn("h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10", className)}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    )
}

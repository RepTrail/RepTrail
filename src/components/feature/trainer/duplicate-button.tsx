'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { ENTITIES } from '@/lib/outbox-db'

type DuplicateType = 'workout' | 'diet' | 'cardio'

interface DuplicateButtonProps {
    id: string
    type: DuplicateType
    className?: string
}

export function DuplicateButton({ id, type, className }: DuplicateButtonProps) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

    const { mutate } = useOptimisticMutation({
        actionName: type === 'workout' ? 'duplicate-workout' : type === 'diet' ? 'duplicate-diet' : 'duplicate-cardio',
        queryKey: [type === 'workout' ? 'workouts' : type === 'diet' ? 'diets' : 'cardios'],
        entity: type === 'workout' ? ENTITIES.WORKOUT : type === 'diet' ? ENTITIES.DIET : ENTITIES.CARDIO,
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: () => {
            setState('done')
            toast({ title: "Duplicando...", description: "O template está sendo processado." })
            // Invalidate based on type
            const baseKey = type === 'workout' ? 'workouts' : type === 'diet' ? 'diets' : 'cardios'
            queryClient.invalidateQueries({ queryKey: [baseKey] })
            setTimeout(() => setState('idle'), 2000)
        }
    })

    function handleDuplicate(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        mutate({ id })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicate}
            disabled={state === 'done'}
            title="Duplicar template"
            className={cn(`
                h-9 w-9 rounded-xl border transition-all shrink-0
                ${state === 'done'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-500 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400'
                }
            `, className)}
        >
            {state === 'done' && <CheckCheck className="w-3.5 h-3.5" />}
            {state === 'idle' && <Copy className="w-3.5 h-3.5" />}
        </Button>
    )
}

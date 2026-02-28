'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCheck, Loader2 } from 'lucide-react'
import { duplicateWorkout } from '@/actions/workout-actions'
import { duplicateDiet } from '@/actions/diet-actions'
import { duplicateCardio } from '@/actions/cardio-actions'
import { cn } from '@/lib/utils'

type DuplicateType = 'workout' | 'diet' | 'cardio'

interface DuplicateButtonProps {
    id: string
    type: DuplicateType
    className?: string
}

export function DuplicateButton({ id, type, className }: DuplicateButtonProps) {
    const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

    async function handleDuplicate(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setState('loading')

        let res: any
        if (type === 'workout') res = await duplicateWorkout(id)
        else if (type === 'diet') res = await duplicateDiet(id)
        else res = await duplicateCardio(id)

        if (res?.success) {
            setState('done')
            setTimeout(() => setState('idle'), 2000)
        } else {
            setState('idle')
            alert(res?.error || 'Erro ao duplicar')
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicate}
            disabled={state === 'loading'}
            title="Duplicar template"
            className={cn(`
                h-9 w-9 rounded-xl border transition-all shrink-0
                ${state === 'done'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-500 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400'
                }
            `, className)}
        >
            {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {state === 'done' && <CheckCheck className="w-3.5 h-3.5" />}
            {state === 'idle' && <Copy className="w-3.5 h-3.5" />}
        </Button>
    )
}

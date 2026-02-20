'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { toggleErgogenicLog } from '@/actions/ergogenics-actions'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ErgogenicCheckButtonProps {
    studentId: string
    ergogenicId: string
    initialChecked: boolean
}

export function ErgogenicCheckButton({ studentId, ergogenicId, initialChecked }: ErgogenicCheckButtonProps) {
    const [checked, setChecked] = useState(initialChecked)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    async function handleToggle() {
        const newStatus = !checked
        setChecked(newStatus) // Optimistic update
        setLoading(true)

        try {
            const res = await toggleErgogenicLog(studentId, ergogenicId, newStatus)
            if (res.error) throw new Error(res.error)

            toast({
                title: newStatus ? 'Registrado!' : 'Removido',
                description: newStatus ? 'Aplicação registrada com sucesso.' : 'Registro removido.',
                duration: 2000
            })
        } catch (error: any) {
            setChecked(!newStatus) // Revert
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível atualizar o status.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={loading}
            className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border transition-all p-0 shadow-lg active:scale-95 group",
                checked
                    ? "bg-emerald-500 border-emerald-600 text-zinc-950 hover:bg-emerald-400"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/50"
            )}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Check className={cn(
                    "w-6 h-6 transition-all",
                    checked ? "scale-100" : "scale-75 opacity-20 group-hover:opacity-100 group-hover:scale-100"
                )} strokeWidth={3} />
            )}
        </Button>
    )
}

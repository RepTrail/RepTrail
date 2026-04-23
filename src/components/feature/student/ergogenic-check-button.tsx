'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { ENTITIES } from '@/lib/outbox-db'

interface ErgogenicCheckButtonProps {
    studentId: string
    ergogenicId: string
    initialChecked: boolean
}

export function ErgogenicCheckButton({ studentId, ergogenicId, initialChecked }: ErgogenicCheckButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    // ─── LOCAL STATE (prevents double-tap race condition) ────────────────────────
    // Using local state derived from the prop means that the toggle always
    // operates on the CURRENT checked state, not the stale prop value.
    const [checked, setChecked] = useState(initialChecked)

    // ─── MULTI-DEVICE SYNC ────────────────────────────────────────────────────────
    // useState ignores prop changes after initial mount. If another device toggles
    // this ergogenic and realtime updates the parent cache, we must sync here.
    // This effect only runs when the parent's authoritative value genuinely changes.
    useEffect(() => {
        setChecked(initialChecked)
    }, [initialChecked])

    const { mutate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.logs(studentId),
        actionName: 'toggle-ergogenic-log',
        entity: ENTITIES.ERGOGENIC_LOG,
        entityId: ergogenicId,
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
        updateFn: (oldData: any, variables: any) => {
            // Standardize: always work with a flat array
            const logs = Array.isArray(oldData) ? oldData : (oldData?.data || [])
            
            if (variables.status) {
                // Add optimistic log
                const newLog = {
                    id: crypto.randomUUID(),
                    ergogenic_id: ergogenicId,
                    created_at: new Date().toISOString(),
                    _optimistic: true
                }
                return [newLog, ...logs]
            } else {
                // Remove log
                return logs.filter((log: any) => log.ergogenic_id !== ergogenicId)
            }
        },
        onSuccess: (variables) => {
            toast({
                title: variables.status ? 'Registrado!' : 'Removido',
                duration: 2000
            })
        },
        onError: (error) => {
            // ─── ROLLBACK local state on error ───────────────────────────────────
            setChecked(prev => !prev)
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao sincronizar. Mudança revertida.'
            })
        }
    })

    const handleToggle = () => {
        // Toggle local state FIRST (0ms, synchronous)
        const next = !checked
        setChecked(next)

        mutate({
            student_id: studentId,
            ergogenic_id: ergogenicId,
            status: next
        })
    }

    return (
        <Button
            onClick={handleToggle}
            variant="ghost"
            className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border transition-all p-0 shadow-lg active:scale-95 group",
                checked
                    ? "bg-emerald-500 border-emerald-400 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50"
            )}
        >
            <Check className={cn(
                "w-6 h-6 transition-all",
                checked ? "scale-110 opacity-100" : "scale-100 opacity-50 group-hover:opacity-100"
            )} strokeWidth={4} />
        </Button>
    )
}

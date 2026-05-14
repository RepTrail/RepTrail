'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle } from 'lucide-react'
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
            variant="ghost" size="icon"
            className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 aspect-square transition-all duration-200 active:scale-95 group border-0",
                checked
                    ? "bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:text-zinc-950"
                    : "bg-zinc-900 text-zinc-600 hover:bg-zinc-800 hover:text-emerald-500"
            )}
        >
            {checked ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </Button>
    )
}

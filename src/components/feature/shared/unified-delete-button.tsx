'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'
import { useQueryClient, QueryKey } from '@tanstack/react-query'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface UnifiedDeleteButtonProps {
    id: string
    actionType: 'workout' | 'diet' | 'cardio' | 'ergogenic' | 'workout-log' | 'cardio-assignment'
    itemName?: string
    variant?: 'ghost' | 'outline' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    onSuccess?: () => void
    queryKey?: QueryKey
}

// Map actionType to action registry strings
const ACTION_MAP: Record<string, string> = {
    'workout': 'delete-workout',
    'diet': 'delete-student-diet',
    'cardio': 'delete-student-cardio',
    'ergogenic': 'delete-student-ergogenic',
    'cardio-assignment': 'delete-cardio-assignment',
    'workout-log': 'delete-workout-log',
}

export function UnifiedDeleteButton({
    id,
    actionType,
    itemName = 'este item',
    variant = 'ghost',
    size = 'icon',
    className,
    onSuccess,
    queryKey,
    studentId
}: UnifiedDeleteButtonProps & { studentId?: string }) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    // Fallback queryKey from entity type if not provided
    const entityMap: Record<string, string> = {
        'workout': ENTITIES.WORKOUT,
        'diet': ENTITIES.DIET,
        'cardio': ENTITIES.CARDIO,
        'ergogenic': ENTITIES.ERGOGENIC,
        'cardio-assignment': ENTITIES.CARDIO,
        'workout-log': ENTITIES.WORKOUT_LOG
    }
    const resolvedQueryKey: QueryKey = queryKey ?? [entityMap[actionType]]

    const deleteAction = async (payload: { id: string; studentId?: string }) => payload // 🔴 HARD BLOCK: Registry handles the call

    const { mutate, isPending } = useOptimisticMutation({
        queryKey: resolvedQueryKey,
        actionName: ACTION_MAP[actionType],
        entity: entityMap[actionType] as any,
        mutationFn: deleteAction,
        // Optimistic update: remove from cache immediately
        updateFn: (oldData: any, variables: { id: string }) => {
            if (!oldData) return oldData
            if (Array.isArray(oldData)) {
                return oldData.filter((item: any) => item.id !== variables.id)
            }
            return oldData
        },
        onSuccess: () => {
            toast({
                title: "Excluído com sucesso",
                description: `O item "${itemName}" foi removido.`,
            })
            if (onSuccess) onSuccess()
        },
        onError: (err) => {
            // Rollback is handled by useOptimisticMutation for non-network errors
            toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: err.message || "Algo deu errado.",
            })
        },
    })

    function handleDelete() {
        // 🚀 LOCAL-FIRST: close dialog instantly, no await, no spinner
        setOpen(false)
        mutate({ id, studentId })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={cn(
                        "h-9 w-9 bg-zinc-800/60 border-zinc-700/50 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border hover:border-red-400/30 shrink-0",
                        className
                    )}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 rounded-[2.5rem] shadow-2xl p-0 border-white/5 overflow-hidden">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-black italic uppercase tracking-tight text-white text-center">
                            Confirmar Exclusão
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm font-medium text-center leading-relaxed">
                            Você tem certeza que deseja excluir <strong>{itemName}</strong>? <br />Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="grid grid-cols-2 gap-4 w-full mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-black uppercase italic rounded-2xl h-14 tracking-widest text-[10px] shadow-lg shadow-red-900/20"
                        >
                            Sim, Excluir
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

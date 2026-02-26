'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface UnifiedDeleteButtonProps {
    id: string
    actionType: 'workout' | 'diet' | 'cardio' | 'ergogenic' | 'workout-log' | 'cardio-assignment'
    itemName?: string
    variant?: 'ghost' | 'outline' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    onSuccess?: () => void
}

export function UnifiedDeleteButton({
    id,
    actionType,
    itemName = 'este item',
    variant = 'ghost',
    size = 'icon',
    className,
    onSuccess
}: UnifiedDeleteButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    async function handleDelete() {
        setLoading(true)
        try {
            let result;
            
            // Call the appropriate server action based on actionType
            switch (actionType) {
                case 'workout':
                    const { deleteWorkout } = await import('@/actions/workout-actions')
                    result = await deleteWorkout(id)
                    break
                case 'diet':
                    const { deleteStudentDiet } = await import('@/actions/student-content-actions')
                    result = await deleteStudentDiet(id)
                    break
                case 'cardio':
                    const { deleteStudentCardio } = await import('@/actions/student-content-actions')
                    result = await deleteStudentCardio(id)
                    break
                case 'ergogenic':
                    const { deleteStudentErgogenic } = await import('@/actions/student-content-actions')
                    result = await deleteStudentErgogenic(id)
                    break
                case 'cardio-assignment':
                    const { removeCardioAssignment } = await import('@/actions/cardio-actions')
                    result = await removeCardioAssignment(id)
                    break
                case 'workout-log':
                    const { deleteWorkoutLog } = await import('@/actions/log-actions')
                    result = await deleteWorkoutLog(id)
                    break
                default:
                    throw new Error('Invalid action type')
            }
            
            if (result.success || !result.error) {
                setOpen(false)
                toast({
                    title: "Excluído com sucesso",
                    description: `O item "${itemName}" foi removido.`
                })
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao excluir",
                    description: result.error || "Algo deu errado."
                })
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: e.message || "Tente novamente mais tarde."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    disabled={loading}
                    className={className || "text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 rounded-[2.5rem] shadow-2xl p-0 border-white/5 overflow-hidden">
                <div className="p-8 pb-0 flex flex-col items-center">
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
                </div>

                <div className="p-8 pt-10 grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white font-black uppercase italic rounded-2xl h-14 tracking-widest text-[10px] shadow-lg shadow-red-900/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Sim, Excluir
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

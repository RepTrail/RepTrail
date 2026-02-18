'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'
import { unassignWorkout } from '@/actions/workout-actions'
import { unassignDiet } from '@/actions/diet-actions'
import { useToast } from '@/hooks/use-toast'

interface UnassignButtonProps {
    type: 'workout' | 'diet'
    contentId: string
    studentId: string
}

export function UnassignButton({ type, contentId, studentId }: UnassignButtonProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleUnassign = async () => {
        if (!confirm(`Deseja realmente desatribuir esta ${type === 'workout' ? 'planilha' : 'dieta'}?`)) return

        setLoading(true)
        try {
            const res = type === 'workout'
                ? await unassignWorkout(contentId, studentId)
                : await unassignDiet(contentId, studentId)

            if (res.success) {
                toast({
                    title: "Sucesso!",
                    description: `${type === 'workout' ? 'Treino' : 'Dieta'} desatribuído com sucesso!`,
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: res.error || 'Erro ao desatribuir',
                })
            }
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: 'Ocorreu um erro inesperado',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            onClick={handleUnassign}
            disabled={loading}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </Button>
    )
}

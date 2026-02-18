'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { markPaymentAsReceived } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'

interface MarkPaidButtonProps {
    studentId: string
    trainerId: string
    className?: string
}

export function MarkPaidButton({ studentId, trainerId, className }: MarkPaidButtonProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleMarkAsPaid = async () => {
        setLoading(true)
        try {
            const result = await markPaymentAsReceived(studentId, trainerId)
            if (result.success) {
                toast({
                    title: "Pagamento Confirmado!",
                    description: "O status do aluno foi atualizado com sucesso.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao confirmar",
                    description: result.error,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Tente novamente em instantes.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleMarkAsPaid}
            disabled={loading}
            size="sm"
            className={`bg-emerald-500 text-white hover:bg-emerald-400 font-bold rounded-lg h-8 text-[10px] uppercase tracking-widest flex items-center gap-2 ${className}`}
        >
            {loading ? (
                "Processando..."
            ) : (
                <>
                    <Check className="w-3 h-3" /> Já recebi
                </>
            )}
        </Button>
    )
}

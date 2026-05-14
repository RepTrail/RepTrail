'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { markPaymentAsReceived } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

import { Slot } from '@radix-ui/react-slot'

interface MarkPaidButtonProps {
    studentId: string
    trainerId: string
    relationshipId?: string
    className?: string
    asChild?: boolean
    children?: React.ReactNode
}

export function MarkPaidButton({ studentId, trainerId, relationshipId, className, asChild, children }: MarkPaidButtonProps) {
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: relationshipId ? QUERY_KEYS.trainer.studentDetail(relationshipId) : ['trainer', 'students'],
        actionName: 'mark-payment-received',
        entity: ENTITIES.TRAINER_STUDENT,
        entityId: relationshipId || studentId,
        mutationFn: () => markPaymentAsReceived(studentId, trainerId),
        updateFn: (old: any) => {
            if (!old) return old
            const today = new Date().toISOString().split('T')[0]
            return { ...old, last_payment_date: today }
        },
        onSuccess: () => {
            toast({
                title: "Pagamento Confirmado!",
                description: "O status do aluno foi atualizado.",
            })
        },
    })

    const Comp = asChild ? Slot : Button

    return (
        <Comp
            onClick={() => mutate({ studentId, trainerId })}
            className={className}
        >
            {children || (
                <>
                    <Check className="w-3 h-3" /> Já recebi
                </>
            )}
        </Comp>
    )
}


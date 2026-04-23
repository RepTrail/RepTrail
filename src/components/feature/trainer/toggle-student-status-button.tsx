'use client'

import { Button } from '@/components/ui/button'
import { toggleStudentStatus } from '@/actions/trainer-actions'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

export function ToggleStudentStatusButton({
    relationshipId,
    isActive,
    trainerId
}: {
    relationshipId: string,
    isActive: boolean,
    trainerId?: string
}) {
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        actionName: 'toggle-student-status',
        entity: ENTITIES.TRAINER_STUDENT,
        entityId: relationshipId,
        mutationFn: () => toggleStudentStatus(relationshipId, !isActive),
        updateFn: (old: any) => {
            if (!old) return old
            return { ...old, active: !isActive }
        },
        onSuccess: () => {
            toast({
                title: isActive ? 'Aluno Desativado' : 'Aluno Reativado',
                description: isActive ? 'O acesso do aluno foi suspenso.' : 'O acesso do aluno foi restaurado com sucesso.',
            })
        },
        onError: () => {
            toast({
                title: 'Erro Inesperado',
                description: 'Ocorreu um erro ao atualizar o status. Revertendo...',
                variant: 'destructive',
            })
        }
    })

    return (
        <Button
            variant="outline"
            className="flex-1 sm:flex-none border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold h-10 text-xs gap-2 transition-all"
            onClick={() => mutate({ relationshipId, active: !isActive })}
        >
            {isActive ? 'Desativar Aluno' : 'Reativar Aluno'}
        </Button>
    )
}

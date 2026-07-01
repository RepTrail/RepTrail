'use client'


import { Button } from '@/components/store/base/button'
import { Plus } from 'lucide-react'
import { UnifiedCreationDialog } from '@/components/store/advanced/unified-creation-dialog'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface WorkoutActionsProps {
    isAutoTrainingActive: boolean
}

export function WorkoutActions({ isAutoTrainingActive }: WorkoutActionsProps) {
    if (!isAutoTrainingActive) return null

    return (
        <UnifiedCreationDialog
            title="Novo Treino"
            description="Crie um treino para seu plano de auto-training."
            triggerLabel="Criar Manualmente"
            trigger={
                <Button variant="white" fullWidth>
                    <Icon icon={Plus} /> Criar Manualmente
                </Button>
            }
            fields={[
                { name: 'name', label: 'Nome do Treino', placeholder: 'Ex: Hipertrofia A - Peito/Tríceps', required: true },
                { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Instruções gerais, foco do treino, etc.', type: 'textarea' }
            ]}
            actionType="create-student-workout"
            successMessage="Treino criado!"
            footerLabel="Salvar Treino"
        />
    )
}


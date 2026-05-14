'use client'

import { UnifiedCreationDialog } from '@/components/store/features(deprecated)/unified-creation-dialog'

interface WorkoutActionsClientProps {
    isAutoTrainingActive: boolean
}

export function WorkoutActionsClient({ isAutoTrainingActive }: WorkoutActionsClientProps) {
    // Render only on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return null

    if (!isAutoTrainingActive) return null

    return (
        <UnifiedCreationDialog
            title="Novo Treino"
            description="Crie um treino para seu plano de auto-training."
            triggerLabel="Criar Manualmente"
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


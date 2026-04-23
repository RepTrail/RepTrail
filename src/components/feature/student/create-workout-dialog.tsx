'use client'

import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { Plus } from "lucide-react"

export function CreateWorkoutDialog() {
    return (
        <UnifiedCreationDialog
            title="Novo Treino"
            description="Crie um treino para seu plano de auto-training."
            actionType="create-student-workout"
            queryKey={['workouts']}
            triggerLabel="Criar Manualmente"
            trigger={
                <button className="flex items-center justify-center gap-2 h-10 px-4 bg-white text-zinc-900 font-bold rounded-md hover:bg-zinc-200 transition-colors">
                    <Plus className="w-4 h-4" /> Criar Manualmente
                </button>
            }
            fields={[
                {
                    name: 'name',
                    label: 'Nome do Treino',
                    type: 'text',
                    placeholder: 'Ex: Hipertrofia A - Peito/Tríceps',
                    required: true
                },
                {
                    name: 'description',
                    label: 'Descrição (Opcional)',
                    type: 'textarea',
                    placeholder: 'Instruções gerais, foco do treino, etc.'
                }
            ]}
        />
    )
}

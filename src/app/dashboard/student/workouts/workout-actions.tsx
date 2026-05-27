'use client'


import { Button } from '@/components/store/base/button'
import { Plus } from 'lucide-react'
import { UnifiedCreationDialog } from '@/components/store/advanced/unified-creation-dialog'

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
                <Button className="w-full sm:w-auto bg-white text-zinc-900 hover:bg-zinc-200 font-bold uppercase italic tracking-tight rounded-xl h-11 transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" /> Criar Manualmente
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


'use client'

import { UnifiedCreationDialog } from '@/components/store/features(deprecated)/unified-creation-dialog'
import { Plus } from "lucide-react"

export function CreateDietDialog() {
    return (
        <UnifiedCreationDialog
            title="Nova Dieta"
            description="Crie um plano alimentar para seu auto-treino."
            actionType="create-student-diet"
            queryKey={['diets']}
            colorScheme="emerald"
            triggerLabel="Criar Manualmente"
            trigger={
                <button className="flex items-center justify-center gap-2 h-10 px-4 bg-white text-zinc-900 font-bold rounded-system hover:bg-zinc-200 transition-colors">
                    <Plus className="w-4 h-4" /> Criar Manualmente
                </button>
            }
            fields={[
                {
                    name: 'name',
                    label: 'Nome da Dieta',
                    type: 'text',
                    placeholder: 'Ex: Dieta para Secar (Low Carb)',
                    required: true
                },
                {
                    name: 'daysOfWeek',
                    label: 'Dias da Semana',
                    type: 'days',
                    required: true,
                    defaultValue: JSON.stringify([0, 1, 2, 3, 4, 5, 6])
                }
            ]}
        />
    )
}




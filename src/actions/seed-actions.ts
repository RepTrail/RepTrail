'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function seedCommonExercises() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const exercises = [
        'Supino Reto com Barra', 'Supino Inclinado com Halteres', 'Crossover', 'Crucifixo Reto',
        'Peck Deck (Voador)', 'Supino Declinado com Barra', 'Flexão de Braços', 'Puxada Frontal Alta',
        'Remada Curvada com Barra', 'Remada Sentada (Triângulo)', 'Puxada com Triângulo',
        'Remada Unilateral (Serrote)', 'Pull Down', 'Levantamento Terra', 'Desenvolvimento com Halteres',
        'Elevação Lateral', 'Elevação Frontal', 'Encolhimento de Ombros', 'Desenvolvimento Militar',
        'Crucifixo Inverso', 'Agachamento Livre com Barra', 'Leg Press 45', 'Cadeira Extensora',
        'Mesa Flexora', 'Afundo (Passada)', 'Cadeira Adutora', 'Cadeira Abdutora', 'Stiff',
        'Panturrilha Sentado', 'Panturrilha em Pé', 'Rosca Direta com Barra', 'Rosca Alternada com Halteres',
        'Rosca Martelo', 'Rosca Concentrada', 'Rosca Scott', 'Tríceps Pulley', 'Tríceps Corda',
        'Tríceps Testa', 'Tríceps Coice', 'Mergulho (Dips)', 'Abdominal Supra', 'Abdominal Infra',
        'Prancha Isométrica', 'Abdominal Roda', 'Hiperextensão Lombar', 'Hack Squat', 'Cadeira Flexora',
        'Desenvolvimento Máquina', 'Remada Cavalinho', 'Face Pull'
    ]

    try {
        const { error } = await supabase
            .from('exercises')
            .upsert(
                exercises.map(name => ({ name, is_system_default: true })),
                { onConflict: 'name' }
            )

        if (error) throw error

        revalidatePath('/dashboard/trainer/workouts')
        return { success: true, count: exercises.length }
    } catch (e: any) {
        return { error: e.message }
    }
}

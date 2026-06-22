import { actions } from "@/lib/dal"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { notFound } from "next/navigation"
import { TrainerWorkoutBuilderSection } from "@/components/store/sections/trainer-workout-builder-section"

export default async function WorkoutEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [workout, students] = await Promise.all([
        actions.getWorkoutDetails(id),
        actions.getTrainerStudents()
    ])

    if (!workout) {
        notFound()
    }

    return (
        <RegistryMain
            title="EDITAR TREINO"
            subtitle="Personalize este protocolo para o seu aluno."
            icon="Dumbbell"
            contextLabel="Área do Personal"
            showTabs={false}
            showHeader={false}
        >
            <TrainerWorkoutBuilderSection workout={workout} students={students} />
        </RegistryMain>
    )
}

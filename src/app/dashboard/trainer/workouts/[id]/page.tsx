import { getWorkoutDetails } from "@/actions/workout-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { WorkoutBuilderSmart } from "@/components/store/advanced/workout-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { notFound } from "next/navigation"

export default async function WorkoutEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const [workout, students] = await Promise.all([
        getWorkoutDetails(id),
        getTrainerStudents()
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
            <Box fullWidth>
                <WorkoutBuilderSmart 
                    workout={workout as any} 
                    students={students} 
                    contextLabel="ÁREA DO PERSONAL"
                    icon="Dumbbell"
                    contextColor="emerald"
                />
            </Box>
        </RegistryMain>
    )
}

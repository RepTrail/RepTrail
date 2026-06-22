import { actions } from "@/lib/dal"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { notFound } from "next/navigation"
import { TrainerDietBuilderSection } from "@/components/store/sections/trainer-diet-builder-section"

export default async function DietEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [diet, students] = await Promise.all([
        actions.getDietDetails(id),
        actions.getTrainerStudents()
    ])

    if (!diet) {
        notFound()
    }

    return (
        <RegistryMain
            title="EDITAR DIETA"
            subtitle="Personalize este protocolo alimentar para o seu aluno."
            icon="Utensils"
            contextLabel="Área do Personal"
            showTabs={false}
            showHeader={false}
        >
            <TrainerDietBuilderSection diet={diet} students={students} />
        </RegistryMain>
    )
}

import { getDietDetails } from "@/actions/diet-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { DietBuilderSmart } from "@/components/store/advanced/diet-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { notFound } from "next/navigation"

export default async function DietEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const [diet, students] = await Promise.all([
        getDietDetails(id),
        getTrainerStudents()
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
            <Box fullWidth>
                <DietBuilderSmart
                    diet={diet as any}
                    students={students}
                    contextLabel="ÁREA DO PERSONAL"
                    icon="Utensils"
                    contextColor="emerald"
                />
            </Box>
        </RegistryMain>
    )
}

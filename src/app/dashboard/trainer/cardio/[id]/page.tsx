import { getCardioDetails } from '@/actions/cardio-actions'
import { getTrainerStudents } from '@/actions/trainer-actions'
import { CardioBuilderSmart } from "@/components/store/advanced/cardio-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { notFound } from 'next/navigation'

interface Props {
    params: { id: string }
}

export default async function CardioDetailPage({ params }: Props) {
    const { id } = await params
    const [cardio, students] = await Promise.all([
        getCardioDetails(id),
        getTrainerStudents()
    ])

    if (!cardio) notFound()

    return (
        <RegistryMain
            title={cardio.name.toUpperCase()}
            subtitle={cardio.description || "Protocolo de Cardio"}
            icon="Flame"
            contextLabel="Área do Personal"
            showTabs={false}
            showHeader={false}
        >
            <CardioBuilderSmart 
                cardio={cardio}
                students={students}
                backHref="/dashboard/trainer/cardio"
                contextLabel="Área do Personal"
                icon="Flame"
                contextColor="emerald"
            />
        </RegistryMain>
    )
}

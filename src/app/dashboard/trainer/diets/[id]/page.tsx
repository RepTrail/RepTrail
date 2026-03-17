import { DietBuilderClient } from "@/components/feature/trainer/diet-builder-client"
import { getDietDetails } from "@/actions/diet-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
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
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
            <DietBuilderClient diet={diet as any} students={students} />
        </div>
    )
}

import { getDietDetails } from "@/actions/diet-actions"
import { DietBuilder } from "@/components/feature/trainer/diet-builder"
import { notFound } from "next/navigation"

export default async function DietEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const diet = await getDietDetails(id)

    if (!diet) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
            <DietBuilder diet={diet as any} />
        </div>
    )
}

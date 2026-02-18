import { getWorkoutDetails } from "@/actions/workout-actions"
import { WorkoutBuilder } from "@/components/feature/trainer/workout-builder"
import { notFound } from "next/navigation"

export default async function WorkoutEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const workout = await getWorkoutDetails(id)

    if (!workout) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WorkoutBuilder workout={workout as any} />
        </div>
    )
}

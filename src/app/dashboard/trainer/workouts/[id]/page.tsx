import { getWorkoutDetails } from "@/actions/workout-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { WorkoutBuilder } from "@/components/store/features(deprecated)/workout-builder"
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
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8">
            <WorkoutBuilder workout={workout as any} students={students} />
        </div>
    )
}

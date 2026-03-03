import { getWorkoutLogForReview } from '@/actions/log-actions'
import { WorkoutLogReview } from '@/components/feature/student/workout-log-review'
import { notFound } from 'next/navigation'

export default async function WorkoutLogReviewPage({ params }: { params: { logId: string } }) {
    const { logId } = await params

    const log = await getWorkoutLogForReview(logId)

    if (!log) return notFound()

    return (
        <WorkoutLogReview
            logId={log.id}
            workoutName={(log.workout as any)?.name || 'Treino'}
            completedAt={log.completed_at || new Date().toISOString()}
            loads={log.loads as any}
        />
    )
}

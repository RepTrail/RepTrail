import { actions } from '@/lib/dal/server'
import { WorkoutLogReview } from '@/components/store/advanced/student-workout-log-review'
import { notFound } from 'next/navigation'

export default async function WorkoutLogReviewPage({ params }: { params: { logId: string } }) {
    const { logId } = await params

    const log = await actions.getWorkoutLogForReview(logId)

    if (!log) return notFound()

    return (
        <WorkoutLogReview
            logId={log.id}
            userId={log.student_id}
            workoutName={(log.workout as any)?.name || 'Treino'}
            completedAt={log.completed_at || new Date().toISOString()}
            loads={log.loads as any}
        />
    )
}

import {
    getStudentRelationship,
    getTrainerProfile
} from '@/actions/trainer-actions'
import { getStudentWorkoutHistory, getStudentRecentActivities } from '@/actions/log-actions'
import { getStudentMetricsHistory, getStudentChartData } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { getAssignedErgogenics } from '@/actions/ergogenics-actions'
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentDetailClient } from '@/components/store/features(deprecated)/student-detail-client'

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── PARALLEL PREFETCHING (0ms Nav) ─────────────────────────────
    // Start with basic relationship to get studentId
    const relationship = await getStudentRelationship(id)
    const studentId = relationship?.student_id

    const prefetchPromises = [
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentDetail(id),
            queryFn: () => relationship // Reuse the already fetched data
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.profile.detail(user.id),
            queryFn: () => getTrainerProfile()
        })
    ]

    if (studentId) {
        prefetchPromises.push(
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentHistory(studentId),
                queryFn: () => getStudentWorkoutHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentMetrics(studentId),
                queryFn: () => getStudentMetricsHistory(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
                queryFn: () => getStudentAdherenceHistory(studentId, 30)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.trainer.studentChartData(studentId),
                queryFn: () => getStudentChartData(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: ['student-recent-activities', studentId],
                queryFn: () => getStudentRecentActivities(studentId, 50)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.cardio.assignments(studentId),
                queryFn: () => getStudentCardioAssignments(studentId)
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.ergogenics.all(studentId),
                queryFn: () => getAssignedErgogenics(studentId)
            })
        )
    }

    // Await everything before dehydration to ensure the client has the data
    await Promise.all(prefetchPromises)

    return (
        <div className=" mx-auto" suppressHydrationWarning>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentDetailClient relationshipId={id} userId={user.id} />
            </HydrationBoundary>
        </div>
    )
}

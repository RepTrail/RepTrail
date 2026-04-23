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
import { StudentDetailClient } from '@/components/feature/trainer/student-detail-client'

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    // Start by getting basic relationship (needed for studentId)
    // Actually, in a high-speed system, we should prefetch everything in parallel.
    // If we don't have studentId yet, we prefetch based on relationshipId.
    
    queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(id),
        queryFn: () => getStudentRelationship(id)
    })

    // We fetch a minimal version to get the studentId for further prefetches
    const relationship = await getStudentRelationship(id)
    const studentId = relationship?.student_id

    if (studentId) {
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentHistory(studentId),
            queryFn: () => getStudentWorkoutHistory(studentId)
        })
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentMetrics(studentId),
            queryFn: () => getStudentMetricsHistory(studentId)
        })
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
            queryFn: () => getStudentAdherenceHistory(studentId, 30)
        })
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentChartData(studentId),
            queryFn: () => getStudentChartData(studentId)
        })
        queryClient.prefetchQuery({
            queryKey: ['student-recent-activities', studentId],
            queryFn: () => getStudentRecentActivities(studentId, 50)
        })
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.assignments(studentId),
            queryFn: () => getStudentCardioAssignments(studentId)
        })
        queryClient.prefetchQuery({
            queryKey: ['student-ergogenics', studentId],
            queryFn: () => getAssignedErgogenics(studentId)
        })
    }

    queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.profile.detail(user.id),
        queryFn: () => getTrainerProfile()
    })

    return (
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentDetailClient relationshipId={id} userId={user.id} />
            </HydrationBoundary>
        </div>
    )
}

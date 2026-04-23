import { getWorkoutDetails } from "@/actions/workout-actions"
import { notFound } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentWorkoutDetailClient } from "@/components/feature/student/workout-detail-client"

export default async function StudentWorkoutPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return notFound()

    const queryClient = getQueryClient()

    // 1. Prefetch Workout Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workouts.detail(id),
        queryFn: () => getWorkoutDetails(id)
    })

    const workout = queryClient.getQueryData(QUERY_KEYS.workouts.detail(id))
    if (!workout) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8">
                <StudentWorkoutDetailClient 
                    workoutId={id} 
                    userId={user.id} 
                    initialData={workout} 
                />
            </div>
        </HydrationBoundary>
    )
}

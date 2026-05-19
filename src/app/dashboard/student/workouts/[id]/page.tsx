import { getWorkoutDetails } from "@/actions/workout-actions"
import { notFound } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentWorkoutDetailClient } from "@/components/store/features(deprecated)/student-workout-detail-client"
import { RegistryMain } from "@/components/store/advanced/registry-main"

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

    const workout = queryClient.getQueryData(QUERY_KEYS.workouts.detail(id)) as any
    if (!workout) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title={workout.name.toUpperCase()}
                subtitle={workout.description || "Importado via PDF"}
                icon="Dumbbell"
                contextLabel="Treinos & Performance"
                showTabs={false}
            >
                <StudentWorkoutDetailClient 
                    workoutId={id} 
                    userId={user.id} 
                    initialData={workout} 
                />
            </RegistryMain>
        </HydrationBoundary>
    )
}

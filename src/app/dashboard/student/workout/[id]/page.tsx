import { createClient } from '@/lib/supabase/server'
import { getWorkoutDetails } from '@/actions/workout-actions'
import { getActiveWorkoutSession, getWorkoutStatus } from '@/actions/log-actions'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import WorkoutPlayerClient from './workout-player-client'
import { redirect } from 'next/navigation'

export default async function WorkoutPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: workoutId } = await params
    
    // ─── AUTH (SERVER-SIDE) ──────────────────────────────────────────────────
    // Eliminates the client-side useEffect waterfall (Bug 01)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userId = user.id
    const queryClient = getQueryClient()
    
    // ─── HYDRATION (SERVER-SIDE) ─────────────────────────────────────────────
    // Prefetch all data needed for Player (ELITE PARALLEL)
    // Supports 0ms navigation and persistent cache
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.workouts.detail(workoutId),
            queryFn: () => getWorkoutDetails(workoutId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.workouts.status(userId, workoutId),
            queryFn: () => getWorkoutStatus(userId, workoutId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.activeSession(userId),
            queryFn: () => getActiveWorkoutSession()
        })
    ])

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WorkoutPlayerClient userId={userId} workoutId={workoutId} />
        </HydrationBoundary>
    )
}

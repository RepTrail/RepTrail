import { getWorkoutDetails } from '@/actions/workout-actions'
import { getActiveWorkoutSession, getWorkoutStatus } from '@/actions/log-actions'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import WorkoutPlayerClient from './workout-player-client'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function WorkoutPlayerPage({ 
    params,
    searchParams
}: { 
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id: workoutId } = await params
    const sParams = await searchParams
    const isForced = sParams.force === 'true'
    
    // ─── AUTH (SERVER-SIDE) ──────────────────────────────────────────────────
    // Eliminates the client-side useEffect waterfall (Bug 01)
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')
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
            queryKey: QUERY_KEYS.workouts.session,
            queryFn: () => getActiveWorkoutSession()
        })
    ])

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WorkoutPlayerClient userId={userId} workoutId={workoutId} isForced={isForced} />
        </HydrationBoundary>
    )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { getWorkoutDetails } from '@/actions/workout-actions'
import { WorkoutBuilder } from '@/components/store/features(deprecated)/workout-builder'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

interface StudentWorkoutDetailClientProps {
    workoutId: string
    userId: string
    initialData: any
}

export function StudentWorkoutDetailClient({ workoutId, userId, initialData }: StudentWorkoutDetailClientProps) {
    // 1. Local-First synchronization
    useRealtimeSync({
        table: 'workouts',
        queryKey: QUERY_KEYS.workouts.detail(workoutId),
        filter: `id=eq.${workoutId}`
    })

    useRealtimeSync({
        table: 'workout_exercises',
        queryKey: QUERY_KEYS.workouts.detail(workoutId),
        filter: `workout_id=eq.${workoutId}`
    })

    // 2. Data consumption
    const { data: workout } = useQuery({
        queryKey: QUERY_KEYS.workouts.detail(workoutId),
        queryFn: () => getWorkoutDetails(workoutId),
        initialData,
        staleTime: 1000 * 60 * 5
    })

    if (!workout) return null

    return (
        <WorkoutBuilder
            workout={workout as any}
            backHref="/dashboard/student/workouts"
            canAssign={false}
            showAssignmentBadge={false}
        />
    )
}



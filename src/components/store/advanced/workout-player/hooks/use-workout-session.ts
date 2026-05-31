'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'

interface UseWorkoutSessionProps {
    userId: string
    workoutId: string
    initialLogId?: string
}

export function useWorkoutSession({ userId, workoutId, initialLogId }: UseWorkoutSessionProps) {
    const queryClient = useQueryClient()
    const [logId, setLogId] = useState<string | null>(initialLogId || null)

    // ─── Mutations ──────────────────────────────────────────────────────────

    const startWorkoutMutation = useOptimisticMutation({
        actionName: 'start-workout-log',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        onMutate: (variables: any) => {
            const sessionData = {
                id: variables.id,
                workout_id: variables.workoutId,
                student_id: variables.studentId,
                status: 'in_progress',
                started_at: new Date().toISOString()
            }
            queryClient.setQueryData(QUERY_KEYS.workouts.session, sessionData)
        }
    })

    const recordSetMutation = useOptimisticMutation({
        actionName: 'record-set-load',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG
    })

    const saveStateMutation = useOptimisticMutation({
        actionName: 'save-workout-state',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG
    })

    const finishWorkoutMutation = useOptimisticMutation({
        actionName: 'finish-workout',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        additionalQueryKeys: [QUERY_KEYS.workouts.all(userId)],
        onMutate: (variables: any) => {
            queryClient.setQueryData(QUERY_KEYS.workouts.session, null)
            const statusKey = QUERY_KEYS.workouts.status(userId, workoutId)
            queryClient.setQueryData(statusKey, {
                status: 'completed',
                logId: variables.id,
                _optimistic: true
            })
            const todayKey = QUERY_KEYS.workouts.today(userId)
            queryClient.setQueryData(todayKey, (old: any) => {
                if (!old) return old
                return { ...old, status: 'completed', _optimistic: true }
            })
        }
    })

    // ─── Lifecycle ───────────────────────────────────────────────────────────

    // Auto-start workout if no logId exists
    useEffect(() => {
        if (logId) return
        const newLogId = crypto.randomUUID()
        setLogId(newLogId)
        startWorkoutMutation.mutate({ id: newLogId, workoutId, studentId: userId })
    }, [workoutId, userId, logId])

    const saveCurrentState = (state: any) => {
        if (!logId) return
        saveStateMutation.mutate({ logId, state })
    }

    return {
        logId,
        mutations: {
            recordSet: recordSetMutation.mutate,
            finishWorkout: finishWorkoutMutation.mutate,
            saveState: saveCurrentState
        },
        isLoading: startWorkoutMutation.isPending
    }
}

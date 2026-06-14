'use client'

import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerWorkouts } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { WorkoutManagementList } from '@/components/store/advanced/workout-management-list'

interface TrainerWorkoutLibrarySmartProps {
    userId: string
    betaTesterMode?: boolean
}

/**
 * TrainerWorkoutLibrarySmart
 * Mirrors StudentWorkoutManagementSmart (auto-training library path)
 * but renders trainer library cards with per-student assignment chips.
 */
export function TrainerWorkoutLibrarySmart({ userId, betaTesterMode = false }: TrainerWorkoutLibrarySmartProps) {
    const { data: workouts = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.library(userId),
        queryFn: () => getTrainerWorkouts(userId),
        staleTime: 1000 * 60 * 5,
    })

    useRealtimeSync({
        table: 'workouts',
        queryKey: QUERY_KEYS.workouts.library(userId),
        filter: `trainer_id=eq.${userId}`,
    })

    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.library(userId),
    })

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <WorkoutManagementList
                    userId={userId}
                    workouts={workouts}
                    mode="trainer"
                    betaTesterMode={betaTesterMode}
                />
            </Stack>
        </Stack>
    )
}

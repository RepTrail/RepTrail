'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerWorkouts } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { WorkoutManagementSectionContent } from '@/components/store/sections/workout-management-section-content'

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
        <RegistrySection>
            <WorkoutManagementSectionContent
                userId={userId}
                workouts={workouts}
                mode="trainer"
                betaTesterMode={betaTesterMode}
            />
        </RegistrySection>
    )
}

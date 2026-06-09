'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LayoutDashboard } from 'lucide-react'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerWorkouts } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
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
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={LayoutDashboard} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Section"}</Font>
                    </Inline>
                    
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <WorkoutManagementSectionContent
                userId={userId}
                workouts={workouts}
                mode="trainer"
                betaTesterMode={betaTesterMode}
            />
          </Stack>
        </Stack>
    )
}

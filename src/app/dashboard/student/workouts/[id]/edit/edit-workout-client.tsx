'use client'

import React from 'react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { WorkoutBuilderSmart } from "@/components/store/advanced/workout-builder-smart"
import { notFound } from "next/navigation"
import { useWorkoutWithExercises, useProfile, useAssignedWorkout } from '@/lib/dal'
import { WorkoutDaySelector } from '@/components/store/advanced/workout-day-selector'
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { Stack } from "@/components/store/base/stack"
import { Loader2 } from 'lucide-react'
import { Icon } from '@/components/store/base/icon'

interface EditWorkoutClientProps {
    id: string
    userId: string
}

export function EditWorkoutClient({ id, userId }: EditWorkoutClientProps) {
    const { data: profile, isLoading: isProfileLoading } = useProfile(userId)
    const { data: workoutWithExercises, isLoading: isWorkoutLoading } = useWorkoutWithExercises(id)
    const { data: assignment, isLoading: isAssignmentLoading } = useAssignedWorkout(id, userId)

    const isLoading = isProfileLoading || isWorkoutLoading || isAssignmentLoading

    if (isLoading) {
        return (
            <RegistryMain
                title="DETALHES DO TREINO"
                subtitle="Veja o planejamento enviado pelo seu treinador."
                icon="Dumbbell"
                contextLabel="Treinos & Performance"
                showTabs={false}
                showHeader={false}
            >
                <Box display="flex" align="center" justify="center" padding={STORE_TOKENS.PADDING.CONTAINER} height="full">
                    <Icon icon={Loader2} size="md" color={STORE_TOKENS.COLORS.BRAND} animate="spin" />
                </Box>
            </RegistryMain>
        )
    }

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    if (!isAutoTrainingActive || !workoutWithExercises) {
        return notFound()
    }

    return (
        <RegistryMain
            title="DETALHES DO TREINO"
            subtitle="Veja o planejamento enviado pelo seu treinador."
            icon="Dumbbell"
            contextLabel="Treinos & Performance"
            showTabs={false}
            showHeader={false}
        >
            <Stack fullWidth gap={STORE_TOKENS.SPACING.ELEMENT}>
                {assignment?.id ? (
                    <Box display="flex" justify="end">
                        <WorkoutDaySelector userId={userId} assignmentId={assignment.id as string} dayOfWeek={(assignment.day_of_week as number) ?? null} />
                    </Box>
                ) : null}
                <WorkoutBuilderSmart 
                    workout={workoutWithExercises as any} 
                    backHref="/dashboard/student/workouts" 
                    contextLabel="TREINOS E PERFORMANCE"
                    icon="Dumbbell"
                    contextColor="orange"
                />
            </Stack>
        </RegistryMain>
    )
}

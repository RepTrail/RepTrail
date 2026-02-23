'use client'

import { CreateWorkoutDialog } from '@/components/feature/student/create-workout-dialog'

interface WorkoutActionsProps {
    isAutoTrainingActive: boolean
}

export function WorkoutActions({ isAutoTrainingActive }: WorkoutActionsProps) {
    if (!isAutoTrainingActive) return null

    return <CreateWorkoutDialog />
}

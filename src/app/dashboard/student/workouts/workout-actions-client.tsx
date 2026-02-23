'use client'

import { CreateWorkoutDialog } from '@/components/feature/student/create-workout-dialog'

interface WorkoutActionsClientProps {
    isAutoTrainingActive: boolean
}

export function WorkoutActionsClient({ isAutoTrainingActive }: WorkoutActionsClientProps) {
    // Render only on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return null
    
    if (!isAutoTrainingActive) return null

    return <CreateWorkoutDialog />
}

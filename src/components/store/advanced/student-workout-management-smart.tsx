'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAssignedWorkouts, getTrainerWorkouts } from '@/actions/workout-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { WorkoutManagementSectionContent } from '@/components/store/sections/workout-management-section-content'

interface StudentWorkoutManagementSmartProps {
    userId: string
}

export function StudentWorkoutManagementSmart({ userId }: StudentWorkoutManagementSmartProps) {
    // 1. Data Fetching
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: assignedWorkouts = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.all(userId),
        queryFn: () => getAssignedWorkouts(userId),
        staleTime: 1000 * 60 * 5
    })

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const hasTrainer = !!trainerLink
    const isAutoMode = isAutoTrainingActive && !hasTrainer

    const { data: libraryWorkouts = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.library(userId),
        queryFn: () => getTrainerWorkouts(userId),
        enabled: isAutoMode,
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Sync
    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'workouts',
        queryKey: QUERY_KEYS.workouts.library(userId),
        filter: `trainer_id=eq.${userId}`
    })

    // 3. Logic: Group assignments and determine display data
    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
    
    let displayWorkouts = []
    
    if (isAutoMode) {
        // In Auto Mode, each library workout is a card.
        // We need to inject the assigned days into each library workout.
        const assignmentsByWorkout = assignedWorkouts.reduce((acc: any, curr: any) => {
            const wId = curr.workout?.id
            if (!wId) return acc
            if (!acc[wId]) acc[wId] = []
            acc[wId].push(curr.day_of_week)
            return acc
        }, {})

        displayWorkouts = libraryWorkouts.map(w => ({
            ...w,
            assigned_workouts: (assignmentsByWorkout[w.id] || []).map((d: number) => ({ day_of_week: d }))
        }))
    } else {
        // In Personal Mode, we group assigned workouts by workout ID.
        const grouped = assignedWorkouts.reduce((acc: any, curr: any) => {
            const wId = curr.workout?.id
            if (!wId) return acc
            if (!acc[wId]) {
                acc[wId] = {
                    ...curr.workout,
                    assigned_workouts: []
                }
            }
            acc[wId].assigned_workouts.push({ day_of_week: curr.day_of_week })
            return acc
        }, {})
        displayWorkouts = Object.values(grouped)
    }

    return (
        <RegistrySection>
            <WorkoutManagementSectionContent 
                userId={userId}
                workouts={displayWorkouts}
                mode={isAutoMode ? 'auto' : 'personal'}
            />
        </RegistrySection>
    )
}

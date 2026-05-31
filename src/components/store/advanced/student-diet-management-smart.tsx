'use client'

import React from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import { 
    useProfile, 
    useStudentTrainer, 
    useAssignedDiets, 
    useTrainerDiets 
} from '@/lib/dal'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { DietManagementSectionContent } from '@/components/store/sections/diet-management-section-content'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Grid } from '@/components/store/base/grid'

interface StudentDietManagementSmartProps {
    userId: string
}

export function StudentDietManagementSmart({ userId }: StudentDietManagementSmartProps) {
    // 1. Data Fetching via Local-First DAL
    const { data: profile } = useProfile(userId)
    const { data: trainerLink } = useStudentTrainer(userId)
    const { data: assignedDiets = [] } = useAssignedDiets(userId)

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const hasTrainer = !!trainerLink
    const isAutoMode = isAutoTrainingActive && !hasTrainer

    const { data: libraryDiets = [] } = useTrainerDiets(userId)

    // 2. Realtime Sync (mediated by Sync Engine observers)
    useRealtimeSync({
        table: 'assigned_diets',
        queryKey: QUERY_KEYS.diets.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'diets',
        queryKey: QUERY_KEYS.diets.library(userId),
        filter: `trainer_id=eq.${userId}`
    })

    // 3. Logic: Group assignments and determine display data
    let displayDiets = []
    
    if (isAutoMode) {
        const assignmentsByDiet = (assignedDiets || []).reduce((acc: any, curr: any) => {
            const dId = curr.diet_id || curr.diet?.id
            if (!dId) return acc
            if (!acc[dId]) acc[dId] = []
            if (curr.days_of_week) {
                const days = Array.isArray(curr.days_of_week) ? curr.days_of_week : []
                acc[dId].push(...days)
            }
            return acc
        }, {})

        displayDiets = libraryDiets.map(d => ({
            ...d,
            assigned_diets: (assignmentsByDiet[d.id] || []).map((day: number) => ({ day_of_week: day }))
        }))
    } else {
        const grouped = (assignedDiets || []).reduce((acc: any, curr: any) => {
            const dId = curr.diet_id || curr.diet?.id
            if (!dId) return acc
            if (!acc[dId]) {
                acc[dId] = {
                    ...(curr.diet || curr),
                    assigned_diets: []
                }
            }
            if (curr.days_of_week) {
                const days = Array.isArray(curr.days_of_week) ? curr.days_of_week : []
                acc[dId].assigned_diets.push(...days.map((d: number) => ({ day_of_week: d })))
            }
            return acc
        }, {})
        displayDiets = Object.values(grouped)
    }

    return (
        <Grid cols={{ base: 1, md: 12 }} gap={STORE_TOKENS.SPACING.SECTION} fullWidth flex1>
            {/* Diet Management */}
            <Stack mdColSpan={12} flex1 gap={STORE_TOKENS.SPACING.SECTION}>
                <RegistrySection>
                    <DietManagementSectionContent 
                        userId={userId}
                        diets={displayDiets}
                        mode={isAutoMode ? 'auto' : 'personal'}
                    />
                </RegistrySection>
            </Stack>
        </Grid>
    )
}

'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Maximize2, Dumbbell } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface WorkoutManagementSectionContentProps {
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * WorkoutManagementSectionContent: Grid of premium training cards using the unified component.
 * Faithful to Image 27.
 */
export function WorkoutManagementSectionContent({ 
    mode = 'auto',
    isEmpty = false
}: WorkoutManagementSectionContentProps) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={Dumbbell}
                title="SEM TREINOS"
                description="Você ainda não possui protocolos de treino cadastrados."
            />
        )
    }

    const workouts = [
        { title: 'TREINO A', description: 'Sem descrição adicionada.', days: ['QUI'], exercises: 14, date: '28/04/2026' },
        { title: 'TREINO C', description: 'Sem descrição adicionada.', days: ['SEX'], exercises: 6, date: '28/04/2026' },
        { title: 'TREINO B', description: 'Sem descrição adicionada.', days: ['TER'], exercises: 5, date: '28/04/2026' },
        { title: 'TREINO A', description: 'Sem descrição adicionada.', days: ['SEG'], exercises: 12, date: '28/04/2026' }
    ]

    return (
        <Grid cols={{ base: 2.5, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {workouts.map((workout, idx) => (
                <ManagementCardPremium 
                    key={idx}
                    title={workout.title}
                    description={workout.description}
                    days={workout.days}
                    mainStat={{ label: 'EXERCÍCIOS', value: workout.exercises }}
                    date={workout.date}
                    icon={Dumbbell}
                    mode={mode}
                    color={STORE_TOKENS.COLORS.BRAND}
                    registryType="training"
                />
            ))}
        </Grid>
    )
}

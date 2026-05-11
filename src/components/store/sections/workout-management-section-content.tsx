'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { ManagementCardPremium } from '../intermediary/management-card-premium'
import { Maximize2 } from 'lucide-react'

interface WorkoutManagementSectionContentProps {
    mode?: 'auto' | 'personal'
}

/**
 * WorkoutManagementSectionContent: Grid of premium training cards using the unified component.
 * Faithful to Image 27.
 */
export function WorkoutManagementSectionContent({ 
    mode = 'auto' 
}: WorkoutManagementSectionContentProps) {
    const workouts = [
        { title: 'TREINO A', description: 'Sem descrição adicionada.', days: ['QUI'], exercises: 14, date: '28/04/2026' },
        { title: 'TREINO C', description: 'Sem descrição adicionada.', days: ['SEX'], exercises: 6, date: '28/04/2026' },
        { title: 'TREINO B', description: 'Sem descrição adicionada.', days: ['TER'], exercises: 5, date: '28/04/2026' },
        { title: 'TREINO A', description: 'Sem descrição adicionada.', days: ['SEG'], exercises: 12, date: '28/04/2026' }
    ]

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {workouts.map((workout, idx) => (
                <ManagementCardPremium 
                    key={idx}
                    title={workout.title}
                    description={workout.description}
                    days={workout.days}
                    mainStat={{ label: 'EXERCÍCIOS', value: workout.exercises }}
                    date={workout.date}
                    icon={Maximize2}
                    mode={mode}
                    color="primary"
                />
            ))}
        </Grid>
    )
}

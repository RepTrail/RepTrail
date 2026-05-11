'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { ManagementCardPremium } from '../intermediary/management-card-premium'
import { Utensils } from 'lucide-react'

interface DietManagementSectionContentProps {
    mode?: 'auto' | 'personal'
}

/**
 * DietManagementSectionContent: Grid of premium diet cards.
 * Faithful to Image 30.
 */
export function DietManagementSectionContent({ 
    mode = 'auto' 
}: DietManagementSectionContentProps) {
    const diets = [
        { 
            title: 'PROTOCOLO ALIMENTAR - SUPERÁVIT', 
            days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'], 
            meals: 4, 
            date: '28/04/2026' 
        }
    ]

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {diets.map((diet, idx) => (
                <ManagementCardPremium 
                    key={idx}
                    title={diet.title}
                    days={diet.days}
                    mainStat={{ label: 'REFEIÇÕES', value: diet.meals }}
                    date={diet.date}
                    icon={Utensils}
                    mode={mode}
                    color="primary"
                />
            ))}
        </Grid>
    )
}

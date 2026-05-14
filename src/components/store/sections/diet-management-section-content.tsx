'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Utensils } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface DietManagementSectionContentProps {
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * DietManagementSectionContent: Grid of premium diet cards.
 * Faithful to Image 30.
 */
export function DietManagementSectionContent({ 
    mode = 'auto',
    isEmpty = false
}: DietManagementSectionContentProps) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={Utensils}
                title="SEM DIETA"
                description="Você ainda não possui protocolos alimentares cadastrados."
            />
        )
    }

    const diets = [
        { 
            title: 'PROTOCOLO ALIMENTAR - SUPERÁVIT', 
            days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'], 
            meals: 4, 
            date: '28/04/2026' 
        }
    ]

    return (
        <Grid cols={{ base: 2.5, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {diets.map((diet, idx) => (
                <ManagementCardPremium 
                    key={idx}
                    title={diet.title}
                    days={diet.days}
                    mainStat={{ label: 'REFEIÇÕES', value: diet.meals }}
                    date={diet.date}
                    icon={Utensils}
                    mode={mode}
                    color={STORE_TOKENS.COLORS.BRAND}
                    registryType="diet"
                />
            ))}
        </Grid>
    )
}

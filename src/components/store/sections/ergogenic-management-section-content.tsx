'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { ErgogenicCardPremium } from '../intermediary/ergogenic-card-premium'

interface ErgogenicManagementSectionContentProps {
    mode?: 'auto' | 'personal'
}

/**
 * ErgogenicManagementSectionContent: Grid of premium ergogenic cards.
 * Faithful to Image 31.
 */
export function ErgogenicManagementSectionContent({ 
    mode = 'auto' 
}: ErgogenicManagementSectionContentProps) {
    const items = [
        { title: 'DURATESTON', days: ['SEG', 'QUA', 'SEX'], dosage: '100 MG', frequency: '3X NA SEMANA' },
        { title: 'IOIMBINA', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '5 MG', frequency: '7X NA SEMANA' },
        { title: 'NAC', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '500 MG', frequency: '7X NA SEMANA' },
        { title: 'CAFEINA', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '200 MG', frequency: '7X NA SEMANA' }
    ]

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {items.map((item, idx) => (
                <ErgogenicCardPremium 
                    key={idx}
                    title={item.title}
                    days={item.days}
                    dosage={item.dosage}
                    frequency={item.frequency}
                    mode={mode}
                    color="primary"
                />
            ))}
        </Grid>
    )
}

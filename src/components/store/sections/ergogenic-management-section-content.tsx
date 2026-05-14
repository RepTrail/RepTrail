'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ErgogenicCardPremium } from '@/components/store/intermediary/ergogenic-card-premium'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { FlaskConical } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface ErgogenicManagementSectionContentProps {
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * ErgogenicManagementSectionContent: Grid of premium ergogenic cards.
 * Faithful to Image 31.
 */
export function ErgogenicManagementSectionContent({ 
    mode = 'auto',
    isEmpty = false
}: ErgogenicManagementSectionContentProps) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={FlaskConical}
                title="SEM ERGOGÊNICOS"
                description="Você ainda não possui protocolos de ergogênicos cadastrados."
            />
        )
    }

    const items = [
        { title: 'DURATESTON', days: ['SEG', 'QUA', 'SEX'], dosage: '100 MG', frequency: '3X NA SEMANA' },
        { title: 'IOIMBINA', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '5 MG', frequency: '7X NA SEMANA' },
        { title: 'NAC', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '500 MG', frequency: '7X NA SEMANA' },
        { title: 'CAFEINA', days: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'], dosage: '200 MG', frequency: '7X NA SEMANA' }
    ]

    return (
        <Grid cols={{ base: 2.5, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {items.map((item, idx) => (
                <ErgogenicCardPremium 
                    key={idx}
                    title={item.title}
                    days={item.days}
                    dosage={item.dosage}
                    frequency={item.frequency}
                    mode={mode}
                    color={STORE_TOKENS.COLORS.BRAND}
                />
            ))}
        </Grid>
    )
}

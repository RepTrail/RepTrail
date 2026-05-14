'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { DietAdherenceCard } from '@/components/store/advanced/diet-adherence-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Utensils } from 'lucide-react'

export function StudentNutritionAdherence() {
    return (
        <RegistrySection
            title="SEÇÃO DE DIETA"
            subtitle="Acompanhamento nutricional."
            icon={Utensils}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <DietAdherenceCard
                    completedItems={1}
                    totalItems={12}
                    percentage={8}
                    macros={{
                        calories: 2478,
                        protein: 206,
                        carbs: 301,
                        fat: 50,
                        fiber: 0
                    }}
                    meals={[
                        { name: 'Refeição 1', itemsCount: '1/2' },
                        { name: 'Refeição 2', itemsCount: '0/4' }
                    ]}
                    status="active"
                />
                <DietAdherenceCard
                    completedItems={0}
                    totalItems={0}
                    percentage={0}
                    macros={{ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }}
                    meals={[]}
                    status="empty"
                />
            </Stack>
        </RegistrySection>
    )
}

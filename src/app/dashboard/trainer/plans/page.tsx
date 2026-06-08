import React from 'react'
import { getTrainerPlansSession } from '@/lib/dal/server'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PlanCard } from '@/components/store/advanced/plan-card'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'

export default async function TrainerPlansPage() {
    const { user, planId: currentPlanId, pricingData } = await getTrainerPlansSession()

    if (!user) return null

    const plans = pricingData || []

    return (
        <RegistryMain title="Planos" subtitle="Gerencie sua assinatura" icon="package" showTabs={false}>
            <RegistrySection>
                <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                    <Grid cols={{ base: 1, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {plans.map((plan: any) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrentPlan={plan.id === currentPlanId}
                            />
                        ))}
                    </Grid>
                </Stack>
            </RegistrySection>
        </RegistryMain>
    )
}

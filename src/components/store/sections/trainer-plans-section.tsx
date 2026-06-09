import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PlanCard } from '@/components/store/advanced/plan-card'

interface TrainerPlansSectionProps {
    plans: any[]
    currentPlanId?: string
}

export function TrainerPlansSection({ plans, currentPlanId }: TrainerPlansSectionProps) {
    return (
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
    )
}

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PlanCard } from '@/components/store/advanced/plan-card'
import { RegistryProvider } from '@/components/store/base/registry-context'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { Box } from '@/components/store/base/box'

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

export function TrainerOnboardingPlansShell({ children }: { children: React.ReactNode }) {
    return (
        <RegistryProvider defaultColor="emerald">
            <Surface
                minHeight="screen"
                bg={STORE_TOKENS.COLORS.BACKGROUND}
                bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
                overflow="hidden"
                position="relative"
            >
                <BackgroundEffects variant="all" />
                <Box
                    position="relative"
                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                    fullWidth
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                >
                    {children}
                </Box>
            </Surface>
        </RegistryProvider>
    )
}

'use client'

import React, { useTransition } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { PlanCard } from '@/components/store/advanced/plan-card'
import { PackageOpen } from 'lucide-react'
import { actions } from '@/lib/dal'
export function AdminPlansListPanel({ plans }: { plans: any[] }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = (id: string) => {
        startTransition(async () => {
            await actions.togglePlanActive(id)
        })
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {plans.length === 0 ? (
                    <EmptyState 
                        variant="red" 
                        icon={PackageOpen} 
                        title="Nenhum plano encontrado" 
                        description="Nenhum plano de assinatura foi configurado no sistema ainda." 
                    />
                ) : (
                    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {plans.map((plan) => (
                            <PlanCard 
                                key={plan.id} 
                                plan={plan} 
                                adminMode={true} 
                                onToggleActive={handleToggle}
                                isPending={isPending}
                            />
                        ))}
                    </Grid>
                )}
            </Stack>
        </Stack>
    )
}

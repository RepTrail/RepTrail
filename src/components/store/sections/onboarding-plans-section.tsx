'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface OnboardingPlansSectionProps {
    plans: any[]
}

export function OnboardingPlansSection({ plans }: OnboardingPlansSectionProps) {
    const hasPublicPlans = Array.isArray(plans) && plans.length > 0

    return (
        <AuthShell>
            <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" textAlign="center">
                    <Font variant="h2" weight="black" uppercase italic color="white">
                        Escolha seu Plano
                    </Font>
                    <Font variant="body" color="zinc-400">
                        Para acessar a plataforma, selecione o plano que melhor atende às suas necessidades.
                    </Font>
                </Stack>

                {hasPublicPlans ? (
                    <TrainerPlansSection plans={plans} />
                ) : (
                    <Stack align="center" fullWidth>
                        <Font variant="body" color="zinc-500">
                            Nenhum plano disponível no momento.
                        </Font>
                    </Stack>
                )}
            </Stack>
        </AuthShell>
    )
}

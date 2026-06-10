'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { OnboardingLogoutButton } from '@/components/store/advanced/onboarding-logout-button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface OnboardingPlansSectionProps {
    plans: any[]
}

export function OnboardingPlansSection({ plans }: OnboardingPlansSectionProps) {
    return (
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
                <RegistryMain
                    title="Escolha seu Plano"
                    subtitle="Selecione o plano que melhor atende às suas necessidades para acessar a plataforma."
                    icon="CreditCard"
                    contextLabel="Onboarding"
                    showHeader={true}
                    showTabs={false}
                    noPadding={true}
                    noMinHeight={true}
                    rightElement={<OnboardingLogoutButton />}
                >
                    <TrainerPlansSection plans={plans} />
                </RegistryMain>
            </Box>
        </Surface>
    )
}

import React from 'react'
import { getTrainerPlansSession } from '@/lib/dal/server'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'

export default async function TrainerPlansPage() {
    const { user, planId: currentPlanId, pricingData } = await getTrainerPlansSession()

    if (!user) return null

    const plans = pricingData || []

    return (
        <RegistryMain title="Planos" subtitle="Gerencie sua assinatura" icon="package" showTabs={false}>
            <RegistrySection>
                <TrainerPlansSection plans={plans} currentPlanId={currentPlanId} />
            </RegistrySection>
        </RegistryMain>
    )
}

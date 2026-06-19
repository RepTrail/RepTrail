import React from 'react'
import { getTrainerPlansSession } from '@/lib/dal/server'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'

export default async function TrainerPlansPage() {
    const { user, planId: currentPlanId, pricingData, isRenewal } = await getTrainerPlansSession()

    if (!user) return null

    const plans = pricingData || []

    const title = isRenewal ? "Renovar Assinatura" : "Planos"
    const subtitle = isRenewal ? "Sua assinatura expirou. Escolha um plano para continuar usando o RepTrail." : "Gerencie sua assinatura"

    return (
        <RegistryMain title={title} subtitle={subtitle} icon="package" showTabs={false}>
            <RegistrySection>
                <TrainerPlansSection plans={plans} currentPlanId={currentPlanId} />
            </RegistrySection>
        </RegistryMain>
    )
}

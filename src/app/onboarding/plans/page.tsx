import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getProfile } from '@/lib/dal/server'
import { getPublicPlanPricing } from '@/actions/trainer-actions'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { OnboardingLogoutButton } from '@/components/store/intermediary/onboarding-logout-button'
import { TrainerOnboardingPlansShell } from '@/components/store/sections/trainer-plans-section'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'

export default async function OnboardingPlansPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const profile = await getProfile(userId)
    if (!profile) redirect('/auth/login')

    // Se o usuário já tiver um plano, ele não deveria estar aqui. Manda pro dashboard.
    if (profile.plan_id) {
        redirect('/dashboard/trainer')
    }

    const publicPlans = await getPublicPlanPricing()

    return (
        <TrainerOnboardingPlansShell>
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
                <TrainerPlansSection plans={publicPlans} />
            </RegistryMain>
        </TrainerOnboardingPlansShell>
    )
}

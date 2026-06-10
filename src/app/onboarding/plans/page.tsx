import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getProfile, actions } from '@/lib/dal/server'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { OnboardingPlansSection } from '@/components/store/sections/onboarding-plans-section'

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

    const publicPlans = await actions.getPublicPlanPricing()

    return (
        <RegistryProvider defaultColor="emerald">
            <OnboardingPlansSection plans={publicPlans} />
        </RegistryProvider>
    )
}

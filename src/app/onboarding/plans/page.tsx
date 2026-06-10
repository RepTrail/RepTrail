import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getProfile, actions } from '@/lib/dal/server'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'

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
    const hasPublicPlans = Array.isArray(publicPlans) && publicPlans.length > 0

    return (
        <RegistryProvider defaultColor="emerald">
            <AuthShell>
                <Stack gap="xl" fullWidth>
                    <Stack gap="sm" align="center" textAlign="center">
                        <Font variant="h2" weight="black" uppercase italic color="white">
                            Escolha seu Plano
                        </Font>
                        <Font variant="body" color="zinc-400">
                            Para acessar a plataforma, selecione o plano que melhor atende às suas necessidades.
                        </Font>
                    </Stack>

                    {hasPublicPlans ? (
                        <TrainerPlansSection plans={publicPlans} />
                    ) : (
                        <Font variant="body" color="zinc-500" textAlign="center">
                            Nenhum plano disponível no momento.
                        </Font>
                    )}
                </Stack>
            </AuthShell>
        </RegistryProvider>
    )
}

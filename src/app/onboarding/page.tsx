import { StudentOnboardingForm } from '@/components/store/advanced/student-onboarding-form'
import { getOnboardingSessionInfo } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function OnboardingPage() {
    const { user, role, onboardingCompleted, trainerCode, profileExists } = await getOnboardingSessionInfo()

    if (!user) {
        redirect('/auth/login')
    }

    if (!profileExists) {
        redirect('/auth/logout')
    }

    if (role === 'trainer') {
        redirect('/dashboard/trainer')
    }

    if (onboardingCompleted) {
        redirect('/dashboard/student')
    }

    return (
        <RegistryProvider defaultColor="orange">
            <Surface
                as="main"
                minHeight="screen"
                bg={STORE_TOKENS.COLORS.BACKGROUND}
                overflowX="hidden"
                display="flex"
                align="center"
                justify="center"
                position="relative"
                padding={STORE_TOKENS.PADDING.CONTAINER}
            >
                <BackgroundEffects variant="all" />
                <Stack
                    gap={STORE_TOKENS.SPACING.CONTAINER}
                    align="center"
                    justify="center"
                >
                    <StudentOnboardingForm defaultTrainerCode={trainerCode} />
                </Stack>
            </Surface>
        </RegistryProvider>
    );
}

import { getOnboardingSessionInfo } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { StudentOnboardingSection } from '@/components/store/sections/student-onboarding-section'

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
            <StudentOnboardingSection trainerCode={trainerCode} />
        </RegistryProvider>
    );
}

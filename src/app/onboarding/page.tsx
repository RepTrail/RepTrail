import { StudentOnboardingForm } from '@/components/store/advanced/student-onboarding-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function OnboardingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', user.id)
        .single()

    const role = profile?.role || user.user_metadata?.role
    
    if (role === 'trainer') {
        redirect('/dashboard/trainer')
    }

    if (profile?.onboarding_completed) {
        redirect('/dashboard/student')
    }

    const trainerCode = user.user_metadata?.trainer_code || ''

    return (
        <RegistryProvider defaultColor="orange">
            <Surface
                as="main"
                minHeight="screen"
                bg="zinc"
                overflowX="hidden"
                display="flex"
                align="center"
                justify="center"
                position="relative"
                padding={{ base: 5, md: 10 }}
            >
                <BackgroundEffects variant="all" />
                <Stack 
                    gap={STORE_TOKENS.SPACING.CONTAINER} 
                    align="center" 
                    justify="center" 
                    className="w-full max-w-[600px] z-10 py-12"
                >
                    <StudentOnboardingForm defaultTrainerCode={trainerCode} />
                </Stack>
            </Surface>
        </RegistryProvider>
    )
}

'use client'

import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StudentOnboardingForm } from '@/components/store/advanced/student-onboarding-form'

interface StudentOnboardingSectionProps {
    trainerCode: string
}

export function StudentOnboardingSection({ trainerCode }: StudentOnboardingSectionProps) {
    return (
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
    )
}

'use client'

import { Suspense } from 'react'
import { TrainerWorkoutLibrarySmart } from '@/components/store/advanced/trainer-workout-library-smart'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerWorkoutsSectionProps {
    userId: string
    betaTesterMode: boolean
}

export function TrainerWorkoutsSection({ userId, betaTesterMode }: TrainerWorkoutsSectionProps) {
    return (
        <Suspense
            fallback={
                <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Surface>
            }
        >
            <Box suppressHydrationWarning>
                <TrainerWorkoutLibrarySmart userId={userId} betaTesterMode={betaTesterMode} />
            </Box>
        </Suspense>
    )
}

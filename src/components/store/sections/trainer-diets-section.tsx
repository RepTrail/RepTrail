'use client'

import { Suspense } from 'react'
import { TrainerDietLibrarySmart } from '@/components/store/advanced/trainer-diet-library-smart'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerDietsSectionProps {
    userId: string
    betaTesterMode: boolean
}

export function TrainerDietsSection({ userId, betaTesterMode }: TrainerDietsSectionProps) {
    return (
        <Suspense
            fallback={
                <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Surface>
            }
        >
            <Box suppressHydrationWarning>
                <TrainerDietLibrarySmart userId={userId} betaTesterMode={betaTesterMode} />
            </Box>
        </Suspense>
    )
}

'use client'

import { Suspense } from 'react'
import { TrainerErgogenicsHubSmart } from '@/components/store/advanced/trainer-ergogenics-hub-smart'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerErgogenicsSectionProps {
    userId: string
}

export function TrainerErgogenicsSection({ userId }: TrainerErgogenicsSectionProps) {
    return (
        <Suspense
            fallback={
                <Box gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Box>
            }
        >
            <Box suppressHydrationWarning>
                <TrainerErgogenicsHubSmart userId={userId} />
            </Box>
        </Suspense>
    )
}

'use client'

import { Suspense } from 'react'
import { TrainerStudentErgogenicsShell } from '@/components/store/advanced/trainer-student-ergogenics-shell'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'

interface TrainerStudentErgogenicsSectionProps {
    effectiveStudentId: string
    studentName: string
    betaTesterMode: boolean
}

export function TrainerStudentErgogenicsSection({
    effectiveStudentId,
    studentName,
    betaTesterMode,
}: TrainerStudentErgogenicsSectionProps) {
    return (
        <Suspense
            fallback={
                <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} {...{ width: 160, height: 32 }} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={120} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={400} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Surface>
            }
        >
            <Box suppressHydrationWarning>
                <TrainerStudentErgogenicsShell
                    effectiveStudentId={effectiveStudentId}
                    studentName={studentName}
                    betaTesterMode={betaTesterMode}
                />
            </Box>
        </Suspense>
    )
}

'use client'

import { Suspense } from 'react'
import { StudentCardioManagementSmart } from '@/components/store/advanced/student-cardio-management-smart'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentCardioSectionProps {
    userId: string
}

export function StudentCardioSection({ userId }: StudentCardioSectionProps) {
    return (
        <Suspense fallback={
            <Box fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box height={400} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Stack>
            </Box>
        }>
            <Box suppressHydrationWarning fullWidth>
                <StudentCardioManagementSmart userId={userId} />
            </Box>
        </Suspense>
    )
}

'use client'

import { Suspense } from 'react'
import { StudentErgogenicManagementSmart } from '@/components/store/advanced/student-ergogenic-management-smart'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentErgogenicsSectionProps {
    userId: string
}

export function StudentErgogenicsSection({ userId }: StudentErgogenicsSectionProps) {
    return (
        <Suspense fallback={
            <Box fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box height={400} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Stack>
            </Box>
        }>
            <Box suppressHydrationWarning fullWidth>
                <StudentErgogenicManagementSmart userId={userId} />
            </Box>
        </Suspense>
    )
}

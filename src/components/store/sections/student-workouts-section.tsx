'use client'

import { Suspense } from 'react'
import { StudentWorkoutManagementSmart } from '@/components/store/advanced/student-workout-management-smart'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentWorkoutsSectionProps {
    userId: string
}

export function StudentWorkoutsSection({ userId }: StudentWorkoutsSectionProps) {
    return (
        <Suspense fallback={
            <Box fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box height={280} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Stack>
            </Box>
        }>
            <Box suppressHydrationWarning fullWidth>
                <StudentWorkoutManagementSmart userId={userId} />
            </Box>
        </Suspense>
    )
}

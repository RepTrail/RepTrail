'use client'

import { Suspense } from 'react'
import { StudentDietManagementSmart } from '@/components/store/advanced/student-diet-management-smart'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentDietSectionProps {
    userId: string
}

export function StudentDietSection({ userId }: StudentDietSectionProps) {
    return (
        <Suspense fallback={
            <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={500} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
            </Surface>
        }>
            <Box suppressHydrationWarning>
                <StudentDietManagementSmart userId={userId} />
            </Box>
        </Suspense>
    )
}

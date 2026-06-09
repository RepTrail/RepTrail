

import { Suspense } from 'react'
import { StudentProgressPageContent } from '@/components/store/advanced/student-progress-content'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentProgressSectionProps {
    userId: string
}

export function StudentProgressSection({ userId }: StudentProgressSectionProps) {
    return (
        <Suspense fallback={
            <Box fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box height={10} width={48} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box height={32} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                        <Box height={32} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                        <Box height={32} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    </Grid>
                </Stack>
            </Box>
        }>
            <StudentProgressPageContent userId={userId} />
        </Suspense>
    )
}

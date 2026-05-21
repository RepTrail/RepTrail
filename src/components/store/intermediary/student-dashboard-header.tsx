'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentDashboardHeaderProps {
    title: string
    dateLabel?: string
    dateValue?: string
}

export function StudentDashboardHeader({
    title = "Resumo Hoje",
    dateLabel = "Hoje",
    dateValue
}: StudentDashboardHeaderProps) {
    // Fallback date if not provided
    const displayDate = dateValue || new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

    return (
        <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'end' }} justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Font
                variant="h1"
                color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
            >
                {title}
            </Font>

            <Box 
                padding={STORE_TOKENS.PADDING.CONTAINER} 
                bg={STORE_TOKENS.COLORS.BACKGROUND} 
                bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND} 
                border 
                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {dateLabel}
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="description" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {displayDate}
                    </Font>
                </Stack>
            </Box>
        </Stack>
    )
}

'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface SectionHeaderProps {
    title: string
    subtitle: string
    icon: LucideIcon
    primaryColor?: string
    rightElement?: React.ReactNode
}

/**
 * SectionHeader: Intermediary molecule for consistent registry section titling.
 * Extracted from RegistrySection to follow strict nesting matrix.
 */
export function SectionHeader({ title, subtitle, icon, primaryColor, rightElement }: SectionHeaderProps) {
    return (
        <Stack 
            direction={{ base: 'col', lg: 'row' }} 
            justify="between" 
            align={{ base: 'start', lg: 'center' }} 
            gap={STORE_TOKENS.SPACING.CONTAINER}
        >
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Icon icon={icon} color={primaryColor as any} size="lg" />
                    <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {title}
                    </Font>
                </Inline>
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                    {subtitle}
                </Font>
            </Stack>
            {rightElement && (
                <Box>
                    {rightElement}
                </Box>
            )}
        </Stack>
    )
}

'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'

interface IdentityBadgeProps {
    label: string
    icon: LucideIcon
    variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber'
    size?: 'sm' | 'md'
}

export function IdentityBadge({
    label,
    icon,
    variant = 'red',
    size = 'md'
}: IdentityBadgeProps) {
    const isSmall = size === 'sm'

    return (
        <Box
            bg="transparent"
            paddingX={isSmall ? 2.5 : 5}
            paddingY={isSmall ? 1.5 : 2.5}
            rounded="full"
            border={variant}
        >
            <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={icon} color={variant} size={isSmall ? "xs" : "sm"} />
                <Font
                    variant={isSmall ? "auxiliary" : "label-caps"}
                    color={variant}
                    weight="black"
                    italic
                    uppercase
                    tracking="widest"
                >
                    {label}
                </Font>
            </Stack>
        </Box>
    )
}

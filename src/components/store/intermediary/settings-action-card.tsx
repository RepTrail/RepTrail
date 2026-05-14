'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button, ButtonVariant } from '@/components/store/base/button'
import { Surface, SurfaceVariant } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { BoxColor } from '@/components/store/base/box'

interface SettingsActionCardProps {
    icon: any
    color: BoxColor
    surfaceVariant?: SurfaceVariant
    buttonVariant: ButtonVariant
    title: string
    subtitle: string
    actionLabel: string
    onAction: () => void
    disabled?: boolean
    isLoading?: boolean
    children?: React.ReactNode // For cases like the custom content inside Button
}

/**
 * SettingsActionCard: A standardized action block for settings and management menus.
 * Automatically handles responsive layout: stacked on mobile, row on desktop.
 */
export function SettingsActionCard({
    icon,
    color,
    surfaceVariant,
    buttonVariant,
    title,
    subtitle,
    actionLabel,
    onAction,
    disabled = false,
    isLoading = false,
    children
}: SettingsActionCardProps) {
    // Determine tonal variant if not provided
    const resolvedSurfaceVariant = surfaceVariant || (`tonal-${color}` as SurfaceVariant)
    
    // Type safe colors for Font and Icon
    const safeColor = color === 'zinc' ? 'zinc-400' : (color === 'transparent' ? 'foreground' : color) as any

    return (
        <Surface variant={resolvedSurfaceVariant} padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'start', lg: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    <Box bg={color} bgOpacity={20} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                        <Icon icon={icon} color={safeColor} size="md" />
                    </Box>
                    <Stack flex1 gap={0}>
                        <Font variant="body" weight="black" uppercase italic color={safeColor}>{title}</Font>
                        <Font variant="sub-tiny" weight="bold" color={safeColor} opacity={70}>{subtitle}</Font>
                    </Stack>
                </Stack>
                <Button 
                    variant={buttonVariant} 
                    size="sm" 
                    fullWidth={{ base: true, lg: false }}
                    onClick={onAction}
                    disabled={disabled}
                    loading={isLoading}
                >
                    {children || (
                        <Font variant="body-sm" weight="black" uppercase italic>{actionLabel}</Font>
                    )}
                </Button>
            </Stack>
        </Surface>
    )
}

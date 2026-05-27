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
    actionIcon?: any
    disabled?: boolean
    isLoading?: boolean
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
    actionIcon,
    disabled = false,
    isLoading = false
}: SettingsActionCardProps) {
    // Determine tonal variant if not provided
    const resolvedSurfaceVariant = surfaceVariant || (`tonal-${color}` as SurfaceVariant)
    
    // Type safe colors for Font and Icon
    const safeColor = color === 'zinc' ? 'zinc-400' : (color === 'transparent' ? 'foreground' : color) as any

    const ActionIcon = actionIcon

    return (
        <Surface variant={resolvedSurfaceVariant} padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'start', lg: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER} flex1>
                    <Box bg={color} bgOpacity={STORE_TOKENS.OPACITY.MEDIUM} padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.FULL}>
                        <Icon icon={icon} color={safeColor} size="md" />
                    </Box>
                    <Stack flex1 gap={STORE_TOKENS.SPACING.NONE}>
                        <Font
                            variant="body"
                            weight="black"
                            uppercase
                            italic
                            {...{
                                color: safeColor,
                            }}>{title}</Font>
                        <Font
                            variant="sub-tiny"
                            weight="bold"
                            opacity={STORE_TOKENS.OPACITY.OVERLAY}
                            {...{
                                color: safeColor,
                            }}>{subtitle}</Font>
                    </Stack>
                </Stack>
                <Button 
                    variant={buttonVariant} 
                    size="sm" 
                    fullWidth={{ base: true, lg: false }}
                    shrink={0}
                    onClick={onAction}
                    disabled={disabled}
                    loading={isLoading}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    {ActionIcon && (
                        <ActionIcon
                            size={16}
                            strokeWidth={2.5}
                            {...{
                                className: "shrink-0",
                            }} />
                    )}
                    {actionLabel}
                </Button>
            </Stack>
        </Surface>
    );
}

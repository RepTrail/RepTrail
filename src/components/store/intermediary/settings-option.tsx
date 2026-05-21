'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LucideIcon, ChevronRight } from 'lucide-react'

interface SettingsOptionProps {
    title: string
    subtitle: string
    icon: LucideIcon
    variant?: 'zinc' | 'emerald' | 'blue' | 'amber' | 'red' | 'orange'
    onClick?: () => void
    rightIcon?: LucideIcon
    badge?: string
    disabled?: boolean
    children?: React.ReactNode // For Switch, etc.
}

export function SettingsOption({
    title,
    subtitle,
    icon,
    variant = 'zinc',
    onClick,
    rightIcon = ChevronRight,
    badge,
    disabled = false,
    children
}: SettingsOptionProps) {
    // Map variants to specific tonal backgrounds if needed, or use the base Surface variant.
    // For specific colors we can use tonal-<color>.
    const surfaceVariant = variant === 'zinc' ? 'glass' : `tonal-${variant}` as any

    const content = (
        <Surface 
            variant={surfaceVariant} 
            padding={STORE_TOKENS.PADDING.ELEMENT} 
            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
            border={variant === 'zinc' ? 'subtle' : 'none'}
            fullWidth
            textAlign="left"
            transition
            group
            cursor={onClick && !disabled ? 'pointer' : 'default'}
            activeScale={onClick && !disabled ? 95 : undefined}
            opacity={disabled ? 60 : undefined}
            onClick={disabled ? undefined : onClick}
        >
            <Stack direction="row" align="center" justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                    <Box 
                        padding={STORE_TOKENS.PADDING.ELEMENT} 
                        bg={variant} 
                        bgOpacity={10} 
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    >
                        <Icon icon={icon} size="sm" color={variant === 'zinc' ? 'zinc-400' : variant} />
                    </Box>
                    <Stack gap="none" flex1>
                        <Font variant="body-sm" weight="black" color={variant === 'zinc' ? 'white' : variant} uppercase italic tracking="tight">
                            {title}
                        </Font>
                        <Font variant="sub-tiny" color={variant === 'zinc' ? 'zinc-500' : variant} opacity={variant === 'zinc' ? 100 : 70} weight="bold" uppercase tracking="widest">
                            {subtitle}
                        </Font>
                    </Stack>
                </Stack>
                
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {badge && (
                        <Box padding="element" bg={variant} bgOpacity={10} border borderColor={`${variant}/20`} rounded={STORE_TOKENS.RADIUS.FULL}>
                            <Font variant="sub-tiny" weight="black" color={variant} uppercase>{badge}</Font>
                        </Box>
                    )}
                    {children ? (
                        children
                    ) : onClick ? (
                        <Icon 
                            icon={rightIcon} 
                            size="sm" 
                            color={variant === 'zinc' ? 'zinc-600' : variant} 
                            className={`transition-colors ${!disabled && 'group-hover:text-current group-hover:translate-x-1'}`}
                        />
                    ) : null}
                </Stack>
            </Stack>
        </Surface>
    )

    // Render as a div or button based on if it has an onClick handler and is not meant to be a wrapper for a switch
    if (onClick && !children) {
        return (
            <button type="button" onClick={disabled ? undefined : onClick} className="w-full" disabled={disabled}>
                {content}
            </button>
        )
    }

    return content
}

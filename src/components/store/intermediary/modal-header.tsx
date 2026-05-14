'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon, IconBox } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { CardHeader } from '@/components/store/base/surface'
import { X, LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ModalHeaderProps {
    title: string
    subtitle?: string
    icon?: LucideIcon
    variant?: 'emerald' | 'orange' | 'red' | 'blue' | 'primary'
    isLoading?: boolean
    onClose: () => void
}

/**
 * ModalHeader: Intermediary molecule for consistent modal titling.
 * Extracted from Modal to fulfill strict Store Architecture rules.
 * Handles responsive display of titles and icon boxes.
 */
export function ModalHeader({ title, subtitle, icon, variant, isLoading, onClose }: ModalHeaderProps) {
    return (
        <CardHeader 
            bg={STORE_TOKENS.COLORS.BACKGROUND} 
            bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND} 
            shrink={0} 
            gap={STORE_TOKENS.SPACING.CONTAINER} 
            direction="col"
        >
            <Stack direction="row" align="center" justify="between" fullWidth>
                {icon && <IconBox icon={icon} variant={variant as any} />}
                
                {/* Desktop Title */}
                <Box display={{ base: 'none', md: 'flex' }} flex1 padding={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack gap={0}>
                        <Font variant="body" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic tracking="normal">{title}</Font>
                        {subtitle && <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{subtitle}</Font>}
                    </Stack>
                </Box>

                <Button variant="close" rounded={STORE_TOKENS.RADIUS.SYSTEM} isIconOnly onClick={onClose} disabled={isLoading}>
                    <Icon icon={X} size="sm" />
                </Button>
            </Stack>

            {/* Mobile Title */}
            <Box display={{ base: 'flex', md: 'none' }} fullWidth>
                <Stack gap={0}>
                    <Font variant="body" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic tracking="normal">{title}</Font>
                    {subtitle && <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{subtitle}</Font>}
                </Stack>
            </Box>
        </CardHeader>
    )
}

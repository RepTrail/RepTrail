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
import { Inline } from '@/components/store/base/layout'

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
            shrink={0}
            {...{
                bg: STORE_TOKENS.COLORS.BACKGROUND,
                bgOpacity: STORE_TOKENS.OPACITY.BACKGROUND,
            }}>
            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="between" fullWidth>
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" flex1>
                    {icon && <IconBox icon={icon} variant={variant as any} />}
                    <Stack gap={STORE_TOKENS.SPACING.NONE} flex1>
                        <Font
                            variant="body"
                            weight="black"
                            uppercase
                            italic
                            tracking="normal"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>{title}</Font>
                        {subtitle && <Font
                            variant="sub-tiny"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>{subtitle}</Font>}
                    </Stack>
                </Inline>

                <Box display={{ base: 'none', md: 'block' }}>
                    <Button variant="close" rounded={STORE_TOKENS.RADIUS.SYSTEM} isIconOnly onClick={onClose} disabled={isLoading}>
                        <Icon icon={X} size="sm" />
                    </Button>
                </Box>
            </Inline>
        </CardHeader>
    );
}

'use client'
import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { IconBox, Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { Lock } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Box } from '@/components/store/base/box'

interface PremiumLockOverlayProps {
    variant?: 'area' | 'button'
    title?: string
    description?: string
    locked: boolean
    children: React.ReactNode
}

export function PremiumLockOverlay({
    variant = 'area',
    title = 'Recurso Premium',
    description = 'Faça upgrade no seu plano para acessar.',
    locked,
    children
}: PremiumLockOverlayProps) {
    if (!locked) return <>{children}</>

    // Detects if children resolves to anything meaningful (e.g., skips false, null, undefined)
    const hasChildren = React.Children.toArray(children).some(child => !!child)

    return (
        <Box position="relative" fullWidth fullHeight={hasChildren ? true : undefined} display="flex" direction="col" overflow="hidden" flex1>
            {/* O conteúdo original garante o layout, mas fica 100% invisível para não vazar */}
            {hasChildren && (
                <Box fullWidth fullHeight pointerEvents="none" opacity={STORE_TOKENS.OPACITY.NONE} flex1>
                    {children}
                </Box>
            )}

            {/* Overlay */}
            <GlassPanel
                variant="tonal-red"
                position={hasChildren ? 'absolute' : 'relative'}
                pin={hasChildren ? 'inset' : undefined}
                zIndex={10}
                display="flex"
                direction={variant === 'area' ? 'col' : 'row'}
                align="center"
                justify="center"
                padding={variant === 'area' ? STORE_TOKENS.PADDING.EMPTY_STATE : STORE_TOKENS.PADDING.ELEMENT}
                backdropBlur="sm"
                fullWidth
                fullHeight
            >
                {variant === 'area' ? (
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center">
                        <IconBox icon={Lock} variant="red" size="md" rounded={STORE_TOKENS.RADIUS.FULL} />
                        <Stack gap={STORE_TOKENS.SPACING.NONE} align="center">
                            <Font variant="heading" weight="black" uppercase italic color="red">{title}</Font>
                            <Font variant="description" color="zinc-400">{description}</Font>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Lock} size="sm" color="red" />
                        <Font variant="body-sm" weight="bold" color="red">{title}</Font>
                    </Stack>
                )}
            </GlassPanel>
        </Box>
    )
}

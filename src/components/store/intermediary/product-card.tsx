'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { GlassPanel } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Badge } from '@/components/store/base/badge'
import { Img } from '@/components/store/base/img'
import { ShoppingBag, Edit3, Trash2, Power } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'


interface ProductCardProps {
    name: string
    price: string
    category: string
    description?: string
    image?: string
    isActive?: boolean
    onToggleActive?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export function ProductCard({
    name,
    price,
    category,
    description,
    image,
    isActive = true,
    onToggleActive,
    onEdit,
    onDelete
}: ProductCardProps) {
    let cleanedName = name.replace(/&amp;/gi, '&').replace(/&amp;/gi, '&')
    cleanedName = cleanedName.replace(/\s*-\s*R\$\s*\d+([.,]\d+)?\s*$/i, '')

    return (
        <GlassPanel
            padding="none"
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            overflow="hidden"
            group
            transition
            fullHeight
            display="flex"
            direction="col"
        >
            {/* Product Image - Aspect Ratio 1:1 */}
            <Box position="relative" fullWidth bg={STORE_TOKENS.COLORS.BLACK} overflow="hidden" aspectRatio="square">
                <Img
                    src={image || ''}
                    alt={cleanedName}
                    fallbackIcon={ShoppingBag}
                    fullWidth
                    fullHeight
                    objectFit="cover"
                    hoverScale={110}
                    transition
                />

                {/* Category Badge - Standard Component */}
                <Box position="absolute">
                    <Badge
                        label={category}
                        variant="outline"
                        color="orange"
                        size="sm"
                    />
                </Box>

                {/* Quick Actions (Hover Overlay) */}
                <Box
                    position="absolute"
                    pin="inset"
                    display="none"
                    groupHoverDisplay="flex"
                    align="center"
                    justify="center"
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                    bg={STORE_TOKENS.COLORS.BLACK}
                    bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                    backdropBlur="sm"
                    transition
                    zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                >
                    <Button variant="outline-blue" size="sm" rounded={STORE_TOKENS.RADIUS.FULL} isIconOnly onClick={onEdit}>
                        <Edit3 size={14} />
                    </Button>
                    <Button variant="outline-red" size="sm" rounded={STORE_TOKENS.RADIUS.FULL} isIconOnly onClick={onDelete}>
                        <Trash2 size={14} />
                    </Button>
                </Box>
            </Box>
            {/* Product Info - Refined Typography */}
            <Stack padding={STORE_TOKENS.PADDING.CONTAINER} gap={STORE_TOKENS.SPACING.ELEMENT} flex1 justify="between">
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="body-sm"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {cleanedName}
                    </Font>
                    {description && (
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
                            lineClamp={2}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {description}
                        </Font>
                    )}
                    <Box padding="element">
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                            variant="heading"
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }}>
                            {price}
                        </Font>
                    </Box>
                </Stack>

                {/* Action Button - Toggle State */}
                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Button
                        variant={isActive ? 'outline-emerald' : 'outline-red'}
                        size="sm"
                        fullWidth
                        onClick={onToggleActive}
                    >
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Power size={12} />
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>
                                {isActive ? 'Ativado' : 'Desativado'}
                            </Font>
                        </Inline>
                    </Button>
                </Box>
            </Stack>
        </GlassPanel>
    );
}

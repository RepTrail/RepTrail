'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { ShieldCheck, Star, ExternalLink, ShoppingBag } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Badge } from '@/components/store/base/badge'
import { Img } from '@/components/store/base/img'
import { GlassPanel } from '@/components/store/base/surface'

export interface StoreProductCardProps {
    id: string
    name: string
    description: string
    category: string
    price: number
    rating: number
    reviewsCount: number
    imageUrl: string
    linkUrl?: string
    onBuy?: () => void
}

export function StoreProductCard({
    id,
    name,
    description,
    category,
    price,
    rating,
    reviewsCount,
    imageUrl,
    linkUrl,
    onBuy
}: StoreProductCardProps) {
    const isOriginal = true

    return (
        <GlassPanel
            padding={0}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass-diagonal"
            transition
            position="relative"
            fullHeight
            display="flex"
            direction="col"
            group
            overflow="hidden"
        >
            {/* Top Badge Overlay */}
            <Box position="absolute" top={12} left={12} zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}>
                <Badge
                    label={category || 'OFERTA'}
                    color="orange"
                    variant="glass"
                    size="sm"
                />
            </Box>
            {/* Image Area: Square & Centered */}
            <Box
                position="relative"
                display="flex"
                align="center"
                justify="center"
                bg={STORE_TOKENS.COLORS.WHITE}
                bgOpacity={5}
                aspectRatio="square"
                overflow="hidden"
                shrink={0}
            >
                <Img
                    src={imageUrl}
                    alt={name}
                    fallbackIcon={ShoppingBag}
                    fullWidth
                    fullHeight
                    objectFit="contain"
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    transition
                />
            </Box>
            {/* Content Area: Structured for Symmetry */}
            <Stack 
                padding={STORE_TOKENS.PADDING.CONTAINER} 
                flex1 
                justify="between"
                gap={STORE_TOKENS.SPACING.CONTAINER}
            >
                {/* Header Information */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} lineClamp={2} uppercase weight="black" tracking="tight">
                        {name}
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION} variant="tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} lineClamp={2}>
                        {description}
                    </Font>
                </Stack>

                {/* Footer Actions & Price */}
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" justify="between" align="end">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {isOriginal && (
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Icon icon={ShieldCheck} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                    <Font variant="tiny" weight="black" uppercase color={STORE_TOKENS.COLORS.SUCCESS}>
                                        Original
                                    </Font>
                                </Stack>
                            )}
                            <Stack direction="row" align="baseline" gap={2.5}>
                                <Font variant="sub-tiny" weight="bold" color={STORE_TOKENS.COLORS.TEXT.MUTED}>R$</Font>
                                <Font variant="h3" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} tracking="tight">
                                    {Math.floor(price)}
                                </Font>
                                <Font variant="tiny" weight="bold" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                    ,{(price % 1 || 0).toFixed(2).split('.')[1]}
                                </Font>
                            </Stack>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="end">
                            <Stack direction="row" gap={2.5}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Icon key={i} icon={Star} size="xs" color={i <= Math.round(rating) ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.DIM} />
                                ))}
                            </Stack>
                            <Font variant="tiny" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {rating.toFixed(1)} <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>/ 5.0</Font>
                            </Font>
                        </Stack>
                    </Stack>

                    <Button variant="emerald" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} onClick={onBuy}>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="label-caps" color={STORE_TOKENS.COLORS.BLACK}>COMPRAR AGORA</Font>
                        <Icon icon={ExternalLink} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                    </Button>
                </Stack>
            </Stack>
        </GlassPanel>
    );
}

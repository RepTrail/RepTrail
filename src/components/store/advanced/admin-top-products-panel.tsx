'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTopProductsByClicks } from '@/lib/dal/remote'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { ShoppingBag, MousePointer2 } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Img } from '@/components/store/base/img'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AdminTopProductsPanel: Manages the logic for fetching and displaying top products.
 * - Handles the ranking logic and responsive rendering.
 * - Encapsulates the visual complexity of product cards.
 * - Follows "Zero-Manual-Styling" governance by avoiding arbitrary Tailwind classes.
 */
export function AdminTopProductsPanel() {
    const { data: topProducts = [], isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.admin.overview, 'top-products'],
        queryFn: () => getTopProductsByClicks()
    })

    if (isLoading) {
        return <EmptyState icon={ShoppingBag} title="Carregando..." description="Buscando estatísticas de cliques." />
    }

    if (topProducts.length === 0) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Nenhum Clique"
                description="Ainda não há registros de cliques nos produtos da loja."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {topProducts.map((product: any, index: number) => (
                <GlassPanel
                    key={product.id}
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    display="flex"
                    direction="col"
                    justify="center"
                    gap={STORE_TOKENS.SPACING.CONTAINER}
                    transition
                    group
                    hoverBg={STORE_TOKENS.COLORS.WHITE}
                    hoverBgOpacity={STORE_TOKENS.OPACITY.LOW}
                >
                    <Stack direction="row" align="center" justify="between" fullWidth>
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                            {/* Rank Badge - Circular & Centered */}
                            <Box
                                width="auto"
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                bg={!index ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.WHITE}
                                bgOpacity={!index ? STORE_TOKENS.OPACITY.MEDIUM : STORE_TOKENS.OPACITY.LOW}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                                display="flex"
                                align="center"
                                justify="center"
                                minWidth={40}
                                minHeight={40}
                            >
                                <Font
                                    variant="label-caps"
                                    color={!index ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.TEXT.SECONDARY}
                                >
                                    #{index + 1}
                                </Font>
                            </Box>

                            {/* Product Image */}
                            <Box
                                bg={STORE_TOKENS.COLORS.BLACK}
                                width={48}
                                height={48}
                                overflow="hidden"
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                {product.image_url ? (
                                    <Img
                                        src={product.image_url}
                                        alt={product.name}
                                        fullWidth
                                        fullHeight
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Stack fullHeight align="center" justify="center">
                                        <Icon icon={ShoppingBag} size="sm" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                    </Stack>
                                )}
                            </Box>

                            {/* Desktop Only: Product Name & Badge */}
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} display={{ base: 'none', md: 'flex' }}>
                                <Font weight="black" italic uppercase variant="body">
                                    {product.name}
                                </Font>
                                <Box width="auto">
                                    <Badge
                                        label={product.category}
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.BRAND}
                                        size="sm"
                                    />
                                </Box>
                            </Stack>
                        </Stack>

                        {/* Clicks Metric (Always on the right of the top row) */}
                        <Stack align="end" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={MousePointer2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                <Font
                                    weight="black"
                                    variant="heading"
                                    {...{
                                        color: STORE_TOKENS.COLORS.SUCCESS,
                                    }}>
                                    {product.clicks}
                                </Font>
                            </Stack>
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                Cliques
                            </Font>
                        </Stack>
                    </Stack>

                    {/* Mobile Only: Product Name & Badge */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} display={{ base: 'flex', md: 'none' }}>
                        <Font weight="black" italic uppercase variant="body">
                            {product.name}
                        </Font>
                        <Box width="auto">
                            <Badge
                                label={product.category}
                                variant="glass"
                                color={STORE_TOKENS.COLORS.BRAND}
                                size="sm"
                            />
                        </Box>
                    </Stack>
                </GlassPanel>
            ))}
        </Stack>
    );
}

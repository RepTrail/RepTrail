'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTopProductsByClicks } from '@/actions/admin-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { ShoppingBag, MousePointer2, TrendingUp } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Img } from '@/components/store/base/img'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'


export function AdminTopProducts() {
    const { data: topProducts = [], isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.admin.overview, 'top-products'],
        queryFn: () => getTopProductsByClicks()
    })

    return (
        <RegistrySection
            title="Produtos Mais Clicados"
            subtitle="Engajamento de alunos com produtos da loja RepTrail."
            icon={TrendingUp}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {isLoading ? (
                    <EmptyState icon={ShoppingBag} title="Carregando..." description="Buscando estatísticas de cliques." />
                ) : topProducts.length === 0 ? (
                    <EmptyState
                        icon={ShoppingBag}
                        title="Nenhum Clique"
                        description="Ainda não há registros de cliques nos produtos da loja."
                    />
                ) : (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {!isLoading && topProducts.map((product: any, index: number) => (
                            <GlassPanel
                                key={product.id}
                                padding={STORE_TOKENS.PADDING.CONTAINER}
                                display="flex"
                                direction="col"
                                justify="center"
                                gap={STORE_TOKENS.SPACING.CONTAINER}
                                transition
                                group
                                hoverBg="white"
                                hoverBgOpacity={5}
                            >
                                <Stack direction="row" align="center" justify="between" fullWidth>
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        {/* Rank Badge - Circular & Centered */}
                                        <Box
                                            width="auto"
                                            padding={STORE_TOKENS.PADDING.ELEMENT}
                                            bg={index === 0 ? 'amber' : 'white'}
                                            bgOpacity={index === 0 ? 20 : 5}
                                            rounded={STORE_TOKENS.RADIUS.FULL}
                                            display="flex"
                                            align="center"
                                            justify="center"
                                            minWidth={40}
                                            minHeight={40}
                                        >
                                            <Font variant="label-caps" color={index === 0 ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.TEXT.SECONDARY}>
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
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} className="hidden md:flex">
                                            <Font weight="black" italic uppercase variant="body">
                                                {product.name}
                                            </Font>
                                            <Box width="auto">
                                                <Badge
                                                    label={product.category}
                                                    variant="glass"
                                                    color="orange"
                                                    size="sm"
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    {/* Clicks Metric (Always on the right of the top row) */}
                                    <Stack align="end" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                            <Icon icon={MousePointer2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                            <Font weight="black" variant="heading" color={STORE_TOKENS.COLORS.SUCCESS}>
                                                {product.clicks}
                                            </Font>
                                        </Stack>
                                        <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                            Cliques
                                        </Font>
                                    </Stack>
                                </Stack>

                                {/* Mobile Only: Product Name & Badge */}
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} className="md:hidden">
                                    <Font weight="black" italic uppercase variant="body">
                                        {product.name}
                                    </Font>
                                    <Box width="auto">
                                        <Badge
                                            label={product.category}
                                            variant="glass"
                                            color="orange"
                                            size="sm"
                                        />
                                    </Box>
                                </Stack>
                            </GlassPanel>
                        ))}
                    </Stack>
                )}
            </Stack>
        </RegistrySection>
    )
}

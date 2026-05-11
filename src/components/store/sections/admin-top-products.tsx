'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTopProductsByClicks } from '@/actions/admin-actions'
import { RegistrySection } from '../advanced/registry-section'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Badge } from '../base/badge'
import { GlassPanel } from '../base/surface'
import { ShoppingBag, MousePointer2, TrendingUp } from 'lucide-react'
import { EmptyState } from '../intermediary/empty-state'

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
            <Stack gap={5}>
                {isLoading ? (
                    <EmptyState icon={ShoppingBag} title="Carregando..." description="Buscando estatísticas de cliques." />
                ) : topProducts.length === 0 ? (
                    <EmptyState 
                        icon={ShoppingBag} 
                        title="Nenhum Clique" 
                        description="Ainda não há registros de cliques nos produtos da loja." 
                    />
                ) : (
                    <Stack gap={5}>
                        {topProducts.map((product, index) => (
                            <GlassPanel 
                                key={product.id}
                                padding={5}
                                display="flex"
                                align="center"
                                justify="between"
                                gap={5}
                                transition
                                group
                                hoverBg="white"
                                hoverBgOpacity={5}
                            >
                                <Stack direction="row" gap={5} align="center" flex1>
                                    {/* Rank Badge - Circular & Centered */}
                                    <Box 
                                        width="auto" 
                                        padding={2.5}
                                        bg={index === 0 ? 'amber' : 'white'} 
                                        bgOpacity={index === 0 ? 20 : 5}
                                        rounded="full"
                                        display="flex"
                                        align="center"
                                        justify="center"
                                        style={{ minWidth: 40, minHeight: 40 }}
                                    >
                                        <Font variant="label-caps" color={index === 0 ? 'amber' : 'zinc-400'}>
                                            #{index + 1}
                                        </Font>
                                    </Box>

                                    {/* Product Info */}
                                    <Stack direction="row" gap={5} align="center">
                                        <Box 
                                            width="auto" 
                                            overflow="hidden" 
                                            rounded="system" 
                                            bg="black"
                                            style={{ width: 48, height: 48 }}
                                        >
                                            {product.image_url ? (
                                                <Box 
                                                    as="img"
                                                    src={product.image_url} 
                                                    alt={product.name} 
                                                    fullWidth
                                                    fullHeight
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Stack fullHeight align="center" justify="center">
                                                    <ShoppingBag size={20} className="text-zinc-700" />
                                                </Stack>
                                            )}
                                        </Box>
                                        <Stack gap={1}>
                                            <Font weight="black" italic uppercase variant="body">
                                                {product.name}
                                            </Font>
                                            <Badge 
                                                label={product.category} 
                                                variant="glass" 
                                                color="orange" 
                                                size="sm" 
                                                rounded="full" 
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>

                                {/* Clicks Metric */}
                                <Stack align="end" gap={1}>
                                    <Stack direction="row" gap={2.5} align="center">
                                        <MousePointer2 size={14} className="text-emerald" />
                                        <Font weight="black" variant="heading" color="emerald">
                                            {product.clicks}
                                        </Font>
                                    </Stack>
                                    <Font variant="label-caps" color="zinc-500">
                                        Cliques
                                    </Font>
                                </Stack>
                            </GlassPanel>
                        ))}
                    </Stack>
                )}
            </Stack>
        </RegistrySection>
    )
}

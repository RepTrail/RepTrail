'use client'

import React, { useState } from 'react'
import { useQuery } from '@/lib/dal'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Input } from '@/components/store/base/input'
import { StoreHeroCard } from '@/components/store/intermediary/store-hero-card'
import { StoreProductCard } from '@/components/store/intermediary/store-product-card'
import { ShoppingBag, Search } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { FormSelect } from '@/components/store/base/form-select'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStoreProducts, logProductClick } from '@/lib/dal/remote'

/**
 * MarketplaceSectionContent: The composite content for the Marketplace & Performance section.
 * Fully data-driven via React Query + getStoreProducts action.
 */
export function MarketplaceSectionContent() {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')

    const { data: products = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.store.products,
        queryFn: getStoreProducts,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

    const categories = React.useMemo(() => {
        if (!products.length) return [{ label: 'TODAS AS CATEGORIAS', value: 'ALL' }]
        const cats = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))
        return [
            { label: 'TODAS AS CATEGORIAS', value: 'ALL' },
            ...cats.map((c: any) => ({ label: String(c).toUpperCase(), value: String(c) }))
        ]
    }, [products])

    const filtered = products.filter((p: any) => {
        const q = search.toLowerCase()
        const matchesSearch = p.name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory
        
        return matchesSearch && matchesCategory
    })

    function handleBuy(product: any) {
        if (product.link_url) window.open(product.link_url, '_blank')
        logProductClick(product.id)
    }

    if (isLoading) {
        return <EmptyState icon={ShoppingBag} title="CARREGANDO..." description="BUSCANDO OS PRODUTOS DA LOJA." />
    }

    if (filtered.length === 0 && !isLoading) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="LOJA INDISPONÍVEL"
                description={search ? 'NENHUM PRODUTO ENCONTRADO PARA SUA BUSCA.' : 'NÃO HÁ PRODUTOS DISPONÍVEIS NO MOMENTO.'}
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
            <StoreHeroCard />
            {/* Search + Category Filter block */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box 
                    display="flex" 
                    direction={{ base: 'col', md: 'row' }} 
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                    fullWidth
                    align="center"
                >
                    <Box width={{ base: 'full', md: '70%' }}>
                        <Input
                            placeholder="Buscar por nome, descrição ou categoria..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            icon={<Search
                                {...{
                                    className: "w-4 h-4",
                                }} />}
                        />
                    </Box>
                    <Box width={{ base: 'full', md: '30%' }}>
                        <FormSelect
                            options={categories}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="CATEGORIAS"
                        />
                    </Box>
                </Box>

                {filtered.length === 0 ? (
                    <EmptyState
                        icon={ShoppingBag}
                        title="NENHUM RESULTADO"
                        description="NENHUM PRODUTO ENCONTRADO PARA SUA BUSCA."
                    />
                ) : (
                    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {filtered.map((product: any) => (
                            <StoreProductCard
                                key={product.id}
                                id={String(product.id)}
                                name={product.name}
                                description={product.description || ''}
                                category={product.category || 'OFERTA'}
                                price={product.official_price || 0}
                                rating={product.rating || 5}
                                reviewsCount={product.reviews_count || 0}
                                imageUrl={product.image_url || ''}
                                linkUrl={product.link_url}
                                onBuy={() => handleBuy(product)}
                            />
                        ))}
                    </Grid>
                )}
            </Stack>
        </Stack>
    );
}

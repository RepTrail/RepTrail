'use client'

import { useState } from 'react'
import { getStoreProducts, logProductClick } from '@/actions/store-actions'
import {
    ShoppingBag,
    ExternalLink,
    Search,
    Star,
    ShieldCheck,
    Tag
} from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Badge } from '@/components/store/base/badge'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Img } from '@/components/store/base/img'
import { Separator } from '@/components/store/base/separator'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default function StoreExplorePage() {
    const pathname = usePathname()
    const isTrainer = pathname.includes('/dashboard/trainer')
    const backPath = isTrainer ? '/dashboard/trainer/loja' : '/dashboard/student/loja'

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<string | null>(null)
    const [subCategory, setSubCategory] = useState<string | null>(null)

    const { data: products = [], isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.store.products,
        queryFn: getStoreProducts,
    })

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    const supplementsSub = ['Pré-treino', 'Vitaminas', 'Whey', 'Outros']

    const filteredProducts = products.filter(p => {
        const pName = p.name?.toLowerCase() || ''
        const pDesc = p.description?.toLowerCase() || ''
        const sTerm = search.toLowerCase()

        const matchesSearch = pName.includes(sTerm) || pDesc.includes(sTerm)
        const matchesCategory = !category || p.category === category
        const matchesSub = !subCategory || p.sub_category === subCategory || (category === 'Suplemento' && subCategory === 'Outros' && !p.sub_category)

        return matchesSearch && matchesCategory && matchesSub
    })

    function handleBuy(product: any) {
        window.open(product.link_url, '_blank')
        logProductClick(product.id)
    }

    return (
        <RegistryMain
            title="EXPLORAR COLEÇÃO"
            subtitle="Explore nossa curadoria de produtos originais RepTrail Performance."
            icon="ShoppingBag"
            showTabs={false}
            backPath={backPath}
        >
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                    {/* Search & Filters Panel */}
                    <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} width="full" justify="end" align="center">
                        <Box width={{ base: 'full', md: 'auto' }} minWidth={240}>
                            <Input
                                icon={<Icon icon={Search} />}
                                placeholder="Pesquisar na coleção..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </Box>
                        <Stack direction={{ base: 'row', md: 'col' }} gap={STORE_TOKENS.SPACING.ELEMENT} width={{ base: 'full', md: 'auto' }}>
                            <FormSelect
                                options={[
                                    { label: 'Todas as Categorias', value: '' },
                                    ...categories.map(cat => ({ label: cat, value: cat }))
                                ]}
                                value={category || ''}
                                placeholder="Categorias"
                                onChange={val => {
                                    setCategory(val || null)
                                    setSubCategory(null)
                                }}
                            />

                            {category === 'Suplemento' && (
                                <FormSelect
                                    options={[
                                        { label: 'Todos os Tipos', value: '' },
                                        ...supplementsSub.map(sub => ({ label: sub, value: sub }))
                                    ]}
                                    value={subCategory || ''}
                                    placeholder="Tipo"
                                    onChange={val => setSubCategory(val || null)}
                                />
                            )}
                        </Stack>
                    </Stack>

                    {/* Results Count Header */}
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Tag} color={STORE_TOKENS.COLORS.BRAND} />
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                            {filteredProducts.length} itens encontrados
                        </Font>
                    </Stack>

                    {/* Products Grid */}
                    <Grid cols={1} mdCols={2} lgCols={3} xlCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {!loading && filteredProducts.map(product => (
                            <Surface
                                key={product.id}
                                variant="tonal-zinc"
                                border="standard"
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                position="relative"
                                display="flex"
                                direction="col"
                                overflow="hidden"
                            >
                                {/* High Contrast Badge */}
                                <Box position="absolute" top={STORE_TOKENS.SPACING.ELEMENT} left={STORE_TOKENS.SPACING.ELEMENT} zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}>
                                    <Badge
                                        label={(product.sub_category || product.category || 'PRODUTO').toUpperCase()}
                                        variant="glass"
                                        color={STORE_TOKENS.COLORS.BRAND}
                                        size="sm"
                                    />
                                </Box>

                                {/* Image Section */}
                                <Box
                                    height={280}
                                    width="full"
                                    bg={STORE_TOKENS.COLORS.BACKGROUND}
                                    bgOpacity={STORE_TOKENS.OPACITY.LOW}
                                    align="center"
                                    justify="center"
                                    overflow="hidden"
                                    position="relative"
                                    padding={STORE_TOKENS.PADDING.ELEMENT}
                                >
                                    <Img
                                        src={product.image_url || 'https://via.placeholder.com/200'}
                                        alt={product.name}
                                        objectFit="contain"
                                        fullWidth
                                        fullHeight
                                        transition
                                        hoverScale={110}
                                    />
                                </Box>

                                <Separator />

                                {/* Card Details */}
                                <Box padding={STORE_TOKENS.PADDING.CONTAINER} flex1>
                                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font variant="heading" weight="black" uppercase italic truncate>
                                                {product.name}
                                            </Font>
                                            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED} truncate>
                                                {product.description}
                                            </Font>
                                        </Stack>

                                        <Separator />

                                        <Stack direction="row" align="center" justify="between" fullWidth>
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Icon icon={ShieldCheck} color={STORE_TOKENS.COLORS.SUCCESS} size="xs" />
                                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.SUCCESS} weight="black" uppercase tracking="widest">
                                                        Original & Lacrado
                                                    </Font>
                                                </Stack>
                                                <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                                                        R$
                                                    </Font>
                                                    <Font variant="heading" weight="black" uppercase italic>
                                                        {Math.floor(product.official_price || 0)}
                                                    </Font>
                                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                                                        ,{(product.official_price % 1 || 0).toFixed(2).split('.')[1]}
                                                    </Font>
                                                </Stack>
                                            </Stack>

                                            <Stack align="end" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Icon key={i} icon={Star} color={STORE_TOKENS.COLORS.BRAND} size="xs" />
                                                    ))}
                                                </Stack>
                                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                                    4.9/5.0
                                                </Font>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            onClick={() => handleBuy(product)}
                                            variant="primary"
                                            fullWidth
                                            gap={STORE_TOKENS.SPACING.ELEMENT}
                                        >
                                            Comprar Agora
                                            <Icon icon={ExternalLink} />
                                        </Button>
                                    </Stack>
                                </Box>
                            </Surface>
                        ))}
                    </Grid>

                    {/* Empty State */}
                    {!loading && filteredProducts.length === 0 && (
                        <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} textAlign="center" fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.FULL} border="standard">
                                    <Icon icon={ShoppingBag} color={STORE_TOKENS.COLORS.TEXT.DIM} size="xl" />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="heading" weight="black" uppercase italic>
                                        Nenhum produto encontrado
                                    </Font>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest" maxWidth="xs" alignSelf="center">
                                        Tente mudar os filtros ou o termo de busca.
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>
                    )}
                </Stack>
            </Box>
        </RegistryMain>
    );
}

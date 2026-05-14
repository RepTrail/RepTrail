'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { StoreHeroCard } from '@/components/store/intermediary/store-hero-card'
import { StoreProductCard } from '@/components/store/intermediary/store-product-card'
import { ShoppingBag } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * MarketplaceSectionContent: The composite content for the Marketplace & Performance section.
 * Separated into the sections layer to maintain architectural purity.
 */
export function MarketplaceSectionContent({ isEmpty = false }: { isEmpty?: boolean }) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={ShoppingBag}
                title="LOJA INDISPONÍVEL"
                description="Não há produtos disponíveis no momento."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
            <StoreHeroCard />
            <Grid cols={{ base: 2.5, md: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <StoreProductCard 
                    id="1"
                    name="HIPERCALÓRICO 1KG GROWTH SUPPLEMENTS"
                    description="PESO DA UNIDADE: 1 KG. | VOLUME DA UNIDADE: 1 L. | UNIDADES POR EMBALAGEM: 1."
                    category="SUPPLEMENT"
                    price={82.90}
                    rating={4.8}
                    reviewsCount={1089}
                    imageUrl="https://www.gsuplementos.com.br/upload/growth-contents/produtos/detalhes/hipercalorico-1kg-growth-supplements-sabor-chocolate-rs-growth-supplements.png"
                />
                <StoreProductCard 
                    id="2"
                    name="L-GLUTAMINA 250G GROWTH SUPPLEMENTS"
                    description="PESO DA UNIDADE: 250 G. | VOLUME DA UNIDADE: 250 ML. | UNIDADES POR EMBALAGEM: 1."
                    category="SUPPLEMENT"
                    price={50.90}
                    rating={4.9}
                    reviewsCount={501}
                    imageUrl="https://www.gsuplementos.com.br/upload/growth-contents/produtos/detalhes/l-glutamina-250g-growth-supplements-sem-sabor-em-p-rs-growth-supplements.png"
                />
                <StoreProductCard 
                    id="3"
                    name="BARRA DE PROTEÍNA (CX. 12 UNID.)"
                    description="PESO DA UNIDADE: 400 G. | VOLUME DA UNIDADE: 400 ML. | UNIDADES POR EMBALAGEM: 12."
                    category="SUPPLEMENT"
                    price={58.90}
                    rating={4.7}
                    reviewsCount={369}
                    imageUrl="https://www.gsuplementos.com.br/upload/growth-contents/produtos/detalhes/barra-de-prote-na-cx-12-unid-growth-supplements-sabor-cookies-n-cream-rs-growth-supplements.png"
                />
                <StoreProductCard 
                    id="4"
                    name="MULTIVITAMÍNICO (120 CAPS) GROWTH"
                    description="VITAMINAS E MINERAIS DE A A Z. | 120 CÁPSULAS POR EMBALAGEM."
                    category="HEALTH"
                    price={36.90}
                    rating={4.9}
                    reviewsCount={2450}
                    imageUrl="https://www.gsuplementos.com.br/upload/growth-contents/produtos/detalhes/multivitaminico-120-caps-growth-supplements-rs-growth-supplements.png"
                />
            </Grid>
        </Stack>
    );
}

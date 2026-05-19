import { getStoreProducts } from '@/actions/store-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { MarketplaceSectionContent } from '@/components/store/sections/marketplace-section-content'

export const metadata = {
    title: 'Minha Loja | RepTrail'
}

export default async function StudentStorePage() {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.store.products,
        queryFn: getStoreProducts
    })

    return (
        <RegistryMain
            title="MINHA LOJA"
            subtitle="Suplementos de alta performance selecionados criteriosamente para acelerar seus resultados."
            icon="ShoppingBag"
            contextLabel="Marketplace & Performance"
            showTabs={false}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <MarketplaceSectionContent />
            </HydrationBoundary>
        </RegistryMain>
    )
}


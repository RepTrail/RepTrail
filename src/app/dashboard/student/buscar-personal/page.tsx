'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { SearchPersonalSection } from '@/components/store/sections/search-personal-section'

export default function SearchPersonalPage() {
    return (
        <RegistryMain
            title="Encontrar Personal"
            subtitle="Conecte-se com a elite do treinamento físico."
            icon="Search"
            contextLabel="Marketplace"
            showTabs={false}
        >
            <RegistrySection>
                <SearchPersonalSection />
            </RegistrySection>
        </RegistryMain>
    )
}

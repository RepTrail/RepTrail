'use client'

import { useState } from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { SearchPersonalSection } from '@/components/store/sections/search-personal-section'

export default function SearchPersonalPage() {
    const { setPrimaryColor } = useRegistry()

    // Forces orange theme to match student dashboard style
    useState(() => {
        setPrimaryColor('orange')
    })

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

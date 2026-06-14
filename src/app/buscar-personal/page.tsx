'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { SearchPersonalSection } from '@/components/store/sections/search-personal-section'
import { ReturnButton } from '@/components/store/intermediary/return-button'

export default function SearchPersonalPage() {
    return (
        <RegistryMain
            title="Encontrar Personal"
            subtitle="Conecte-se com a elite do treinamento físico."
            icon="Search"
            contextLabel="Marketplace"
            showTabs={false}
            rightElement={
                <ReturnButton href="/dashboard/student" />
            }
        >
            <RegistrySection>
                <SearchPersonalSection />
            </RegistrySection>
        </RegistryMain>
    )
}

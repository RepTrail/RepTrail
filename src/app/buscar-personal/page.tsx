'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Button } from '@/components/store/base/button'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import Link from 'next/link'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
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
            rightElement={
                <Link href="/dashboard/student">
                    <Button variant="outline-zinc" size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={ArrowRight} size="xs" />
                        <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Voltar</Font>
                    </Button>
                </Link>
            }
        >
            <SearchPersonalSection />
        </RegistryMain>
    )
}

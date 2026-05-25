'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { User, TrendingUp, ClipboardList, ImageIcon, Compass } from 'lucide-react'

interface TrainerStudentDetailTabSwitcherProps {
    activeTab: string
}

export function TrainerStudentDetailTabSwitcher({ activeTab }: TrainerStudentDetailTabSwitcherProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const tabs = [
        { id: 'protocols', label: 'Prescrição & Protocolos', icon: ClipboardList, activeVariant: 'outline-primary' as const },
        { id: 'evolution', label: 'Consistência & Gráficos', icon: TrendingUp, activeVariant: 'outline-primary' as const },
        { id: 'photos_activities', label: 'Fotos & Histórico', icon: ImageIcon, activeVariant: 'outline-primary' as const },
        { id: 'profile', label: 'Perfil & Dados', icon: User, activeVariant: 'outline-primary' as const },
    ]

    const handleSelect = (id: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', id)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <RegistrySection>
            <SegmentedSwitch
                options={tabs}
                activeId={activeTab}
                onSelect={handleSelect}
            />
        </RegistrySection>
    )
}


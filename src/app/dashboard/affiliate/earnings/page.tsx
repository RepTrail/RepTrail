'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateEarningsSection } from '@/components/store/sections/affiliate-earnings-section'
import { DollarSign } from 'lucide-react'

export default function AffiliateEarningsPage() {
    return (
        <RegistryMain
            title="MEUS GANHOS"
            subtitle="Extrato completo de suas comissões e histórico de saques."
            icon={DollarSign}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateEarningsSection />
        </RegistryMain>
    )
}

'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateStatsSection } from '@/components/store/sections/affiliate-stats-section'
import { BarChart } from 'lucide-react'

export default function AffiliateStatsPage() {
    return (
        <RegistryMain
            title="ESTATÍSTICAS"
            subtitle="Análise detalhada de performance e conversão."
            icon={BarChart}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <RegistrySection>
                <AffiliateStatsSection />
            </RegistrySection>
        </RegistryMain>
    )
}

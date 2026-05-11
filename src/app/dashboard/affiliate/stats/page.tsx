'use client'

import React from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateStatsContent } from '@/components/store/sections/affiliate-stats-content'
import { BarChart } from 'lucide-react'

/**
 * AffiliateStatsPage: Standardized entry point.
 * Logic is decoupled into AffiliateStatsContent section.
 */
export default function AffiliateStatsPage() {
    return (
        <RegistryMain
            title="ESTATÍSTICAS"
            subtitle="Análise detalhada de performance e conversão."
            icon={BarChart}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateStatsContent />
        </RegistryMain>
    )
}


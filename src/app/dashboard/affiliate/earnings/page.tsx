'use client'

import React from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateEarningsContent } from '@/components/store/sections/affiliate-earnings-content'
import { DollarSign } from 'lucide-react'

/**
 * AffiliateEarningsPage: Standardized entry point.
 * Logic is decoupled into AffiliateEarningsContent section.
 */
export default function AffiliateEarningsPage() {
    return (
        <RegistryMain
            title="MEUS GANHOS"
            subtitle="Extrato completo de suas comissões e histórico de saques."
            icon={DollarSign}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateEarningsContent />
        </RegistryMain>
    )
}


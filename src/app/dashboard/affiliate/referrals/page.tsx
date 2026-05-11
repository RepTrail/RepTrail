'use client'

import React from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateReferralsContent } from '@/components/store/sections/affiliate-referrals-content'
import { Users } from 'lucide-react'

/**
 * AffiliateReferralsPage: Standardized entry point.
 * Logic is decoupled into AffiliateReferralsContent section.
 */
export default function AffiliateReferralsPage() {
    return (
        <RegistryMain
            title="MEUS INDICADOS"
            subtitle="Acompanhe todos os usuários que se cadastraram através do seu link."
            icon={Users}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateReferralsContent />
        </RegistryMain>
    )
}


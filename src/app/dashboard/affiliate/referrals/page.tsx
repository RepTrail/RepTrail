'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateReferralsSection } from '@/components/store/sections/affiliate-referrals-section'
import { Users, } from 'lucide-react'

export default function AffiliateReferralsPage() {
    return (
        <RegistryMain
            title="MEUS INDICADOS"
            subtitle="Acompanhe todos os usuários que se cadastraram através do seu link."
            icon={Users}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateReferralsSection />
        </RegistryMain>
    )
}

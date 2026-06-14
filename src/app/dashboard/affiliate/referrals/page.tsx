'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateReferralsPerformanceContent, AffiliateReferralsListContent } from '@/components/store/sections/affiliate-referrals-section'
import { Users, TrendingUp, Search } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { getAffiliateReferrals } from '@/lib/dal/remote'

export default function AffiliateReferralsPage() {
    // Fetch count here so we can inject into the title
    const { data: referrals = [] } = useQuery({
        queryKey: ['affiliate-referrals'],
        queryFn: () => getAffiliateReferrals(),
        staleTime: 1000 * 60 * 5
    })
    const total = referrals.length

    return (
        <RegistryMain
            title="MEUS INDICADOS"
            subtitle="Acompanhe todos os usuários que se cadastraram através do seu link."
            icon={Users}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <RegistrySection
                title="Performance de Rede"
                subtitle="Métricas detalhadas de conversão da sua base de indicados."
                icon={TrendingUp}
            >
                <AffiliateReferralsPerformanceContent />
            </RegistrySection>
            <RegistrySection
                title={`Lista Completa de Indicados (${total})`}
                subtitle="Histórico detalhado de todos os cadastros realizados."
                icon={Search}
            >
                <AffiliateReferralsListContent />
            </RegistrySection>
        </RegistryMain>
    )
}

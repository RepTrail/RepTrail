'use client'

import { LayoutDashboard } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { AffiliateOverviewContent, AffiliateData } from '@/components/store/sections/affiliate-overview-content'

interface AffiliateDashboardClientProps {
    data: AffiliateData
}

export function AffiliateDashboardClient({ data }: AffiliateDashboardClientProps) {
    return (
        <RegistryMain
            title="VISÃO GERAL"
            subtitle="Acompanhe sua performance, links de indicação e ganhos em tempo real."
            icon={LayoutDashboard}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <AffiliateOverviewContent data={data} />
        </RegistryMain>
    )
}

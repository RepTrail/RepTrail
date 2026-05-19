'use client'

import React from 'react'
import { getAdminPayouts } from '@/actions/admin-affiliate-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { HeartHandshake } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { AdminPayoutsManagement } from '@/components/store/sections/admin-payouts-management'
import { AdminAffiliatesList } from '@/components/store/advanced/admin-affiliates-list'

/**
 * AdminAffiliatesContent Section: Orchestrates the Affiliates management domain.
 * - Following strict Design System Rules: This section now only orchestrates Advanced components.
 * - Responsibility: Page layout and semantic grouping of partner-related features.
 */
export function AdminAffiliatesContent() {
    const { data: payoutsData } = useQuery({
        queryKey: ['admin-payouts'],
        queryFn: () => getAdminPayouts()
    })

    const payouts = payoutsData?.data || []

    return (
        <React.Fragment>
            <RegistrySection
                title="Gestão de Parceiros"
                subtitle="Visualize e gerencie todos os afiliados ativos no sistema."
                icon={HeartHandshake}
            >
                <AdminAffiliatesList />
            </RegistrySection>

            <AdminPayoutsManagement initialPayouts={payouts} />
        </React.Fragment>
    )
}

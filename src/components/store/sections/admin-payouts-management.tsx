'use client'

import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Banknote } from 'lucide-react'
import { AdminPayoutsManagementPanel } from '@/components/store/advanced/admin-payouts-management-panel'

interface Payout {
    id: string
    amount: number
    status: string
    payout_method: string
    payout_details: any
    created_at: string
    affiliate_id: string
    profiles?: {
        full_name: string
        email: string
        avatar_url?: string | null
    }
}

/**
 * AdminPayoutsManagement Section: Orchestrates the withdrawal requests domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced panel.
 * - Responsibility: Semantic structure and page flow for payouts.
 */
export function AdminPayoutsManagement({ initialPayouts }: { initialPayouts: Payout[] }) {
    return (
        <RegistrySection
            title="Solicitações de Saque"
            subtitle="Gestão de pagamentos e transferências para afiliados."
            icon={Banknote}
        >
            <AdminPayoutsManagementPanel initialPayouts={initialPayouts} />
        </RegistrySection>
    )
}

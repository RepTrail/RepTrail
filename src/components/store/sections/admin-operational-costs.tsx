'use client'

import { TrendingDown } from 'lucide-react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminOperationalCostsPanel } from '@/components/store/advanced/admin-operational-costs-panel'

interface OperationalCost {
    id: string
    description: string
    amount: number
    type: 'fixed' | 'variable'
    created_at: string
}

interface OperationalCostsProps {
    initialCosts: OperationalCost[]
    totalMonthly: number
    totalAllTime: number
}

/**
 * AdminOperationalCosts Section: Orchestrates the operational costs domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced panel.
 * - Responsibility: Semantic structure and page flow.
 */
export function AdminOperationalCosts({ initialCosts }: OperationalCostsProps) {
    return (
        <RegistrySection
            title="Custos Operacionais"
            subtitle="Infraestrutura e operação mensal da plataforma."
            icon={TrendingDown}
        >
            <AdminOperationalCostsPanel initialCosts={initialCosts} />
        </RegistrySection>
    );
}

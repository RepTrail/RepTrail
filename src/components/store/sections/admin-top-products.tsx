'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminTopProductsPanel } from '@/components/store/advanced/admin-top-products-panel'

/**
 * AdminTopProducts Section: Orchestrates the "Most Clicked Products" domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced panel.
 * - Responsibility: Semantic structure and page flow.
 */
export function AdminTopProducts() {
    return (
        <RegistrySection
            title="Produtos Mais Clicados"
            subtitle="Engajamento de alunos com produtos da loja RepTrail."
            icon={TrendingUp}
        >
            <AdminTopProductsPanel />
        </RegistrySection>
    )
}

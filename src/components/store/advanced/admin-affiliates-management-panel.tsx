'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { AffiliateListItem } from '@/components/store/intermediary/affiliate-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { HeartHandshake } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AdminAffiliatesManagementPanelProps {
    onDelete: (name: string) => void
}

/**
 * AdminAffiliatesManagementPanel: Organism for managing commercial partners.
 * - Encapsulates the specific list and commission metrics for affiliates.
 * - Responsibility: Affiliates domain management.
 */
export function AdminAffiliatesManagementPanel({ onDelete }: AdminAffiliatesManagementPanelProps) {
    return (
        <RegistrySection
            title="Gestão de Afiliados"
            icon={HeartHandshake}
            subtitle="Administração de parceiros comerciais, comissões e indicações."
        >
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <AffiliateListItem 
                    name="Thiago Nigro"
                    email="thiago.nigro@primocast.com.br"
                    affiliateId="PRIMO20"
                    registrationDate="10/01/2024"
                    referrals={{ total: 1500, active: 850 }}
                    revenue="R$ 45.000,00"
                    commission="R$ 4.500,00"
                    rate={10}
                    onDelete={() => onDelete('Thiago Nigro')}
                />
                <AffiliateListItem 
                    name="Joel Jota"
                    email="joel@jota.com.br"
                    affiliateId="JJ2024"
                    registrationDate="15/02/2024"
                    referrals={{ total: 800, active: 420 }}
                    revenue="R$ 28.000,00"
                    commission="R$ 2.800,00"
                    rate={10}
                    onDelete={() => onDelete('Joel Jota')}
                />

                <EmptyState 
                    icon={HeartHandshake}
                    title="Nenhum afiliado encontrado"
                    description="Não há registros de parceiros comerciais para os filtros selecionados (Demonstração)."
                />
            </Stack>
        </RegistrySection>
    )
}

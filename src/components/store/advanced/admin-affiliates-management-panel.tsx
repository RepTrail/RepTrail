'use client'

import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { AffiliateListItem } from '@/components/store/intermediary/affiliate-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
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
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={HeartHandshake} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Gestão de Afiliados"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Administração de parceiros comerciais, comissões e indicações."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
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
          </Stack>
        </Stack>
    )
}

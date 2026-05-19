'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateLinkSharingPanel } from '@/components/store/advanced/affiliate-link-sharing-panel'
import { AffiliateWalletSummary } from '@/components/store/intermediary/affiliate-wallet-summary'
import { AffiliateLinkPerformanceGrid } from '@/components/store/advanced/affiliate-link-performance-panel'
import { AffiliateReferrersList } from '@/components/store/advanced/affiliate-referrers-list'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import {
    Users,
    TrendingUp,
    Wallet,
    History
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateSectionContent Section: Orchestrates the Affiliate network and performance domain.
 * - Following strict Design System Rules: This section now only orchestrates Advanced components.
 * - Responsibility: Page structure and semantic grouping of network features.
 */
export function AffiliateSectionContent({ id }: { id?: string }) {
    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* 1. Share Link */}
            <AffiliateLinkSharingPanel id={id} />

            {/* 2. Performance Grid */}
            <RegistrySection
                title="Performance do Link"
                icon={TrendingUp}
                subtitle="Métricas detalhadas de engajamento e alcance do seu link de indicação."
            >
                <AffiliateLinkPerformanceGrid />
            </RegistrySection>

            {/* 3. Wallet & History */}
            <Grid cols={1} lgCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box lgColSpan={2}>
                    <RegistrySection
                        title="Indicados Recentes"
                        icon={Users}
                        subtitle="Histórico de cadastros realizados através do seu link de afiliado."
                    >
                        <AffiliateReferrersList />
                    </RegistrySection>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <RegistrySection
                        title="Sua Carteira"
                        icon={Wallet}
                        subtitle="Gestão de saldo e solicitações de saque de comissões."
                    >
                        <AffiliateWalletSummary />
                    </RegistrySection>

                    <RegistrySection
                        title="Saques"
                        icon={History}
                        subtitle="Histórico de pagamentos e transferências realizadas."
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <WithdrawalItem
                                id="TRX-9928347"
                                amount="R$ 150,00"
                                date="06/05/2024"
                                method="PIX"
                                recipient="Marcos Vinicius"
                                status="completed"
                            />
                            <EmptyState
                                icon={History}
                                title="Sem saques"
                                description="Seus pagamentos aparecerão aqui."
                            />
                        </Stack>
                    </RegistrySection>
                </Stack>
            </Grid>
        </Stack>
    )
}

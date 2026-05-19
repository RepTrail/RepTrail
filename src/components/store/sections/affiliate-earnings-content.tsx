'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateWalletSection } from '@/components/store/advanced/affiliate-wallet-section'
import { AffiliateCommissionsList } from '@/components/store/advanced/affiliate-commissions-list'
import { AffiliateWithdrawalsList } from '@/components/store/advanced/affiliate-withdrawals-list'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { DollarSign, Clock, CheckCircle2, Wallet } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAffiliateTransactions } from '@/actions/affiliate-actions'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateEarningsContent Section: Orchestrates the Affiliate Wallet and Earnings domain.
 * - Following strict Design System Rules: This section now only orchestrates Advanced components.
 * - Responsibility: Page structure and semantic composition of financial features.
 */
export function AffiliateEarningsContent() {
    const { data } = useQuery({
        queryKey: ['affiliate-transactions'],
        queryFn: () => getAffiliateTransactions(),
        staleTime: 1000 * 60 * 5
    })

    const commissions = data?.commissions || []
    const payouts = data?.payouts || []
    const checks = data?.checks || { available: 0, pending: 0, paid: 0 }

    return (
        <React.Fragment>
            {/* Wallet Section */}
            <RegistrySection
                title="Sua Carteira"
                subtitle="Gestão de saldo e solicitações de saque de comissões."
                icon={Wallet}
            >
                <Grid cols={1} lgCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <AffiliateWalletSection balance={checks.available} pendingAmount={checks.pending} />

                    <StatsCard
                        label="PENDENTE"
                        value={`R$ ${checks.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description="Aguardando confirmação (30 dias)"
                        icon={Clock}
                        color={STORE_TOKENS.COLORS.WARNING}
                    />
                    <StatsCard
                        label="TOTAL RECEBIDO"
                        value={`R$ ${checks.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description="Já transferido para sua conta"
                        icon={DollarSign}
                        color={STORE_TOKENS.COLORS.INFO}
                    />
                </Grid>
            </RegistrySection>

            {/* Commissions and Payouts */}
            <Grid cols={1} lgCols={12} gap={STORE_TOKENS.SPACING.SECTION}>
                <Box lgColSpan={8}>
                    <RegistrySection
                        title="Extrato de Comissões"
                        subtitle="Relatório detalhado de todas as vendas convertidas."
                        icon={DollarSign}
                    >
                        <AffiliateCommissionsList commissions={commissions} />
                    </RegistrySection>
                </Box>

                <Box lgColSpan={4}>
                    <RegistrySection
                        title="Histórico de Saques"
                        subtitle="Gestão de transferências realizadas."
                        icon={CheckCircle2}
                    >
                        <AffiliateWithdrawalsList payouts={payouts} />
                    </RegistrySection>
                </Box>
            </Grid>
        </React.Fragment>
    )
}

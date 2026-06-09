'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { AffiliateWalletSection } from '@/components/store/advanced/affiliate-wallet-section'
import { AffiliateCommissionsList } from '@/components/store/advanced/affiliate-commissions-list'
import { AffiliateWithdrawalsList } from '@/components/store/advanced/affiliate-withdrawals-list'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { DollarSign, Clock, CheckCircle2, Wallet } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { getAffiliateTransactions } from '@/lib/dal/remote'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AffiliateEarningsSection() {
    const { data } = useQuery({
        queryKey: ['affiliate-transactions'],
        queryFn: () => getAffiliateTransactions(),
        staleTime: 1000 * 60 * 5
    })

    const commissions = data?.commissions || []
    const payouts = data?.payouts || []
    const checks = data?.checks || { available: 0, pending: 0, paid: 0 }

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
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
                        color={STORE_TOKENS.COLORS.WARNING} />
                    <StatsCard
                        label="TOTAL RECEBIDO"
                        value={`R$ ${checks.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description="Já transferido para sua conta"
                        icon={DollarSign}
                        color={STORE_TOKENS.COLORS.INFO} />
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
        </Stack>
    )
}

'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { AffiliateWalletSection } from '@/components/store/advanced/affiliate-wallet-section'
import { AffiliateCommissionsList } from '@/components/store/advanced/affiliate-commissions-list'
import { AffiliateWithdrawalsList } from '@/components/store/advanced/affiliate-withdrawals-list'
import { StatsCard } from '@/components/store/intermediary/stats-card'
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
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Wallet} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Sua Carteira</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Gestão de saldo e solicitações de saque de comissões.</Font>
                    </Stack>
                </Stack>
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
            </Stack>
            {/* Commissions and Payouts */}
            <Grid cols={1} lgCols={12} gap={STORE_TOKENS.SPACING.SECTION}>
                <Box lgColSpan={8}>
                    <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={DollarSign} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Extrato de Comissões</Font>
                            </Inline>
                            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Relatório detalhado de todas as vendas convertidas.</Font>
                        </Stack>
                        <AffiliateCommissionsList commissions={commissions} />
                    </Stack>
                </Box>

                <Box lgColSpan={4}>
                    <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={CheckCircle2} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Histórico de Saques</Font>
                            </Inline>
                            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Gestão de transferências realizadas.</Font>
                        </Stack>
                        <AffiliateWithdrawalsList payouts={payouts} />
                    </Stack>
                </Box>
            </Grid>
        </Stack>
    )
}

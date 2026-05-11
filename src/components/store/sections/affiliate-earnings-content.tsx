'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateWalletSection } from './affiliate-wallet-section'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { CommissionItem } from '@/components/store/intermediary/commission-item'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { DollarSign, Clock, CheckCircle2, AlertCircle, Wallet } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAffiliateTransactions } from '@/actions/affiliate-actions'

/**
 * AffiliateEarningsContent: Returns a fragment of sections for RegistryMain.
 * Following strict "Zero-Manual-Styling" governance.
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

    const statusColor = (status: string): 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' => {
        if (['confirmed', 'paid', 'completed'].includes(status)) return 'emerald'
        if (['pending', 'processing', 'requested'].includes(status)) return 'amber'
        return 'red'
    }

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado',
            paid: 'Pago', requested: 'Solicitado', processing: 'Processando',
            completed: 'Concluído', rejected: 'Rejeitado',
        }
        return map[s] || s
    }

    return (
        <>
            {/* Wallet Section */}
            <RegistrySection
                title="Sua Carteira"
                subtitle="Gestão de saldo e solicitações de saque de comissões."
                icon={Wallet}
            >
                <Grid cols={1} lgCols={3} gap={5}>
                    <AffiliateWalletSection balance={checks.available} pendingAmount={checks.pending} />

                    <StatsCard
                        label="PENDENTE"
                        value={`R$ ${checks.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description="Aguardando confirmação (30 dias)"
                        icon={Clock}
                        color="amber"
                    />
                    <StatsCard
                        label="TOTAL RECEBIDO"
                        value={`R$ ${checks.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description="Já transferido para sua conta"
                        icon={DollarSign}
                        color="blue"
                    />
                </Grid>
            </RegistrySection>

            {/* Commissions and Payouts */}
            <Grid cols={1} lgCols={12} gap="section">
                <Box lgColSpan={8}>
                    <RegistrySection
                        title="Extrato de Comissões"
                        subtitle="Relatório detalhado de todas as vendas convertidas."
                        icon={DollarSign}
                    >
                        <Stack gap={2.5}>
                            {commissions.length > 0 ? (
                                commissions.map((c: any) => (
                                    <CommissionItem
                                        key={c.id}
                                        description={c.description || 'Comissão de Venda'}
                                        amount={Number(c.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        date={new Date(c.created_at).toLocaleDateString('pt-BR')}
                                        time={new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        status={c.status}
                                        statusLabel={statusLabel(c.status)}
                                        statusColor={statusColor(c.status)}
                                    />
                                ))
                            ) : (
                                <Box paddingY={5}>
                                    <EmptyState
                                        icon={DollarSign}
                                        title="Nenhuma comissão registrada"
                                        description="Suas vendas aparecerão aqui em tempo real."
                                    />
                                </Box>
                            )}
                        </Stack>
                    </RegistrySection>
                </Box>

                <Box lgColSpan={4}>
                    <RegistrySection
                        title="Histórico de Saques"
                        subtitle="Gestão de transferências realizadas."
                        icon={CheckCircle2}
                    >
                        <Stack gap={2.5}>
                            {payouts.length > 0 ? (
                                payouts.map((p: any) => (
                                    <WithdrawalItem
                                        key={p.id}
                                        id={p.id.substring(0, 8)}
                                        amount={`R$ ${Number(p.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        date={new Date(p.created_at).toLocaleDateString('pt-BR')}
                                        method={p.payout_method || 'PIX'}
                                        recipient="Você"
                                        status={p.status === 'completed' || p.status === 'paid' ? 'completed' : p.status === 'rejected' ? 'rejected' : 'pending'}
                                    />
                                ))
                            ) : (
                                <Box paddingY={5}>
                                    <EmptyState
                                        icon={AlertCircle}
                                        title="Sem saques"
                                        description="Seus pagamentos aparecerão aqui."
                                    />
                                </Box>
                            )}
                        </Stack>
                    </RegistrySection>
                </Box>
            </Grid>
        </>
    )
}



'use client'

import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateWalletSection } from './affiliate-wallet-section'
import { AffiliateLinkSharer } from '@/components/store/advanced/affiliate-link-sharer'
import {
    Link as LinkIcon,
    MousePointer2,
    Users,
    TrendingUp,
    DollarSign,
    History,
    HelpCircle,
    Award,
    Search
} from 'lucide-react'

export interface AffiliateData {
    profile: {
        id: string
        full_name: string | null
        avatar_url: string | null
        affiliate_token: string | null
        affiliate_balance: number
        email: string | null
    }
    stats: {
        totalClicks: number
        totalReferrals: number
        activeTrainers: number
        totalEarned: number
        pendingAmount: number
        balance: number
        conversionRate: string
    }
    clicksPerDay: Record<string, number>
    recentReferrals: any[]
    recentCommissions: any[]
    payouts: any[]
}

interface AffiliateOverviewContentProps {
    data: AffiliateData
}

/**
 * AffiliateOverviewContent: Returns a fragment of sections to maintain flat hierarchy in RegistryMain.
 * Following strict "Zero-Manual-Styling" governance.
 */
export function AffiliateOverviewContent({ data }: AffiliateOverviewContentProps) {
    const { profile, stats, recentReferrals, recentCommissions } = data

    return (
        <>
            {/* 1. Marketing Section */}
            <RegistrySection
                title="Marketing de Afiliados"
                subtitle="Compartilhe seu link exclusivo e ganhe comissões recorrentes sobre cada novo personal ou aluno indicado."
                icon={LinkIcon}
            >
                <AffiliateLinkSharer token={profile.affiliate_token} />
            </RegistrySection>

            {/* 2. Key Metrics Summary */}
            <RegistrySection
                title="Resumo de Performance"
                subtitle="Visão geral dos seus resultados acumulados."
                icon={TrendingUp}
            >
                <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                    <StatsCard
                        label="Clicks Únicos"
                        value={stats.totalClicks.toLocaleString()}
                        description="TRÁFEGO TOTAL"
                        icon={MousePointer2}
                        color="primary"
                    />
                    <StatsCard
                        label="Total de Indicados"
                        value={stats.totalReferrals.toLocaleString()}
                        description={`${stats.activeTrainers} PERSONAIS ATIVOS`}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        label="Taxa de Conversão"
                        value={`${stats.conversionRate}%`}
                        description="CLICK → CADASTRO"
                        icon={TrendingUp}
                        color="emerald"
                    />
                    <StatsCard
                        label="Ganhos Totais"
                        value={`R$ ${stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description={`R$ ${stats.pendingAmount.toFixed(2)} PENDENTE`}
                        icon={DollarSign}
                        color="amber"
                    />
                </Grid>
            </RegistrySection>

            {/* 3. Recent Activity & Quick Actions */}
            <Grid cols={1} lgCols={12} gap="section">
                {/* Column 1: Recent Activity */}
                <Box lgColSpan={8}>
                    <Stack gap="section">
                        <RegistrySection
                            title="Atividade Recente"
                            subtitle="Últimas interações na sua rede."
                            icon={History}
                        >
                            <Stack gap={5}>
                                <GlassPanel padding={5} rounded="system">
                                    <Stack gap={5}>
                                        <Stack direction="row" justify="between" align="center">
                                            <Font variant="label-caps">Novos Indicados</Font>
                                            <Button variant="outline-primary" padding={2.5} onClick={() => window.location.href = '/dashboard/affiliate/referrals'}>
                                                <Font variant="sub-tiny" weight="black">Ver Todos</Font>
                                            </Button>
                                        </Stack>
                                        <Stack gap={2.5}>
                                            {recentReferrals.slice(0, 3).length > 0 ? (
                                                recentReferrals.slice(0, 3).map((r: any) => (
                                                    <UserListItem
                                                        key={r.id}
                                                        name={r.full_name || r.email}
                                                        email={r.email}
                                                        registrationDate={new Date(r.created_at).toLocaleDateString('pt-BR')}
                                                        role={r.role === 'trainer' ? 'personal' : 'aluno'}
                                                        roleLabel={r.role === 'trainer' ? 'PERSONAL' : 'ALUNO'}
                                                        initials={r.full_name?.substring(0, 2).toUpperCase() || '?'}
                                                        avatarVariant={r.role === 'trainer' ? 'emerald' : 'orange'}
                                                    />
                                                ))
                                            ) : (
                                                <EmptyState icon={Search} title="Nenhum indicado" description="Aguardando novas conversões." />
                                            )}
                                        </Stack>
                                    </Stack>
                                </GlassPanel>

                                <GlassPanel padding={5} rounded="system">
                                    <Stack gap={5}>
                                        <Stack direction="row" justify="between" align="center">
                                            <Font variant="label-caps">Ganhos Recentes</Font>
                                            <Button variant="outline-primary" padding={2.5} onClick={() => window.location.href = '/dashboard/affiliate/earnings'}>
                                                <Font variant="sub-tiny" weight="black">Ver Extrato</Font>
                                            </Button>
                                        </Stack>
                                        <Stack gap={2.5}>
                                            {recentCommissions.slice(0, 3).length > 0 ? (
                                                recentCommissions.slice(0, 3).map((c: any) => (
                                                    <WithdrawalItem
                                                        key={c.id}
                                                        id={c.id.substring(0, 8)}
                                                        amount={`R$ ${Number(c.amount).toFixed(2)}`}
                                                        date={new Date(c.created_at).toLocaleDateString('pt-BR')}
                                                        method={c.description || 'Comissão'}
                                                        recipient=""
                                                        status={c.status === 'confirmed' ? 'completed' : 'pending'}
                                                    />
                                                ))
                                            ) : (
                                                <EmptyState icon={DollarSign} title="Sem ganhos" description="Sua primeira venda aparecerá aqui." />
                                            )}
                                        </Stack>
                                    </Stack>
                                </GlassPanel>
                            </Stack>
                        </RegistrySection>
                    </Stack>
                </Box>

                {/* Column 2: Wallet & Help */}
                <Box lgColSpan={4}>
                    <Stack gap="section">
                        <RegistrySection
                            title="Carteira"
                            subtitle="Saldo disponível e solicitações de saque."
                            icon={DollarSign}
                        >
                            <AffiliateWalletSection balance={stats.balance} pendingAmount={stats.pendingAmount} />
                        </RegistrySection>

                        <RegistrySection
                            title="Como Funciona"
                            subtitle="Dicas rápidas para maximizar ganhos."
                            icon={HelpCircle}
                        >
                            <GlassPanel padding={5} rounded="system" border="subtle">
                                <Stack gap={5}>
                                    <Stack direction="row" gap={5} align="center">
                                        <GlassPanel padding={2.5} rounded="system">
                                            <Icon icon={LinkIcon} color="primary" size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color="white">Divulgue seu link</Font>
                                            <Font variant="sub-tiny" color="zinc-500">Compartilhe em suas redes sociais ou site.</Font>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" gap={5} align="center">
                                        <GlassPanel padding={2.5} rounded="system">
                                            <Icon icon={Users} color="blue" size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color="white">Atraia Personais</Font>
                                            <Font variant="sub-tiny" color="zinc-500">Convide profissionais para a plataforma.</Font>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" gap={5} align="center">
                                        <GlassPanel padding={2.5} rounded="system">
                                            <Icon icon={Award} color="emerald" size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color="white">Ganhe Comissões</Font>
                                            <Font variant="sub-tiny" color="zinc-500">Receba 10% sobre cada assinatura ativa.</Font>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </GlassPanel>
                        </RegistrySection>
                    </Stack>
                </Box>
            </Grid>
        </>
    )
}


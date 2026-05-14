'use client'

import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateWalletSection } from '@/components/store/advanced/affiliate-wallet-section'
import { AffiliateLinkSharer } from '@/components/store/advanced/affiliate-link-sharer'
import { AffiliatePerformanceGrid } from '@/components/store/advanced/affiliate-performance-grid'
import { AffiliateActivityFeed } from '@/components/store/advanced/affiliate-activity-feed'
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
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
                <AffiliatePerformanceGrid stats={stats} />
            </RegistrySection>

            {/* 3. Recent Activity & Quick Actions */}
            <Grid cols={1} lgCols={12} gap={STORE_TOKENS.SPACING.SECTION}>
                {/* Column 1: Recent Activity */}
                <Box lgColSpan={8}>
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
                        <RegistrySection
                            title="Atividade Recente"
                            subtitle="Últimas interações na sua rede."
                            icon={History}
                        >
                            <AffiliateActivityFeed 
                                recentReferrals={recentReferrals}
                                recentCommissions={recentCommissions}
                            />
                        </RegistrySection>
                    </Stack>
                </Box>

                {/* Column 2: Wallet & Help */}
                <Box lgColSpan={4}>
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
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
                            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="subtle">
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                            <Icon icon={LinkIcon} color={STORE_TOKENS.COLORS.BRAND} size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Divulgue seu link</Font>
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Compartilhe em suas redes sociais ou site.</Font>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                            <Icon icon={Users} color={STORE_TOKENS.COLORS.INFO} size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Atraia Personais</Font>
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Convide profissionais para a plataforma.</Font>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                            <Icon icon={Award} color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />
                                        </GlassPanel>
                                        <Stack gap={0}>
                                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Ganhe Comissões</Font>
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Receba 10% sobre cada assinatura ativa.</Font>
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


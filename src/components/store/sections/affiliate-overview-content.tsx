'use client'

import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateWalletSection } from '@/components/store/advanced/affiliate-wallet-section'
import { AffiliateLinkSharer } from '@/components/store/advanced/affiliate-link-sharer'
import { AffiliatePerformanceGrid } from '@/components/store/advanced/affiliate-performance-grid'
import { AffiliateConversionTracker } from '@/components/store/advanced/affiliate-conversion-tracker'
import { AffiliateOnboardingGuide } from '@/components/store/advanced/affiliate-onboarding-guide'
import {
    Link as LinkIcon,
    TrendingUp,
    DollarSign,
    History,
    HelpCircle
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
 * AffiliateOverviewContent Section: Orchestrates the Affiliate Dashboard domain.
 * - Following strict Design System Rules: This section now only orchestrates Advanced components.
 * - Responsibility: Page layout and semantic coordination of affiliate features.
 */
export function AffiliateOverviewContent({ data }: AffiliateOverviewContentProps) {
    const { profile, stats, recentReferrals, recentCommissions } = data

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
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
                    <RegistrySection
                        title="Atividade Recente"
                        subtitle="Últimas interações na sua rede."
                        icon={History}
                    >
                        <AffiliateConversionTracker 
                            recentReferrals={recentReferrals}
                            recentCommissions={recentCommissions}
                        />
                    </RegistrySection>
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
                            <AffiliateOnboardingGuide />
                        </RegistrySection>
                    </Stack>
                </Box>
            </Grid>
        </Stack>
    )
}

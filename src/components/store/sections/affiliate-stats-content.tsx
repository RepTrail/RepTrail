'use client'

import React from 'react'
import { getAffiliateStatsDetails } from '@/lib/dal/remote'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { AffiliateActivityChart } from '@/components/store/advanced/affiliate-activity-chart'
import { AffiliatePerformanceInsights } from '@/components/store/advanced/affiliate-performance-insights'
import { BarChart, Activity, UserPlus, MousePointerClick, DollarSign, TrendingUp } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateStatsContent Section: Orchestrates the performance analytics domain.
 * - Following strict Design System Rules: This section now only orchestrates Advanced components.
 * - Responsibility: Page structure and semantic composition of stats features.
 */
export function AffiliateStatsContent() {
    const { data, isLoading } = useQuery({
        queryKey: ['affiliate-stats-details'],
        queryFn: () => getAffiliateStatsDetails(),
        staleTime: 1000 * 60 * 5
    })

    if (isLoading) {
        return (
            <Box padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" justify="center">
                <Font
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                    }}>Carregando estatísticas...</Font>
            </Box>
        );
    }

    if (!data) return null

    const { clicksPerDay, conversion } = data
    const clickDays = Object.entries(clicksPerDay).sort((a, b) => a[0].localeCompare(b[0]))
    const maxClicks = Math.max(...clickDays.map(([, v]) => v as number), 1)

    return (
        <React.Fragment>
            {/* Conversion Funnel */}
            <RegistrySection
                title="Funil de Conversão"
                icon={TrendingUp}
                subtitle="Acompanhe o caminho do seu tráfego até a venda final."
            >
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="PASSO 1: TRÁFEGO"
                        value={conversion.totalClicks.toLocaleString()}
                        description="CLIQUES ÚNICOS"
                        icon={MousePointerClick}
                        {...{
                            color: STORE_TOKENS.COLORS.BRAND,
                        }} />

                    <StatsCard
                        label="PASSO 2: LEADS"
                        value={conversion.totalReferrals.toLocaleString()}
                        description={`${conversion.clickToSignup}% CONVERSÃO`}
                        icon={UserPlus}
                        {...{
                            color: STORE_TOKENS.COLORS.WARNING,
                        }} />

                    <StatsCard
                        label="PASSO 3: VENDAS"
                        value={conversion.payingReferrals.toLocaleString()}
                        description={`${conversion.signupToPaid}% CONVERSÃO`}
                        icon={DollarSign}
                        {...{
                            color: STORE_TOKENS.COLORS.SUCCESS,
                        }} />
                </Grid>
            </RegistrySection>
            <Grid cols={1} lgCols={3} gap={STORE_TOKENS.SPACING.SECTION}>
                {/* Main Activities Chart */}
                <Box lgColSpan={2}>
                    <RegistrySection
                        title="Volume de Cliques (30 Dias)"
                        subtitle="Histórico de cliques nos últimos 30 dias."
                        icon={BarChart}
                    >
                        <AffiliateActivityChart clickDays={clickDays} maxClicks={maxClicks} />
                    </RegistrySection>
                </Box>

                {/* Insights Column */}
                <Box>
                    <RegistrySection
                        title="Insights Rápidos"
                        subtitle="Análise simplificada de métricas secundárias."
                        icon={Activity}
                    >
                        <AffiliatePerformanceInsights />
                    </RegistrySection>
                </Box>
            </Grid>
        </React.Fragment>
    );
}

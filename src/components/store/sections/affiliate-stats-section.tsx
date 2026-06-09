'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { AffiliateActivityChart } from '@/components/store/advanced/affiliate-activity-chart'
import { AffiliatePerformanceInsights } from '@/components/store/advanced/affiliate-performance-insights'
import { BarChart, Activity, UserPlus, MousePointerClick, DollarSign, TrendingUp } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { getAffiliateStatsDetails } from '@/lib/dal/remote'

export function AffiliateStatsSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['affiliate-stats-details'],
        queryFn: () => getAffiliateStatsDetails(),
        staleTime: 1000 * 60 * 5
    })

    if (isLoading) {
        return (
            <Box padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" justify="center">
                <Font color={STORE_TOKENS.COLORS.TEXT.MUTED}>Carregando estatísticas...</Font>
            </Box>
        )
    }

    if (!data) return null

    const { clicksPerDay, conversion } = data
    const clickDays = Object.entries(clicksPerDay).sort((a, b) => a[0].localeCompare(b[0]))
    const maxClicks = Math.max(...clickDays.map(([, v]) => v as number), 1)

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={TrendingUp} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Funil de Conversão</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Acompanhe o caminho do seu tráfego até a venda final.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="PASSO 1: TRÁFEGO"
                        value={conversion.totalClicks.toLocaleString()}
                        description="CLIQUES ÚNICOS"
                        icon={MousePointerClick}
                        color={STORE_TOKENS.COLORS.BRAND} />

                    <StatsCard
                        label="PASSO 2: LEADS"
                        value={conversion.totalReferrals.toLocaleString()}
                        description={`${conversion.clickToSignup}% CONVERSÃO`}
                        icon={UserPlus}
                        color={STORE_TOKENS.COLORS.WARNING} />

                    <StatsCard
                        label="PASSO 3: VENDAS"
                        value={conversion.payingReferrals.toLocaleString()}
                        description={`${conversion.signupToPaid}% CONVERSÃO`}
                        icon={DollarSign}
                        color={STORE_TOKENS.COLORS.SUCCESS} />
                </Grid>
            </Stack>
            <Grid cols={1} lgCols={3} gap={STORE_TOKENS.SPACING.SECTION}>
                {/* Main Activities Chart */}
                <Box lgColSpan={2}>
                    <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                        <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={BarChart} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                    <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Volume de Cliques (30 Dias)</Font>
                                </Inline>
                                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Histórico de cliques nos últimos 30 dias.</Font>
                            </Stack>
                        </Stack>
                        <AffiliateActivityChart clickDays={clickDays} maxClicks={maxClicks} />
                    </Stack>
                </Box>

                {/* Insights Column */}
                <Box>
                    <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                        <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                    <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Insights Rápidos</Font>
                                </Inline>
                                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Análise simplificada de métricas secundárias.</Font>
                            </Stack>
                        </Stack>
                        <AffiliatePerformanceInsights />
                    </Stack>
                </Box>
            </Grid>
        </Stack>
    )
}

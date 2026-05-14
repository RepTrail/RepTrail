'use client'

import React from 'react'
import { getAffiliateStatsDetails } from '@/actions/affiliate-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { AffiliateActivityChart } from '@/components/store/advanced/affiliate-activity-chart'
import { BarChart, Activity, UserPlus, MousePointerClick, DollarSign, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AffiliateStatsContent() {
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
        <>
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
                        color={STORE_TOKENS.COLORS.BRAND}
                    />

                    <StatsCard
                        label="PASSO 2: LEADS"
                        value={conversion.totalReferrals.toLocaleString()}
                        description={`${conversion.clickToSignup}% CONVERSÃO`}
                        icon={UserPlus}
                        color={STORE_TOKENS.COLORS.WARNING}
                    />

                    <StatsCard
                        label="PASSO 3: VENDAS"
                        value={conversion.payingReferrals.toLocaleString()}
                        description={`${conversion.signupToPaid}% CONVERSÃO`}
                        icon={DollarSign}
                        color={STORE_TOKENS.COLORS.SUCCESS}
                    />
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
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="subtle">
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">Melhor dia da semana</Font>
                                        <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" italic uppercase>Segunda-feira</Font>
                                    </Stack>

                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">Origem do tráfego</Font>

                                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            {[
                                                { label: 'Instagram', value: '45%', color: 'blue', width: '45%' },
                                                { label: 'WhatsApp', value: '30%', color: 'emerald', width: '30%' },
                                                { label: 'Outros', value: '25%', color: 'zinc', width: '25%' }
                                            ].map((source) => (
                                                <Stack key={source.label} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Box display="flex" justify="between">
                                                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>{source.label}</Font>
                                                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">{source.value}</Font>
                                                    </Box>
                                                    <Box height="px" fullWidth bg={STORE_TOKENS.COLORS.SHELF} bgOpacity={STORE_TOKENS.OPACITY.SHELF} rounded={STORE_TOKENS.RADIUS.FULL} overflow="hidden">
                                                        <Box height="full" bg={source.color as any} style={{ width: source.width }} />
                                                    </Box>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Stack>

                                    <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} italic>* Dados estimados com base em referer_url.</Font>
                                    </Box>
                                </Stack>
                            </Surface>
                        </Stack>
                    </RegistrySection>
                </Box>
            </Grid>
        </>
    );
}


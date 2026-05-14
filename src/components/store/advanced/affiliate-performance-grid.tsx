'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { MousePointer2, Users, TrendingUp, DollarSign } from 'lucide-react'

interface AffiliatePerformanceGridProps {
    stats: {
        totalClicks: number
        totalReferrals: number
        activeTrainers: number
        conversionRate: string
        totalEarned: number
        pendingAmount: number
    }
}

/**
 * AffiliatePerformanceGrid: Advanced component grouping key metrics for affiliates.
 * Extracted from AffiliateOverviewContent.
 * Preserves the 4-column responsive grid and data formatting.
 */
export function AffiliatePerformanceGrid({ stats }: AffiliatePerformanceGridProps) {
    return (
        <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
            <StatsCard
                label="Clicks Únicos"
                value={stats.totalClicks.toLocaleString()}
                description="TRÁFEGO TOTAL"
                icon={MousePointer2}
                color={STORE_TOKENS.COLORS.BRAND}
            />
            <StatsCard
                label="Total de Indicados"
                value={stats.totalReferrals.toLocaleString()}
                description={`${stats.activeTrainers} PERSONAIS ATIVOS`}
                icon={Users}
                color={STORE_TOKENS.COLORS.INFO}
            />
            <StatsCard
                label="Taxa de Conversão"
                value={`${stats.conversionRate}%`}
                description="CLICK → CADASTRO"
                icon={TrendingUp}
                color={STORE_TOKENS.COLORS.SUCCESS}
            />
            <StatsCard
                label="Ganhos Totais"
                value={`R$ ${stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`R$ ${stats.pendingAmount.toFixed(2)} PENDENTE`}
                icon={DollarSign}
                color={STORE_TOKENS.COLORS.WARNING}
            />
        </Grid>
    )
}

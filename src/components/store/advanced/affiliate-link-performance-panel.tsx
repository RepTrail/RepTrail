'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { MousePointer2, Users, TrendingUp, DollarSign } from 'lucide-react'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateLinkPerformanceGrid: A structured grid of performance indicators.
 * - Encapsulates the metric visualization for the affiliate domain.
 * - Responsibility: High-level performance summary.
 */
export function AffiliateLinkPerformanceGrid() {
    return (
        <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
            <StatsCard
                label="Clicks no Link"
                value="1"
                description="TOTAL ACUMULADO"
                icon={MousePointer2}
                color={STORE_TOKENS.COLORS.BRAND}
            />
            <StatsCard
                label="Indicados"
                value="0"
                description="0 PERSONAIS ATIVOS"
                icon={Users}
                color={STORE_TOKENS.COLORS.BRAND}
            />
            <StatsCard
                label="Conversão"
                value="0.0%"
                description="CLICK → CADASTRO"
                icon={TrendingUp}
                color={STORE_TOKENS.COLORS.BRAND}
            />
            <StatsCard
                label="Ganhos Totais"
                value="R$ 0,00"
                description="R$ 0,00 PENDENTE"
                icon={DollarSign}
                color={STORE_TOKENS.COLORS.BRAND}
            />
        </Grid>
    )
}

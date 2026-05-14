'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    TrendingUp, 
    Wallet, 
    BarChart3, 
    AlertCircle, 
    HeartHandshake, 
    UserCheck, 
    GraduationCap, 
    ShoppingBag 
} from 'lucide-react'

/**
 * AdminAnalyticsGrid: Advanced component that groups analytics cards for the Admin Dashboard.
 * Extracted from AdminSectionContent.
 * Preserves the exact 1/2/4 column responsive grid and card sequence.
 */
export function AdminAnalyticsGrid() {
    return (
        <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
            <StatsCard 
                label="Lucro Líquido (Plataforma)"
                value="R$ 21,80"
                description="BRUTO: R$ 21,80 | CUSTOS: R$ 0,00"
                icon={TrendingUp}
                color={STORE_TOKENS.COLORS.SUCCESS}
            />
            <StatsCard 
                label="Faturamento Personais"
                value="R$ 370,00"
                description="MÉDIO: R$ 13,214 / PERSONAL"
                icon={Wallet}
                color={STORE_TOKENS.COLORS.INFO}
            />
            <StatsCard 
                label="Ticket Médio (RepTrail)"
                value="R$ 0,779"
                description="POR PERSONAL CADASTRADO"
                icon={BarChart3}
                color={STORE_TOKENS.COLORS.WARNING}
            />
            <StatsCard 
                label="Comissões Pendentes"
                value="R$ 0,00"
                description="ESTE MÊS: R$ 0,00"
                icon={AlertCircle}
                color={STORE_TOKENS.COLORS.ERROR}
            />
            <StatsCard 
                label="Afiliados"
                value="5"
                description="LUCRO TOTAL: R$ 0,00"
                icon={HeartHandshake}
                color="orange"
            />
            <StatsCard 
                label="Personais"
                value="28"
                description="0 EM PERÍODO DE TESTE"
                icon={UserCheck}
                color={STORE_TOKENS.COLORS.INFO}
            />
            <StatsCard 
                label="Alunos"
                value="20"
                description="9 COM PERSONAL | 2 AUTO-TREINO | 9 AVULSOS"
                icon={GraduationCap}
                color={STORE_TOKENS.COLORS.SUCCESS}
            />
            <StatsCard 
                label="Produtos Loja"
                value="17"
                description="18 CLIQUES TOTAIS"
                icon={ShoppingBag}
                color="orange"
            />
        </Grid>
    )
}

'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Grid } from '@/components/store/base/grid'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import {
    Users2, Users, ShoppingBag, TrendingUp, CreditCard, Activity, AlertCircle, HeartHandshake
} from 'lucide-react'

interface AdminStats {
    trainers?: number
    trialTrainers?: number
    students?: number
    studentsWithTrainer?: number
    autoTrainingCount?: number
    totalProducts?: number
    productClicks?: number
    monthlyPlatformProfit?: number
    monthlyOperationalCosts?: number
    monthlyTrainerVolume?: number
    trainerAverageTicket?: number
    platformTicketPerTrainer?: number
    pendingCommissions?: number
    commissionsThisMonth?: number
    affiliatesCount?: number
    affiliateTotalEarnings?: number
}

export function AdminIndicatorsSection({ stats }: { stats?: AdminStats }) {
    return (

        <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
            <StatsCard
                label="Personais"
                value={String(stats?.trainers || 0)}
                description={`${stats?.trialTrainers || 0} EM TESTE`}
                icon={Users2}
                color={STORE_TOKENS.COLORS.INFO}
            />
            <StatsCard
                label="Alunos"
                value={String(stats?.students || 0)}
                description={`${stats?.studentsWithTrainer || 0} C/ PERS. | ${stats?.autoTrainingCount || 0} AUTO`}
                icon={Users}
                color={STORE_TOKENS.COLORS.SUCCESS}
            />
            <StatsCard
                label="Produtos Loja"
                value={String(stats?.totalProducts || 0)}
                description={`${stats?.productClicks || 0} CLIQUES`}
                icon={ShoppingBag}
                color={STORE_TOKENS.COLORS.BRAND}
            />
            <StatsCard
                label="Lucro Líquido"
                value={`R$ ${Number(stats?.monthlyPlatformProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`CUSTOS: R$ ${Number(stats?.monthlyOperationalCosts || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={TrendingUp}
                color={STORE_TOKENS.COLORS.SUCCESS}
            />
            <StatsCard
                label="Faturamento Personais"
                value={`R$ ${Number(stats?.monthlyTrainerVolume || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`MÉDIO: R$ ${Number(stats?.trainerAverageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={CreditCard}
                color={STORE_TOKENS.COLORS.INFO}
            />
            <StatsCard
                label="Ticket Médio"
                value={`R$ ${Number(stats?.platformTicketPerTrainer || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description="POR PERSONAL"
                icon={Activity}
                color={STORE_TOKENS.COLORS.WARNING}
            />
            <StatsCard
                label="Comissões Pendentes"
                value={`R$ ${Number(stats?.pendingCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`MÊS: R$ ${Number(stats?.commissionsThisMonth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={AlertCircle}
                color={STORE_TOKENS.COLORS.ERROR}
            />
            <StatsCard
                label="Afiliados"
                value={String(stats?.affiliatesCount || 0)}
                description={`LUCRO: R$ ${Number(stats?.affiliateTotalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={HeartHandshake}
                color={STORE_TOKENS.COLORS.BRAND}
            />
        </Grid>

    )
}

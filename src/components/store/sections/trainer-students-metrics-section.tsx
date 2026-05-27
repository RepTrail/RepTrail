'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerStudents, getTrainerProfile, getTrainerRanking } from '@/actions/trainer-actions'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Users, Wallet, Activity, BarChart3 } from 'lucide-react'

interface TrainerStudentsMetricsSectionProps {
    userId: string
}

export function TrainerStudentsMetricsSection({ userId }: TrainerStudentsMetricsSectionProps) {
    const { data: students = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.students(userId),
        queryFn: () => getTrainerStudents(userId),
    })
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.trainer.profile(userId),
        queryFn: () => getTrainerProfile(userId),
    })
    const { data: fullRanking = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.ranking(),
        queryFn: getTrainerRanking,
    })

    const currentTier = (profile?.plan_tier as 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'
    const TIER_LIMITS = {
        on_demand: 5,
        start: 10,
        pro: 50,
        elite: Infinity
    }
    const limit = TIER_LIMITS[currentTier] || 5
    const limitDisplay = limit === Infinity ? '∞' : String(limit)

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const activeStudentsCount = students.filter((s: any) => s.active).length
    const totalRevenue = students.filter((s: any) => s.active).reduce((acc: number, curr: any) => acc + (Number(curr.monthly_fee) || 0), 0)

    return (
        <RegistrySection
            title="Resumo Financeiro"
            subtitle="Visão geral dos seus indicadores de desempenho."
            icon={BarChart3}
        >
            <Grid cols={{ base: 1, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <StatsCard
                    label="Alunos Ativos"
                    value={`${activeStudentsCount} / ${limitDisplay}`}
                    icon={Users}
                    {...{
                        color: "primary",
                    }} />
                <StatsCard
                    label="Receita Mensal"
                    value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={Wallet}
                    {...{
                        color: "primary",
                    }} />
                <StatsCard
                    label="Ranking Geral"
                    value={`${userRank}º`}
                    icon={Activity}
                    {...{
                        color: "primary",
                    }} />
            </Grid>
        </RegistrySection>
    );
}

'use client'

import React from 'react'
import { useQuery, actions } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerStudents, getTrainerProfile, getTrainerRanking } from '@/lib/dal/remote'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
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
    const { data: studentLimitFromDb } = useQuery({
        queryKey: ['plan-student-limit', userId],
        queryFn: () => actions.trainerFeatureLimit(userId, 'student_limit'),
    })

    const limit = studentLimitFromDb === undefined ? 9999 : (studentLimitFromDb ?? 9999)
    const limitDisplay = limit === 9999 ? '∞' : String(limit)

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const activeStudentsCount = students.filter((s: any) => s.active).length
    const totalRevenue = students.filter((s: any) => s.active).reduce((acc: number, curr: any) => acc + (Number(curr.monthly_fee) || 0), 0)

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={BarChart3} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Resumo Financeiro</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Visão geral dos seus indicadores de desempenho.</Font>
                </Stack>
            </Stack>
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
        </Stack>
    );
}

'use client'

import { useQuery, actions } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerStudents, getTrainerProfile, getTrainerRanking } from '@/lib/dal/remote'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { Users, Wallet, Activity } from 'lucide-react'

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
    const limitDisplay = (limit === 9999 || limit === 0) ? '∞' : String(limit)

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const activeStudentsCount = students.filter((s: any) => s.active).length
    const totalRevenue = students.filter((s: any) => s.active).reduce((acc: number, curr: any) => acc + (Number(curr?.monthly_fee) || 0), 0)

    return (
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
    );
}

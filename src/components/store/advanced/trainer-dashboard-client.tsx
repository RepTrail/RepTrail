'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'

import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getTrainerProfile,
    getTrainerRanking,
    getTrainerActivityFeed
} from '@/lib/dal/remote'


import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { Box } from '@/components/store/base/box'
import { LayoutDashboard, Users, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { TrainerDashboardSidebarPanel } from '@/components/store/advanced/trainer-dashboard-sidebar-panel'

// Deprecated features
import { ActivityFeed } from '@/components/store/advanced/activity-feed'
import { CodeAutoGenerator } from '@/components/store/advanced/code-auto-generator'

interface TrainerDashboardClientProps {
    userId: string
    betaTesterMode: boolean
}

export function TrainerDashboardClient({ userId, betaTesterMode }: TrainerDashboardClientProps) {
    // ─── Queries ──────────────────────────────────────────────────────────
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile(userId),
    })
    const { data: fullRanking = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.ranking(),
        queryFn: getTrainerRanking,
    })
    const { data: activities = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.activity(userId),
        queryFn: () => getTrainerActivityFeed(userId),
    })

    // Stats (These come from the profile/ranking or separate queries if needed)
    // For now we use the ones available in the profile or provided initial data
    const activeStudents = profile?.stats?.active_students || 0
    const newStudentsThisMonth = profile?.stats?.new_students_this_month || 0
    const monthlyRevenue = profile?.stats?.monthly_revenue || 0
    const totalRevenue = profile?.stats?.total_revenue || 0

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const tierName = Array.isArray(profile?.plans) ? profile.plans[0]?.name : (profile?.plans?.name || 'On Demand')
    const TierIcon = Activity
    const trainerCode = profile?.trainer_code?.trim().toUpperCase()
    const publicProfileHref = trainerCode ? `/personal/${trainerCode}` : undefined

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={LayoutDashboard} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"VISÃO GERAL"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Bem-vindo de volta. Acompanhe o desempenho do seu time."}</Font>
                    </Stack>
                </Stack>
            </Stack>
            <CodeAutoGenerator hasCode={!!profile?.trainer_code} />
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={TrendingUp} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Métricas Principais"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Visibilidade rápida da operação, faturamento e posição atual."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="Alunos Ativos"
                        value={String(activeStudents)}
                        icon={Users}
                        description={`Total de alunos ativos ${newStudentsThisMonth ? `(+ ${newStudentsThisMonth} este mês)` : ''}`}
                        {...{
                            color: "primary",
                        }} />
                    <StatsCard
                        label="Receita Mensal"
                        value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        icon={DollarSign}
                        description={`Total Est.: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        {...{
                            color: "primary",
                        }} />
                    <StatsCard
                        label="Ranking Geral"
                        value={`${userRank}º`}
                        icon={TierIcon}
                        description="Sua posição atual"
                        {...{
                            color: "primary",
                        }} />
                    <StatsCard
                        label="Seu Nível"
                        value={tierName}
                        icon={TrendingUp}
                        description="Seu plano atual no RepTrail (Ativo)"
                        {...{
                            color: "primary",
                        }} />
                </Grid>
              </Stack>
        </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Operação Diária"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Atividade recente, atalhos operacionais e gestão do perfil público."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <Grid cols={{ base: 1, lg: 12 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box lgColSpan={8} display="flex" direction="col" gap={STORE_TOKENS.SPACING.CONTAINER} overflow="hidden" fullWidth>
                        <ActivityFeed userId={userId} initialData={activities} />
                    </Box>

                    <Box lgColSpan={4}>
                        <TrainerDashboardSidebarPanel
                            trainerCode={profile?.trainer_code}
                            editProfileHref="/dashboard/trainer/profile"
                            publicProfileHref={publicProfileHref}
                            showImportTeaser={!betaTesterMode}
                            importHref="/dashboard/trainer/import-pdf"
                        />
                    </Box>
                </Grid>
              </Stack>
        </Stack>
        </Stack>
    );
}

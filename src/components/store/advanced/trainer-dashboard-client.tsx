'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getTrainerProfile,
    getTrainerRanking,
    getTrainerActivityFeed
} from '@/actions/trainer-actions'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { Box } from '@/components/store/base/box'
import { LayoutDashboard, Users, DollarSign, TrendingUp, Zap, Sparkles, Crown, Activity } from 'lucide-react'
import { TrainerDashboardSidebarSectionContent } from '@/components/store/sections/trainer-dashboard-sidebar-section-content'

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

    // ─── Derived State ───────────────────────────────────────────────────
    const currentTier = profile?.plan_tier || 'on_demand'

    // Stats (These come from the profile/ranking or separate queries if needed)
    // For now we use the ones available in the profile or provided initial data
    const activeStudents = profile?.stats?.active_students || 0
    const newStudentsThisMonth = profile?.stats?.new_students_this_month || 0
    const monthlyRevenue = profile?.stats?.monthly_revenue || 0
    const totalRevenue = profile?.stats?.total_revenue || 0

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const tierName = profile?.plan_tier
        ? profile.plan_tier.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'On Demand'

    const tierIcons: Record<string, any> = {
        on_demand: Activity,
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }
    const TierIcon = tierIcons[currentTier] || Activity
    const trainerCode = profile?.trainer_code?.trim().toUpperCase()
    const publicProfileHref = trainerCode ? `/personal/${trainerCode}` : undefined

    return (
        <RegistryMain
            title="VISÃO GERAL"
            subtitle="Bem-vindo de volta. Acompanhe o desempenho do seu time."
            icon={LayoutDashboard}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <CodeAutoGenerator hasCode={!!profile?.trainer_code} />
            <RegistrySection
                title="Métricas Principais"
                subtitle="Visibilidade rápida da operação, faturamento e posição atual."
                icon={TrendingUp}
            >
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
            </RegistrySection>
            <RegistrySection
                title="Operação Diária"
                subtitle="Atividade recente, atalhos operacionais e gestão do perfil público."
                icon={Activity}
            >
                <Grid cols={{ base: 1, lg: 12 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box lgColSpan={8} display="flex" direction="col" gap="container" overflow="hidden" fullWidth>
                        <ActivityFeed userId={userId} initialData={activities} />
                    </Box>

                    <Box lgColSpan={4}>
                        <TrainerDashboardSidebarSectionContent
                            trainerCode={profile?.trainer_code}
                            editProfileHref="/dashboard/trainer/profile"
                            publicProfileHref={publicProfileHref}
                            showImportTeaser={!betaTesterMode}
                            importHref="/dashboard/trainer/import-pdf"
                        />
                    </Box>
                </Grid>
            </RegistrySection>
        </RegistryMain>
    );
}

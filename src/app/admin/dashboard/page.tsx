'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { useQuery, useQueryClient, useAuthUser, actions } from '@/lib/dal'
import { useTransition } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    BarChart3, TrendingUp, CreditCard, Activity,
    AlertCircle, HeartHandshake, Users2, Users, ShoppingBag
} from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { useToast } from '@/hooks/use-toast'

import { AdminPayoutsManagement } from '@/components/store/sections/admin-payouts-management'
import { AdminOperationalCosts } from '@/components/store/sections/admin-operational-costs'
import { AdminTopProducts } from '@/components/store/sections/admin-top-products'

export default function AdminDashboardPage() {
    const queryClient = useQueryClient()
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const { data: stats } = useQuery({
        queryKey: QUERY_KEYS.admin.overview,
        queryFn: () => actions.getAdminOverview()
    })

    const { data: adminUser } = useAuthUser()

    const { data: payouts } = useQuery({
        queryKey: QUERY_KEYS.admin.payouts,
        queryFn: () => actions.getAdminPayouts()
    })

    const { data: costs } = useQuery({
        queryKey: QUERY_KEYS.admin.costs,
        queryFn: () => actions.getOperationalCosts()
    })

    const loadAll = () => {
        startTransition(async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.payouts }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs }),
            ])
            toast({ title: 'Dados atualizados!' })
        })
    }

    const handlePayoutAction = async (id: string, status: 'completed' | 'rejected') => {
        const res = await actions.updatePayoutStatus(id, status)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.payouts })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: status === 'completed' ? 'Saque confirmado!' : 'Saque rejeitado.' })
        } else {
            toast({ title: 'Erro ao processar saque', description: res.error, variant: 'destructive' })
        }
    }

    const handleAddCost = async (data: any) => {
        const res = await actions.addOperationalCost(data)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: 'Custo adicionado!' })
        } else {
            toast({ title: 'Erro ao adicionar custo', description: res.error, variant: 'destructive' })
        }
    }

    const handleDeleteCost = async (id: string) => {
        const res = await actions.deleteOperationalCost(id)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: 'Custo removido.' })
        } else {
            toast({ title: 'Erro ao remover custo', description: res.error, variant: 'destructive' })
        }
    }

    return (
        <RegistryMain
                    title="Visão Geral"
                    subtitle="Visão geral financeira e operacional da plataforma RepTrail."
                    icon={BarChart3}
                    contextLabel="Painel Admin"
                    showTabs={false}
                >
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
                        {/* Indicadores de Performance */}
                        <RegistrySection
                            title="Indicadores de Performance"
                            subtitle="Visão consolidada de usuários, loja, finanças e parceiros."
                            icon={Activity}
                        >
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
                        </RegistrySection>

                        {/* Gestão Financeira: Saques e Custos */}
                        <AdminPayoutsManagement
                            initialPayouts={payouts?.data || []}
                        />

                        <AdminOperationalCosts
                            initialCosts={costs || []}
                            totalMonthly={stats?.monthlyOperationalCosts || 0}
                            totalAllTime={stats?.totalOperationalCosts || 0}
                        />

                        <AdminTopProducts />

                    </Stack>
                </RegistryMain>
    );
}

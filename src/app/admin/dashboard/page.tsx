'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTransition } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    BarChart3, TrendingUp, CreditCard, Activity,
    AlertCircle, HeartHandshake, Users2, Users, ShoppingBag
} from 'lucide-react'
import { 
    getAdminOverview, getAllStoreProducts, getTopProductsByClicks, 
    getRecentStudentActivity, getOperationalCosts,
    addOperationalCost, deleteOperationalCost
} from '@/actions/admin-actions'
import { getAdminPayouts, updatePayoutStatus } from '@/actions/admin-affiliate-actions'
import { createClient } from '@/lib/supabase/client'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { ActionableListCard } from '@/components/store/intermediary/actionable-list-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
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
        queryFn: () => getAdminOverview()
    })

    const { data: adminUser } = useQuery({
        queryKey: QUERY_KEYS.auth.user,
        queryFn: async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return null
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
            return profile || authUser
        }
    })

    const { data: payouts } = useQuery({
        queryKey: QUERY_KEYS.admin.payouts,
        queryFn: () => getAdminPayouts()
    })

    const { data: costs } = useQuery({
        queryKey: QUERY_KEYS.admin.costs,
        queryFn: () => getOperationalCosts()
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
        const res = await updatePayoutStatus(id, status)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.payouts })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: status === 'completed' ? 'Saque confirmado!' : 'Saque rejeitado.' })
        } else {
            toast({ title: 'Erro ao processar saque', description: res.error, variant: 'destructive' })
        }
    }

    const handleAddCost = async (data: any) => {
        const res = await addOperationalCost(data)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: 'Custo adicionado!' })
        } else {
            toast({ title: 'Erro ao adicionar custo', description: res.error, variant: 'destructive' })
        }
    }

    const handleDeleteCost = async (id: string) => {
        const res = await deleteOperationalCost(id)
        if (res.success) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            toast({ title: 'Custo removido.' })
        } else {
            toast({ title: 'Erro ao remover custo', description: res.error, variant: 'destructive' })
        }
    }

    return (
        <RegistryProvider defaultColor="red">
            <DashboardShell
                color="red"
                links={[
                    { href: '/admin/dashboard', label: 'Início', icon: 'BarChart3', exact: true },
                    { href: '/admin/personais', label: 'Personais', icon: 'UserCheck' },
                    { href: '/admin/alunos', label: 'Alunos', icon: 'Users' },
                    { href: '/admin/afiliados', label: 'Afiliados', icon: 'HeartHandshake' },
                    { href: '/admin/loja', label: 'Loja', icon: 'ShoppingBag' },
                    { href: '/admin/logs', label: 'Logs', icon: 'Activity' },
                ]}
                user={{
                    id: adminUser?.id || 'admin',
                    name: adminUser?.full_name || 'Admin RepTrail',
                    email: adminUser?.email || 'admin@reptrail.com.br',
                    avatar_url: adminUser?.avatar_url || null,
                }}
                profileHref="/dashboard"
                profileIcon="ArrowRightLeft"
            >
                <RegistryMain
                    title="Visão Geral"
                    subtitle="Visão geral financeira e operacional da plataforma RepTrail."
                    icon={BarChart3}
                    contextLabel="Painel Admin"
                    showTabs={false}
                >
                    <Stack gap="section">
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
                                    color="blue"
                                />
                                <StatsCard
                                    label="Alunos"
                                    value={String(stats?.students || 0)}
                                    description={`${stats?.studentsWithTrainer || 0} C/ PERS. | ${stats?.autoTrainingCount || 0} AUTO`}
                                    icon={Users}
                                    color="emerald"
                                />
                                <StatsCard
                                    label="Produtos Loja"
                                    value={String(stats?.totalProducts || 0)}
                                    description={`${stats?.productClicks || 0} CLIQUES`}
                                    icon={ShoppingBag}
                                    color="orange"
                                />
                                <StatsCard
                                    label="Lucro Líquido"
                                    value={`R$ ${Number(stats?.monthlyPlatformProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    description={`CUSTOS: R$ ${Number(stats?.monthlyOperationalCosts || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    icon={TrendingUp}
                                    color="emerald"
                                />
                                <StatsCard
                                    label="Faturamento Personais"
                                    value={`R$ ${Number(stats?.monthlyTrainerVolume || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    description={`MÉDIO: R$ ${Number(stats?.trainerAverageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    icon={CreditCard}
                                    color="blue"
                                />
                                <StatsCard
                                    label="Ticket Médio"
                                    value={`R$ ${Number(stats?.platformTicketPerTrainer || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    description="POR PERSONAL"
                                    icon={Activity}
                                    color="amber"
                                />
                                <StatsCard
                                    label="Comissões Pendentes"
                                    value={`R$ ${Number(stats?.pendingCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    description={`MÊS: R$ ${Number(stats?.commissionsThisMonth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    icon={AlertCircle}
                                    color="red"
                                />
                                <StatsCard
                                    label="Afiliados"
                                    value={String(stats?.affiliatesCount || 0)}
                                    description={`LUCRO: R$ ${Number(stats?.affiliateTotalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    icon={HeartHandshake}
                                    color="orange"
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
            </DashboardShell>
        </RegistryProvider>
    )
}

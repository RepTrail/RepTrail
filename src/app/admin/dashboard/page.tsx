'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTransition } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    BarChart3, TrendingUp, CreditCard, Activity,
    AlertCircle, HeartHandshake, Users2, Users, ShoppingBag
} from 'lucide-react'
import {
    getAdminOverview, getAllStoreProducts, getTopProductsByClicks,
    getRecentStudentActivity
} from '@/actions/admin-actions'
import { createClient } from '@/lib/supabase/client'
import { AdminPageShell } from '@/components/store/advanced/admin-page-shell'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { useToast } from '@/hooks/use-toast'

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

    const loadAll = () => {
        startTransition(async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview }),
            ])
            toast({ title: 'Dados atualizados!' })
        })
    }

    return (
        <AdminPageShell
            pageTitle="Visão Geral"
            subtitle="Visão geral financeira e operacional da plataforma RepTrail."
            icon={BarChart3}
            user={{
                id: adminUser?.id || 'admin',
                name: adminUser?.full_name || 'Admin RepTrail',
                email: adminUser?.email || 'admin@reptrail.com.br',
                avatar_url: adminUser?.avatar_url || null,
            }
            }
        >
            <Stack gap="section">
                {/* Base de Usuários e Loja */}
                <RegistrySection
                    title="Base de Usuários e Loja"
                    subtitle="Monitoramento de crescimento da base e engajamento no catálogo."
                    icon={Users}
                >
                    <Grid cols={1} mdCols={2} lgCols={3} gap={5}>
                        <StatsCard
                            label="Personais"
                            value={String(stats?.trainers || 0)}
                            description={`${stats?.trialTrainers || 0} EM PERÍODO DE TESTE`}
                            icon={Users2}
                            color="blue"
                        />
                        <StatsCard
                            label="Alunos"
                            value={String(stats?.students || 0)}
                            description={`${stats?.studentsWithTrainer || 0} COM PERSONAL | ${stats?.autoTrainingCount || 0} AUTO-TREINO`}
                            icon={Users}
                            color="emerald"
                        />
                        <StatsCard
                            label="Produtos Loja"
                            value={String(stats?.totalProducts || 0)}
                            description={`${stats?.productClicks || 0} CLIQUES TOTAIS`}
                            icon={ShoppingBag}
                            color="orange"
                        />
                    </Grid>
                </RegistrySection>

                {/* Indicadores Financeiros */}
                <RegistrySection
                    title="Indicadores Financeiros"
                    subtitle="Desempenho monetário bruto e líquido da operação RepTrail."
                    icon={TrendingUp}
                >
                    <Grid cols={1} mdCols={2} lgCols={3} gap={5}>
                        <StatsCard
                            label="Lucro Líquido (Plataforma)"
                            value={`R$ ${Number(stats?.monthlyPlatformProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            description={`BRUTO: R$ ${Number(stats?.monthlyGrossRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | CUSTOS: R$ ${Number(stats?.monthlyOperationalCosts || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon={TrendingUp}
                            color="emerald"
                        />
                        <StatsCard
                            label="Faturamento Personais"
                            value={`R$ ${Number(stats?.monthlyTrainerVolume || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            description={`MÉDIO: R$ ${Number(stats?.trainerAverageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / PERSONAL`}
                            icon={CreditCard}
                            color="blue"
                        />
                        <StatsCard
                            label="Ticket Médio (RepTrail)"
                            value={`R$ ${Number(stats?.platformTicketPerTrainer || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            description="POR PERSONAL CADASTRADO"
                            icon={Activity}
                            color="amber"
                        />
                    </Grid>
                </RegistrySection>

                {/* Performance de Parceiros */}
                <RegistrySection
                    title="Performance de Parceiros"
                    subtitle="Gestão de comissões e engajamento da rede de afiliados."
                    icon={HeartHandshake}
                >
                    <Grid cols={1} mdCols={2} lgCols={2} gap={5}>
                        <StatsCard
                            label="Comissões Pendentes"
                            value={`R$ ${Number(stats?.pendingCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            description={`ESTE MÊS: R$ ${Number(stats?.commissionsThisMonth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon={AlertCircle}
                            color="red"
                        />
                        <StatsCard
                            label="Afiliados"
                            value={String(stats?.affiliatesCount || 0)}
                            description={`LUCRO TOTAL: R$ ${Number(stats?.affiliateTotalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon={HeartHandshake}
                            color="orange"
                        />
                    </Grid>
                </RegistrySection>


            </Stack>
        </AdminPageShell >
    )
}

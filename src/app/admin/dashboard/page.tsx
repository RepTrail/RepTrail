'use client'

import { useQuery, useQueryClient, useAuthUser, actions } from '@/lib/dal'
import { useTransition } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import { BarChart3, Activity, Banknote, TrendingUp, TrendingDown } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { useToast } from '@/hooks/use-toast'

import { AdminIndicatorsSection } from '@/components/store/sections/admin-indicators-section'
import { AdminPayoutsManagementPanel } from '@/components/store/advanced/admin-payouts-management-panel'
import { AdminOperationalCostsPanel } from '@/components/store/advanced/admin-operational-costs-panel'
import { AdminTopProductsPanel } from '@/components/store/advanced/admin-top-products-panel'

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
            <RegistrySection
                title="Indicadores de Performance"
                subtitle="Visão consolidada de usuários, loja, finanças e parceiros."
                icon={Activity}
            >
                <AdminIndicatorsSection stats={stats || undefined} />
            </RegistrySection>

            <RegistrySection
                title="Solicitações de Saque"
                subtitle="Gestão de pagamentos e transferências para afiliados."
                icon={Banknote}
            >
                <AdminPayoutsManagementPanel
                    initialPayouts={payouts?.data || []}
                />
            </RegistrySection>

            <RegistrySection
                title="Custos Operacionais"
                subtitle="Infraestrutura e operação mensal da plataforma."
                icon={TrendingDown}
            >
                <AdminOperationalCostsPanel initialCosts={costs || []} />
            </RegistrySection>

            <RegistrySection
                title="Produtos Mais Clicados"
                subtitle="Engajamento de alunos com produtos da loja RepTrail."
                icon={TrendingUp}
            >
                <AdminTopProductsPanel />
            </RegistrySection>
        </RegistryMain>
    );
}

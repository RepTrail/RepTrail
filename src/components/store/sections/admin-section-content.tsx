'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    TrendingUp, 
    Wallet, 
} from 'lucide-react'
import { AdminUsersManagementPanel } from '@/components/store/advanced/admin-users-management-panel'
import { AdminProductsCatalogPanel } from '@/components/store/advanced/admin-products-catalog-panel'
import { AdminActivityLogsPanel } from '@/components/store/advanced/admin-activity-logs-panel'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminAnalyticsGrid } from '@/components/store/advanced/admin-analytics-grid'
import { AdminPayoutsManagement } from '@/components/store/advanced/admin-payouts-management'
import { AdminOperationalCosts } from '@/components/store/advanced/admin-operational-costs'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'

export function AdminSectionContent({ id }: { id?: string }) {
    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* Dashboard Overview */}
            <RegistrySection 
                id={id}
                title="Dashboard Admin" 
                icon={TrendingUp} 
                subtitle="Componentes analíticos e de gestão financeira para a interface administrativa."
            >
                <AdminAnalyticsGrid />
            </RegistrySection>

            {/* Gestão Financeira: Saques e Custos */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <AdminPayoutsManagement 
                    initialPayouts={[
                        {
                            id: '1',
                            amount: 450,
                            status: 'requested',
                            payout_method: 'pix',
                            payout_details: { details: 'thiago@pix.com' },
                            created_at: new Date().toISOString(),
                            affiliate_id: 'aff_1',
                            profiles: { full_name: 'Thiago Nigro', email: 'thiago@rich.com' }
                        }
                    ]} 
                />
                
                <EmptyState 
                    icon={Wallet}
                    title="Nenhuma solicitação de saque"
                    description="Não há pedidos de transferência pendentes para demonstração no momento."
                />
            </Stack>

            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <AdminOperationalCosts 
                    initialCosts={[
                        {
                            id: 'c1',
                            description: 'Servidor Vercel (Pro)',
                            amount: 120,
                            type: 'fixed',
                            created_at: new Date().toISOString()
                        },
                        {
                            id: 'c2',
                            description: 'API Google Maps',
                            amount: 45.50,
                            type: 'variable',
                            created_at: new Date().toISOString()
                        }
                    ]}
                    totalMonthly={165.50}
                    totalAllTime={1240.80}
                />

                <EmptyState 
                    icon={TrendingUp}
                    title="Sem custos registrados"
                    description="A listagem de custos operacionais aparecerá vazia caso não existam lançamentos no período."
                />
            </Stack>

            {/* Gestão de Usuários (Personals, Afiliados, Alunos) */}
            <AdminUsersManagementPanel />

            {/* Catálogo de Produtos */}
            <AdminProductsCatalogPanel />

            {/* Logs de Atividade */}
            <AdminActivityLogsPanel />
        </Stack>
    )
}

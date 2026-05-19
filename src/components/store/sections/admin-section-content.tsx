'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    TrendingUp, 
    Wallet, 
} from 'lucide-react'
import { AdminUsersManagementPanel } from '@/components/store/advanced/admin-users-management-panel'
import { AdminProductsCatalogPanel } from '@/components/store/advanced/admin-products-catalog-panel'
import { LogItem } from '@/components/store/intermediary/log-item'
import { History } from 'lucide-react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminAnalyticsGrid } from '@/components/store/advanced/admin-analytics-grid'
import { AdminPayoutsManagement } from '@/components/store/sections/admin-payouts-management'
import { AdminOperationalCosts } from '@/components/store/sections/admin-operational-costs'
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
            <RegistrySection
                title="Logs de Atividade"
                icon={History}
                subtitle="Rastro de auditoria de todas as ações realizadas no painel administrativo."
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <LogItem 
                        action="UPDATE_USER_ROLE"
                        admin="Marcos Vinicius"
                        target="ALUNO_CARLOS"
                        details={{ from: 'FREE', to: 'PREMIUM', method: 'MANUAL_ADMIN' }}
                        date="há 5 minutos"
                        variant="blue"
                    />
                    <LogItem 
                        action="ACTIVATE_ONDEMAND"
                        admin="Juliana Silva"
                        target="PERSONAL_JULIANA"
                        details={{ service: 'ON_DEMAND_V2', status: 'ACTIVE' }}
                        date="há 12 minutos"
                        variant="orange"
                    />
                    <LogItem 
                        action="DELETE_PRODUCT"
                        admin="Sistema"
                        target="PROD_TEST_01"
                        details="Remoção automática de produto sem estoque há 30 dias."
                        date="há 1 hora"
                        variant="red"
                    />

                    <EmptyState 
                        icon={History}
                        title="Sem mais atividades"
                        description="Não há registros adicionais de auditoria para o período selecionado."
                    />
                </Stack>
            </RegistrySection>
        </Stack>
    )
}

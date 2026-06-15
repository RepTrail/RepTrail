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
import { AdminAnalyticsGrid } from '@/components/store/advanced/admin-analytics-grid'
import { AdminPayoutsManagementPanel } from '@/components/store/advanced/admin-payouts-management-panel'
import { AdminOperationalCostsPanel } from '@/components/store/advanced/admin-operational-costs-panel'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'

export function AdminSectionContent({ id: _id }: { id?: string }) {
    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* Dashboard Overview */}
            <Stack>
                <AdminAnalyticsGrid />
            </Stack>

            {/* Gestão Financeira: Saques e Custos */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <AdminPayoutsManagementPanel 
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
                <AdminOperationalCostsPanel 
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
            <Stack>
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
            </Stack>
        </Stack>
    )
}

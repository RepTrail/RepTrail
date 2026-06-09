'use client'

import { Stack } from '@/components/store/base/stack'
import { CommissionItem } from '@/components/store/intermediary/commission-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { DollarSign } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AffiliateCommissionsListProps {
    commissions: any[]
}

/**
 * AffiliateCommissionsList: Manages the rendering of commission items.
 * - Handles status labeling and color mapping logic.
 * - Manages the loop and empty state for commissions.
 * - Responsibility: Commissions domain display logic.
 */
export function AffiliateCommissionsList({ commissions }: AffiliateCommissionsListProps) {
    const statusColor = (status: string): 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' => {
        if (['confirmed', 'paid', 'completed'].includes(status)) return 'emerald'
        if (['pending', 'processing', 'requested'].includes(status)) return 'amber'
        return 'red'
    }

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado',
            paid: 'Pago', requested: 'Solicitado', processing: 'Processando',
            completed: 'Concluído', rejected: 'Rejeitado',
        }
        return map[s] || s
    }

    if (commissions.length === 0) {
        return (
            <EmptyState
                icon={DollarSign}
                title="Nenhuma comissão registrada"
                description="Suas vendas aparecerão aqui em tempo real."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {commissions.map((c: any) => (
                <CommissionItem
                    key={c.id}
                    description={c.description || 'Comissão de Venda'}
                    amount={Number(c.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    date={new Date(c.created_at).toLocaleDateString('pt-BR')}
                    time={new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    status={c.status}
                    statusLabel={statusLabel(c.status)}
                    statusColor={statusColor(c.status)}
                />
            ))}
        </Stack>
    )
}

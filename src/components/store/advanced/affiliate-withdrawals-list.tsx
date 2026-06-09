'use client'

import { Stack } from '@/components/store/base/stack'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { AlertCircle } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AffiliateWithdrawalsListProps {
    payouts: any[]
}

/**
 * AffiliateWithdrawalsList: Manages the rendering of payout/withdrawal items.
 * - Handles ID formatting and status mapping.
 * - Responsibility: Withdrawals domain display logic.
 */
export function AffiliateWithdrawalsList({ payouts }: AffiliateWithdrawalsListProps) {
    if (payouts.length === 0) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Sem saques"
                description="Seus pagamentos aparecerão aqui."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {payouts.map((p: any) => (
                <WithdrawalItem
                    key={p.id}
                    id={p.id.substring(0, 8)}
                    amount={`R$ ${Number(p.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    date={new Date(p.created_at).toLocaleDateString('pt-BR')}
                    method={p.payout_method || 'PIX'}
                    recipient="Você"
                    status={p.status === 'completed' || p.status === 'paid' ? 'completed' : p.status === 'rejected' ? 'rejected' : 'pending'}
                />
            ))}
        </Stack>
    )
}

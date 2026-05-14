'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { GlassPanel } from '@/components/store/base/surface'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Search, DollarSign } from 'lucide-react'

interface Referral {
    id: string
    full_name: string | null
    email: string
    created_at: string
    role: string
}

interface Commission {
    id: string
    amount: number
    created_at: string
    status: string
    description: string | null
}

interface AffiliateActivityFeedProps {
    recentReferrals: Referral[]
    recentCommissions: Commission[]
}

export function AffiliateConversionTracker({ recentReferrals, recentCommissions }: AffiliateActivityFeedProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" justify="between" align="center">
                        <Font variant="label-caps">Novos Indicados</Font>
                        <Button variant="outline-primary" padding={STORE_TOKENS.PADDING.ELEMENT} onClick={() => window.location.href = '/dashboard/affiliate/referrals'}>
                            <Font variant="sub-tiny" weight="black">Ver Todos</Font>
                        </Button>
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {recentReferrals.slice(0, 3).length > 0 ? (
                            recentReferrals.slice(0, 3).map((r: any) => (
                                <UserListItem
                                    key={r.id}
                                    name={r.full_name || r.email}
                                    email={r.email}
                                    registrationDate={new Date(r.created_at).toLocaleDateString('pt-BR')}
                                    role={r.role === 'trainer' ? 'personal' : 'aluno'}
                                    roleLabel={r.role === 'trainer' ? 'PERSONAL' : 'ALUNO'}
                                    initials={r.full_name?.substring(0, 2).toUpperCase() || '?'}
                                    avatarVariant={r.role === 'trainer' ? 'emerald' : 'orange'}
                                />
                            ))
                        ) : (
                            <EmptyState icon={Search} title="Nenhum indicado" description="Aguardando novas conversões." />
                        )}
                    </Stack>
                </Stack>
            </GlassPanel>

            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" justify="between" align="center">
                        <Font variant="label-caps">Ganhos Recentes</Font>
                        <Button variant="outline-primary" padding={STORE_TOKENS.PADDING.ELEMENT} onClick={() => window.location.href = '/dashboard/affiliate/earnings'}>
                            <Font variant="sub-tiny" weight="black">Ver Extrato</Font>
                        </Button>
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {recentCommissions.slice(0, 3).length > 0 ? (
                            recentCommissions.slice(0, 3).map((c: any) => (
                                <WithdrawalItem
                                    key={c.id}
                                    id={c.id.substring(0, 8)}
                                    amount={`R$ ${Number(c.amount).toFixed(2)}`}
                                    date={new Date(c.created_at).toLocaleDateString('pt-BR')}
                                    method={c.description || 'Comissão'}
                                    recipient=""
                                    status={c.status === 'confirmed' ? 'completed' : 'pending'}
                                />
                            ))
                        ) : (
                            <EmptyState icon={DollarSign} title="Sem ganhos" description="Sua primeira venda aparecerá aqui." />
                        )}
                    </Stack>
                </Stack>
            </GlassPanel>
        </Stack>
    )
}

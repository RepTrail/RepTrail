'use client'

import React from 'react'
import { getAffiliateReferrals } from '@/actions/affiliate-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { Users, TrendingUp, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AffiliateReferralsContent() {
    const { data: referrals = [] } = useQuery({
        queryKey: ['affiliate-referrals'],
        queryFn: () => getAffiliateReferrals(),
        staleTime: 1000 * 60 * 5
    })

    const total = referrals.length
    const active = referrals.filter(r => r.status === 'active').length
    const conversion = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0'

    return (
        <>
            <RegistrySection
                title="Performance de Rede"
                subtitle="Métricas detalhadas de conversão da sua base de indicados."
                icon={TrendingUp}
            >
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="TOTAL DE CADASTROS"
                        value={String(total)}
                        icon={Users}
                        color={STORE_TOKENS.COLORS.BRAND}
                    />
                    <StatsCard
                        label="CLIENTES ATIVOS"
                        value={String(active)}
                        description="PAGANTES CONFIRMADOS"
                        icon={TrendingUp}
                        color={STORE_TOKENS.COLORS.SUCCESS}
                    />
                    <StatsCard
                        label="TAXA DE ASSINATURA"
                        value={`${conversion}%`}
                        description="DE CADASTRO PARA ATIVO"
                        icon={TrendingUp}
                        color={STORE_TOKENS.COLORS.WARNING}
                    />
                </Grid>
            </RegistrySection>

            <RegistrySection
                title={`Lista Completa de Indicados (${total})`}
                subtitle="Histórico detalhado de todos os cadastros realizados."
                icon={Search}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {referrals.length > 0 ? (
                        referrals.map((r) => (
                            <UserListItem
                                key={r.id}
                                name={r.full_name || 'Usuário sem nome'}
                                email={r.email || ''}
                                registrationDate={new Date(r.created_at).toLocaleDateString('pt-BR')}
                                role={r.role === 'trainer' ? 'personal' : 'aluno'}
                                roleLabel={r.role === 'trainer' ? 'PERSONAL TRAINER' : 'ALUNO PREMIUM'}
                                initials={r.full_name?.substring(0, 2).toUpperCase() || '?'}
                                avatarUrl={r.avatar_url}
                                avatarVariant={r.role === 'trainer' ? 'orange' : 'emerald'}
                            />
                        ))
                    ) : (
                        <Box padding={0}>
                            <EmptyState
                                icon={Search}
                                title="Nenhum indicado encontrado"
                                description="Compartilhe seu link exclusivo para começar a construir sua rede."
                            />
                        </Box>
                    )}
                </Stack>
            </RegistrySection>
        </>
    )
}


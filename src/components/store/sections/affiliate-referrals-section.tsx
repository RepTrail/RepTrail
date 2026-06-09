'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { Users, TrendingUp, Search } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { getAffiliateReferrals } from '@/lib/dal/remote'

export function AffiliateReferralsSection() {
    const { data: referrals = [] } = useQuery({
        queryKey: ['affiliate-referrals'],
        queryFn: () => getAffiliateReferrals(),
        staleTime: 1000 * 60 * 5
    })

    const total = referrals.length
    const active = referrals.filter(r => r.status === 'active').length
    const conversion = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0'

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={TrendingUp} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Performance de Rede</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Métricas detalhadas de conversão da sua base de indicados.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="TOTAL DE CADASTROS"
                        value={String(total)}
                        icon={Users}
                        color={STORE_TOKENS.COLORS.BRAND} />
                    <StatsCard
                        label="CLIENTES ATIVOS"
                        value={String(active)}
                        description="PAGANTES CONFIRMADOS"
                        icon={TrendingUp}
                        color={STORE_TOKENS.COLORS.SUCCESS} />
                    <StatsCard
                        label="TAXA DE ASSINATURA"
                        value={`${conversion}%`}
                        description="DE CADASTRO PARA ATIVO"
                        icon={TrendingUp}
                        color={STORE_TOKENS.COLORS.WARNING} />
                </Grid>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Search} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{`Lista Completa de Indicados (${total})`}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Histórico detalhado de todos os cadastros realizados.</Font>
                    </Stack>
                </Stack>
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
                        <Box padding={STORE_TOKENS.PADDING.NONE}>
                            <EmptyState
                                icon={Search}
                                title="Nenhum indicado encontrado"
                                description="Compartilhe seu link exclusivo para começar a construir sua rede."
                            />
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}

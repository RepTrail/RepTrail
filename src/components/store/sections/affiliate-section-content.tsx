'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateLinkSharingPanel } from '@/components/store/advanced/affiliate-link-sharing-panel'
import { AffiliateWalletSummary } from '@/components/store/intermediary/affiliate-wallet-summary'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'
import { Input } from '@/components/store/base/input'
import {
    Link as LinkIcon,
    Copy,
    MousePointer2,
    Users,
    TrendingUp,
    DollarSign,
    Wallet,
    ArrowUpRight,
    History,
    Search
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { StatsCard } from '@/components/store/intermediary/stats-card'

export function AffiliateSectionContent({ id }: { id?: string }) {
    const { primaryColor } = useRegistry()

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* Affiliate Link Section - Dynamic Theme */}
            <AffiliateLinkSharingPanel id={id} />

            {/* Performance Stats */}
            <RegistrySection
                title="Performance do Link"
                icon={TrendingUp}
                subtitle="Métricas detalhadas de engajamento e alcance do seu link de indicação."
            >
                <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <StatsCard
                        label="Clicks no Link"
                        value="1"
                        description="TOTAL ACUMULADO"
                        icon={MousePointer2}
                        color={STORE_TOKENS.COLORS.BRAND}
                    />
                    <StatsCard
                        label="Indicados"
                        value="0"
                        description="0 PERSONAIS ATIVOS"
                        icon={Users}
                        color={STORE_TOKENS.COLORS.BRAND}
                    />
                    <StatsCard
                        label="Conversão"
                        value="0.0%"
                        description="CLICK → CADASTRO"
                        icon={TrendingUp}
                        color={STORE_TOKENS.COLORS.BRAND}
                    />
                    <StatsCard
                        label="Ganhos Totais"
                        value="R$ 0,00"
                        description="R$ 0,00 PENDENTE"
                        icon={DollarSign}
                        color={STORE_TOKENS.COLORS.BRAND}
                    />
                </Grid>
            </RegistrySection>

            {/* Wallet & Lists */}
            <Grid cols={1} lgCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Indicados Recentes */}
                <Box lgColSpan={2}>
                    <RegistrySection
                        title="Indicados Recentes"
                        icon={Users}
                        subtitle="Histórico de cadastros realizados através do seu link de afiliado."
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <UserListItem
                                name="Marcos Vinicius"
                                email="marcos@reptrail.com.br"
                                registrationDate="08/05/2024"
                                role="personal"
                                roleLabel="PERSONAL TRAINER"
                                initials="MV"
                                avatarVariant="primary"
                            />
                            <UserListItem
                                name="Ana Beatriz"
                                email="ana.bia@gmail.com"
                                registrationDate="há 2 horas"
                                role="aluno"
                                roleLabel="ALUNO PREMIUM"
                                initials="AB"
                                avatarVariant='primary'
                            />

                            <Box padding={0}>
                                <EmptyState
                                    icon={Search}
                                    title="Nenhum indicado ainda"
                                    description="Compartilhe seu link nas redes sociais para começar a construir sua rede."
                                />
                            </Box>
                        </Stack>
                    </RegistrySection>
                </Box>

                {/* Wallet Info */}
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <RegistrySection
                        title="Sua Carteira"
                        icon={Wallet}
                        subtitle="Gestão de saldo e solicitações de saque de comissões."
                    >
                        <AffiliateWalletSummary />
                    </RegistrySection>

                    <RegistrySection
                        title="Saques"
                        icon={History}
                        subtitle="Histórico de pagamentos e transferências realizadas."
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <WithdrawalItem
                                id="TRX-9928347"
                                amount="R$ 150,00"
                                date="06/05/2024"
                                method="PIX"
                                recipient="Marcos Vinicius"
                                status="completed"
                            />
                            <WithdrawalItem
                                id="TRX-1120394"
                                amount="R$ 45,80"
                                date="há 10 minutos"
                                method="PIX"
                                recipient="Ana Beatriz"
                                status="pending"
                            />

                            <Box padding={0}>
                                <EmptyState
                                    icon={History}
                                    title="Sem saques"
                                    description="Seus pagamentos aparecerão aqui."
                                />
                            </Box>
                        </Stack>
                    </RegistrySection>
                </Stack>
            </Grid>
        </Stack>
    )
}

'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Inline } from '../base/layout'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Surface } from '../base/surface'
import { StatsCard } from '../intermediary/stats-card'
import { EmptyState } from '../intermediary/empty-state'
import { UserListItem } from '../intermediary/user-list-item'
import { WithdrawalItem } from '../intermediary/withdrawal-item'
import { RegistrySection } from '../advanced/registry-section'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'
import { Input } from '../base/input'
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

export function AffiliateSectionContent({ id }: { id?: string }) {
    const { primaryColor } = useRegistry()

    return (
        <Stack gap={{ base: 12.5, md: 'section' }}>
            {/* Affiliate Link Section - Dynamic Theme */}
            <RegistrySection
                id={id}
                title="Marketing de Afiliados"
                icon={LinkIcon}
                subtitle="Compartilhe seu link exclusivo e ganhe comissões recorrentes sobre cada novo personal ou aluno indicado."
            >
                <Surface variant="glass" padding={5} rounded="system">
                    <Stack gap={5} width="full">
                        <Inline justify="between" align="end" wrap gap={5}>
                            <Stack gap={2.5} flex1 width="full" minWidth={0}>
                                <Inline gap={2.5} align="end" fullWidth>
                                    <Input
                                        label="Seu Link de Afiliado"
                                        value="https://reptrail.com.br/?ref=5w6loo6iks"
                                        readOnly
                                        icon={<LinkIcon size={16} className={cn(
                                            primaryColor === 'emerald' && "text-emerald-500",
                                            primaryColor === 'orange' && "text-orange-500",
                                            primaryColor === 'amber' && "text-amber-500",
                                            primaryColor === 'blue' && "text-blue-500",
                                            primaryColor === 'red' && "text-red-500"
                                        )} />}
                                        flex1
                                        color="primary"
                                        weight="black"
                                        className="font-mono"
                                    />

                                    <Button
                                        variant="outline-primary"
                                        isIconOnly
                                        rounded="system"
                                        className="h-12 w-12 shrink-0"
                                        onClick={() => {
                                            navigator.clipboard.writeText('https://reptrail.com.br/?ref=5w6loo6iks')
                                        }}
                                    >
                                        <Icon icon={Copy} size="sm" />
                                    </Button>
                                </Inline>

                                <Font variant="sub-tiny" color="zinc-600" italic>
                                    Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas
                                </Font>
                            </Stack>

                            <Stack gap={0} align="end" display={{ base: 'none', md: 'flex' }} paddingBottom={2.5}>
                                <Font variant="h1" color="white" weight="black" italic uppercase>10%</Font>
                                <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic tracking="widest">De Comissão</Font>
                            </Stack>
                        </Inline>
                    </Stack>
                </Surface>
            </RegistrySection>

            {/* Performance Stats */}
            <RegistrySection
                title="Performance do Link"
                icon={TrendingUp}
                subtitle="Métricas detalhadas de engajamento e alcance do seu link de indicação."
            >
                <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                    <StatsCard
                        label="Clicks no Link"
                        value="1"
                        description="TOTAL ACUMULADO"
                        icon={MousePointer2}
                        color="primary"
                    />
                    <StatsCard
                        label="Indicados"
                        value="0"
                        description="0 PERSONAIS ATIVOS"
                        icon={Users}
                        color="primary"
                    />
                    <StatsCard
                        label="Conversão"
                        value="0.0%"
                        description="CLICK → CADASTRO"
                        icon={TrendingUp}
                        color="primary"
                    />
                    <StatsCard
                        label="Ganhos Totais"
                        value="R$ 0,00"
                        description="R$ 0,00 PENDENTE"
                        icon={DollarSign}
                        color="primary"
                    />
                </Grid>
            </RegistrySection>

            {/* Wallet & Lists */}
            <Grid cols={1} lgCols={3} gap={5}>
                {/* Indicados Recentes */}
                <Box lgColSpan={2}>
                    <RegistrySection
                        title="Indicados Recentes"
                        icon={Users}
                        subtitle="Histórico de cadastros realizados através do seu link de afiliado."
                    >
                        <Stack gap={2.5}>
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

                            <Box paddingY={5}>
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
                <Stack gap={5}>
                    <RegistrySection
                        title="Sua Carteira"
                        icon={Wallet}
                        subtitle="Gestão de saldo e solicitações de saque de comissões."
                    >
                        <Surface variant="glass" padding={5} rounded="system">
                            <Stack gap={5}>
                                <Stack gap={1}>
                                    <Font variant="sub-tiny" color="primary" weight="black" uppercase italic tracking="widest">Saldo Disponível</Font>
                                    <Font variant="h1" color="white" weight="black">R$ 0,00</Font>
                                    <Font variant="description" color="zinc-500">Saldo disponível para saque</Font>
                                </Stack>

                                <Button variant="primary" fullWidth rounded="full" opacity={50} grayscale cursor="not-allowed">
                                    <Inline gap={2.5}>
                                        <Icon icon={ArrowUpRight} size="sm" />
                                        <Font variant="label-caps">Solicitar Saque</Font>
                                    </Inline>
                                </Button>

                                <Box display="flex" justify="center">
                                    <Font variant="sub-tiny" color="zinc-600">Mínimo de R$ 50,00 para solicitar saque</Font>
                                </Box>
                            </Stack>
                        </Surface>
                    </RegistrySection>

                    <RegistrySection
                        title="Saques"
                        icon={History}
                        subtitle="Histórico de pagamentos e transferências realizadas."
                    >
                        <Stack gap={2.5}>
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

                            <Box paddingY={5}>
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

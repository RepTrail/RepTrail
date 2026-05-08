'use client'

import React from 'react'
import { Grid } from '../base/grid'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Inline } from '../base/layout'
import { Button } from '../base/button'
import { GlassPanel } from '../base/surface'
import { StatsCard } from '../intermediary/stats-card'
import { EmptyState } from '../intermediary/empty-state'
import { UserListItem } from '../intermediary/user-list-item'
import { WithdrawalItem } from '../intermediary/withdrawal-item'
import { RegistrySection } from '../advanced/registry-section'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'
import { 
    Link, 
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
        <Stack gap={12.5}>
            {/* Affiliate Link Section - Dynamic Theme */}
            <RegistrySection 
                id={id}
                title="Marketing de Afiliados" 
                icon={Link} 
                subtitle="Compartilhe seu link exclusivo e ganhe comissões recorrentes sobre cada novo personal ou aluno indicado."
            >
                <GlassPanel padding={5} rounded="system" border="subtle" overflow="hidden">
                    <Stack gap={5} width="full">
                        <Inline justify="between" align="center" wrap gap={5}>
                            <Stack gap={2.5} flex1 width="full" className="min-w-0">
                                <Font variant="sub-tiny" color={primaryColor as any} weight="black" uppercase italic tracking="widest">
                                    Seu Link de Afiliado
                                </Font>
                                
                                <Box className="bg-zinc-950/50 border border-white/5 rounded-full p-1 pl-4 md:pl-5 flex flex-row items-center justify-between gap-2 md:gap-4 overflow-hidden w-full max-w-full lg:max-w-none">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <Font variant="sub-tiny" color="white" weight="black" mono className={cn(
                                            "truncate block",
                                            primaryColor === 'orange' ? 'text-orange-500' : 'text-amber-500'
                                        )}>
                                            https://reptrail.com.br/?ref=5w6loo6iks
                                        </Font>
                                    </div>
                                    <Button 
                                        variant={`outline-${primaryColor}` as any} 
                                        rounded="full" 
                                        isIconOnly 
                                        size="sm"
                                        className="shrink-0 h-10 w-10 border-transparent bg-white/5 hover:bg-white/10"
                                    >
                                        <Copy size={16} />
                                    </Button>
                                </Box>

                                <Inline gap={2.5} className="opacity-40">
                                    <Font variant="sub-tiny" color="zinc-400">Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas</Font>
                                </Inline>
                            </Stack>

                            <Stack gap={0} align="end" className="hidden md:flex">
                                <Font variant="h1" color="white" weight="black" italic uppercase className="leading-none">10%</Font>
                                <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic>De Comissão</Font>
                            </Stack>
                        </Inline>
                    </Stack>
                </GlassPanel>
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
                        color="blue"
                    />
                    <StatsCard 
                        label="Indicados"
                        value="0"
                        description="0 PERSONAIS ATIVOS"
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard 
                        label="Conversão"
                        value="0.0%"
                        description="CLICK → CADASTRO"
                        icon={TrendingUp}
                        color="emerald"
                    />
                    <StatsCard 
                        label="Ganhos Totais"
                        value="R$ 0,00"
                        description="R$ 0,00 PENDENTE"
                        icon={DollarSign}
                        color="amber"
                    />
                </Grid>
            </RegistrySection>

            {/* Wallet & Lists */}
            <Grid cols={1} lgCols={3} gap={5}>
                {/* Indicados Recentes */}
                <Box className="lg:col-span-2">
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
                                avatarVariant="orange"
                            />
                            <UserListItem 
                                name="Ana Beatriz"
                                email="ana.bia@gmail.com"
                                registrationDate="há 2 horas"
                                role="aluno"
                                roleLabel="ALUNO PREMIUM"
                                initials="AB"
                                avatarVariant="emerald"
                            />
                            
                            <Box className="pt-5">
                                <EmptyState 
                                    variant={primaryColor as any}
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
                        <GlassPanel padding={5} rounded="system" border="subtle">
                            <Stack gap={5}>
                                <Stack gap={1}>
                                    <Font variant="sub-tiny" color={primaryColor as any} weight="black" uppercase italic tracking="widest">Saldo Disponível</Font>
                                    <Font variant="h1" color="white" weight="black">R$ 0,00</Font>
                                    <Font variant="description" color="zinc-500">Saldo disponível para saque</Font>
                                </Stack>

                                <Button variant={`outline-${primaryColor}` as any} fullWidth rounded="full" className="opacity-50 grayscale cursor-not-allowed">
                                    <Inline gap={2.5}>
                                        <ArrowUpRight size={18} />
                                        <Font variant="label-caps">Solicitar Saque</Font>
                                    </Inline>
                                </Button>

                                <Box className="text-center">
                                    <Font variant="sub-tiny" color="zinc-600">Mínimo de R$ 50,00 para solicitar saque</Font>
                                </Box>
                            </Stack>
                        </GlassPanel>
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

                            <Box className="pt-5">
                                <EmptyState 
                                    variant={primaryColor as any}
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

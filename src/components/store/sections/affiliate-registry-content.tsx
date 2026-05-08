'use client'

import React, { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Search,
    Copy,
    TrendingUp,
    MousePointerClick,
    Wallet,
    Clock,
    Check,
    ChevronRight,
    ArrowUpRight,
    Info,
    LucideIcon
} from 'lucide-react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Input } from '../base/input'
import { Badge } from '../base/badge'
import { Grid } from '../base/grid'
import { BaseAvatar } from '../base/avatar'
import { RegistrySection } from '../advanced/registry-section'
import { SegmentedSwitch } from '../intermediary/segmented-switch'

export function AffiliateRegistryContent() {
    const [subTab, setSubTab] = useState('overview')
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Stack gap="section">
            {/* Header / Navigation */}
            <Box display="flex" align="center" justify="between" gap={5}>
                <SegmentedSwitch
                    options={[
                        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
                        { id: 'referrals', label: 'Indicações', icon: Users },
                        { id: 'finance', label: 'Financeiro', icon: DollarSign }
                    ]}
                    activeId={subTab}
                    onSelect={setSubTab}
                    defaultActiveVariant="outline-amber"
                />
            </Box>

            {/* Content Sections */}
            {subTab === 'overview' && (
                <RegistrySection
                    title="Painel de Performance"
                    icon={LayoutDashboard}
                    subtitle="Acompanhe seu desempenho global e gerencie seu link de indicação."
                >
                    <Stack gap={5}>
                        {/* Affiliate Link Card */}
                        <Box bg="zinc-900/40" border="amber" padding={5} rounded="system" shadow="amber">
                            <Stack gap={5}>
                                <Stack gap={2.5}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={Info} size="xs" color="amber" />
                                        <Font variant="label-caps" color="amber">Seu Link de Afiliado</Font>
                                    </Stack>
                                    <Stack direction="row" gap={2.5} align="center">
                                        <Box flex1 bg="zinc-950" border="white/10" paddingX={5} paddingY={2.5} rounded="sm">
                                            <Font variant="body-sm" color="amber" weight="bold" truncate>https://reptrail.com/?ref=MEU_TOKEN_VIP</Font>
                                        </Box>
                                        <Button variant={copied ? "emerald" : "amber"} rounded="full" onClick={handleCopy}>
                                            <Stack direction="row" align="center" gap={2.5}>
                                                <Icon icon={copied ? Check : Copy} size="sm" />
                                                <Font variant="label-caps">{copied ? 'Copiado!' : 'Copiar'}</Font>
                                            </Stack>
                                        </Button>
                                    </Stack>
                                    <Font variant="sub-tiny" color="zinc-600">
                                        Cookie persistido por 30 dias · Comissões recorrentes de 10%
                                    </Font>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Summary Stats Grid */}
                        <Grid cols={4} gap={5}>
                            <StatItem label="Cliques" value="1.284" icon={MousePointerClick} color="blue" sub="+12% hoje" />
                            <StatItem label="Indicados" value="42" icon={Users} color="blue" sub="8 ativos" />
                            <StatItem label="Conversão" value="3.2%" icon={TrendingUp} color="emerald" sub="Alta" />
                            <StatItem label="Ganhos Totais" value="R$ 3.842" icon={DollarSign} color="amber" sub="R$ 142 pend." />
                        </Grid>

                        {/* Recent Activity Rows */}
                        <Grid cols={2} gap={5}>
                            <Box bg="zinc-950/40" border="white/5" rounded="system">
                                <Stack gap={0}>
                                    <Box padding={5} border="white/5">
                                        <Stack direction="row" align="center" gap={2.5}>
                                            <Icon icon={Users} size="sm" color="blue" />
                                            <Font variant="label-caps">Indicados Recentes</Font>
                                        </Stack>
                                    </Box>
                                    <Stack gap={0}>
                                        <ActivityRow name="João Silva" type="Personal" date="10/04" status="active" />
                                        <ActivityRow name="Maria Oliveira" type="Aluno" date="12/04" status="active" />
                                        <ActivityRow name="Pedro Santos" type="Personal" date="15/04" status="pending" />
                                    </Stack>
                                </Stack>
                            </Box>

                            <Box bg="zinc-950/40" border="white/5" rounded="system">
                                <Stack gap={0}>
                                    <Box padding={5} border="white/5">
                                        <Stack direction="row" align="center" gap={2.5}>
                                            <Icon icon={DollarSign} size="sm" color="amber" />
                                            <Font variant="label-caps">Comissões Recentes</Font>
                                        </Stack>
                                    </Box>
                                    <Stack gap={0}>
                                        <CommissionRow desc="Assinatura Pro - João" amount="49.90" date="10/04" />
                                        <CommissionRow desc="Upgrade Elite - Pedro" amount="89.90" date="15/04" />
                                        <CommissionRow desc="Assinatura Start - Maria" amount="29.90" date="18/04" />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'referrals' && (
                <RegistrySection
                    title="Lista de Indicados"
                    icon={Users}
                    subtitle="Gerencie todos os usuários que se cadastraram através do seu link exclusivo."
                >
                    <Stack gap={5}>
                        <Input
                            placeholder="Pesquisar por nome ou email..."
                            rounded="full"
                            icon={<Icon icon={Search} size="sm" />}
                        />
                        <Box bg="zinc-950/40" border="white/5" rounded="system" padding={0}>
                            <Stack gap={0}>
                                <ActivityRow name="João Silva" type="Personal" date="10/04/2024" status="active" />
                                <ActivityRow name="Maria Oliveira" type="Aluno" date="12/04/2024" status="active" />
                                <ActivityRow name="Pedro Santos" type="Personal" date="15/04/2024" status="pending" />
                                <ActivityRow name="Lucas Lima" type="Aluno" date="18/04/2024" status="active" />
                            </Stack>
                        </Box>
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'finance' && (
                <RegistrySection
                    title="Extrato e Saques"
                    icon={DollarSign}
                    subtitle="Acompanhe seus ganhos em tempo real e solicite o resgate via PIX."
                >
                    <Grid cols={2} gap={5}>
                        {/* Wallet Area */}
                        <Box bg="emerald" bgOpacity={10} border="emerald" padding={5} rounded="system" shadow="emerald">
                            <Stack gap={5}>
                                <Stack gap={2.5}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={Wallet} color="emerald" size="sm" />
                                        <Font variant="label-caps" color="emerald">Saldo Disponível</Font>
                                    </Stack>
                                    <Font variant="h2" color="emerald" weight="black">R$ 842,50</Font>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={Clock} color="amber" size="xs" />
                                        <Font variant="sub-tiny" color="amber">R$ 142,00 pendente</Font>
                                    </Stack>
                                </Stack>
                                <Button variant="emerald" fullWidth rounded="sm">
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={ArrowUpRight} size="sm" />
                                        <Font variant="label-caps">Solicitar Saque (PIX)</Font>
                                    </Stack>
                                </Button>
                                <Font variant="sub-tiny" color="zinc-600" align="center">
                                    Mínimo R$ 50,00 · Processamento 24h
                                </Font>
                            </Stack>
                        </Box>

                        {/* Payout History */}
                        <Box bg="zinc-950/40" border="white/5" rounded="system">
                            <Stack gap={0}>
                                <Box padding={5} border="white/5">
                                    <Font variant="label-caps">Histórico de Saques</Font>
                                </Box>
                                <Stack gap={0}>
                                    <CommissionRow desc="Saque PIX - Santander" amount="250.00" date="01/04" isDebit />
                                    <CommissionRow desc="Saque PIX - Nubank" amount="180.00" date="15/03" isDebit />
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>
                </RegistrySection>
            )}
        </Stack>
    )
}

// ─── Sub-Components ──────────────────────────────────

interface StatItemProps {
    label: string
    value: string
    icon: LucideIcon
    color: 'blue' | 'emerald' | 'amber'
    sub: string
}

function StatItem({ label, value, icon, color, sub }: StatItemProps) {
    return (
        <Box bg="zinc-950/40" border="white/5" padding={5} rounded="system" transition="all" hoverBg="white/5">
            <Stack gap={2.5}>
                <Stack direction="row" align="center" justify="between">
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase nowrap>{label}</Font>
                    <Icon icon={icon} size="xs" color={color} />
                </Stack>
                <Font variant="h2" weight="black" nowrap>{value}</Font>
                <Font variant="sub-tiny" color={color} weight="black" nowrap>{sub}</Font>
            </Stack>
        </Box>
    )
}

interface ActivityRowProps {
    name: string
    type: string
    date: string
    status: 'active' | 'pending'
}

function ActivityRow({ name, type, date, status }: ActivityRowProps) {
    return (
        <Box padding={5} border="white/5" hoverBg="white/5" cursor="pointer" width="full">
            <Stack direction="row" align="center" justify="between" gap={2.5}>
                <Stack direction="row" align="center" gap={5} flex1>
                    <BaseAvatar initials={name.substring(0, 2)} size="sm" variant="zinc" />
                    <Stack gap={0} flex1>
                        <Font variant="body-sm" weight="bold" truncate>{name}</Font>
                        <Font variant="sub-tiny" color="zinc-600" nowrap>{type} · {date}</Font>
                    </Stack>
                </Stack>
                <Badge label={status === 'active' ? 'Ativo' : 'Pendente'} color={status === 'active' ? 'emerald' : 'amber'} />
            </Stack>
        </Box>
    )
}

interface CommissionRowProps {
    desc: string
    amount: string
    date: string
    isDebit?: boolean
}

function CommissionRow({ desc, amount, date, isDebit }: CommissionRowProps) {
    return (
        <Box padding={5} border="white/5" hoverBg="white/5" cursor="pointer" width="full">
            <Stack direction="row" align="center" justify="between" gap={2.5}>
                <Stack gap={0} flex1>
                    <Font variant="body-sm" weight="bold" truncate>{desc}</Font>
                    <Font variant="sub-tiny" color="zinc-600" nowrap>{date}</Font>
                </Stack>
                <Stack direction="row" align="center" gap={2.5} shrink0>
                    <Font variant="body-sm" color={isDebit ? "red" : "emerald"} weight="black" nowrap>
                        {isDebit ? '-' : '+'} R$ {amount}
                    </Font>
                    <Icon icon={ChevronRight} size="xs" color="zinc-800" />
                </Stack>
            </Stack>
        </Box>
    )
}

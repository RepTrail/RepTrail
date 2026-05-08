'use client'

import { useState, useEffect } from 'react'
import { requestPayout } from '@/actions/affiliate-actions'

// Design System V2 Components
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon, IconBox } from '@/components/store/base/icon'
import { Surface, GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { StatsCard } from '@/components/store/intermediary/stats-card'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { WithdrawalItem } from '@/components/store/intermediary/withdrawal-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Modal } from '@/components/store/advanced/modal'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { Textarea } from '@/components/store/base/textarea'
import { 
    Megaphone, 
    Link as LinkIcon, 
    Copy, 
    Check, 
    MousePointer2, 
    Users, 
    TrendingUp, 
    DollarSign, 
    Wallet, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    History,
    Search,
    Info,
    BarChart2,
    XCircle,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AffiliateData {
    profile: {
        id: string
        full_name: string | null
        avatar_url: string | null
        affiliate_token: string | null
        affiliate_balance: number
        email: string | null
    }
    stats: {
        totalClicks: number
        totalReferrals: number
        activeTrainers: number
        totalEarned: number
        pendingAmount: number
        balance: number
        conversionRate: string
    }
    clicksPerDay: Record<string, number>
    recentReferrals: any[]
    recentCommissions: any[]
    payouts: any[]
}

interface Props {
    data: AffiliateData
}

export function AffiliateClientDashboard({ data }: Props) {
    const { profile, stats, clicksPerDay, recentReferrals, recentCommissions, payouts } = data
    const [copied, setCopied] = useState(false)
    const [payoutLoading, setPayoutLoading] = useState(false)
    const [payoutError, setPayoutError] = useState<string | null>(null)
    const [payoutSuccess, setPayoutSuccess] = useState(false)
    const [showPayoutForm, setShowPayoutForm] = useState(false)
    const [payoutAmount, setPayoutAmount] = useState('')
    const [payoutMethod, setPayoutMethod] = useState('pix')
    const [payoutDetails, setPayoutDetails] = useState('')

    const [affiliateLink, setAffiliateLink] = useState(
        profile.affiliate_token ? `https://reptrail.com/?ref=${profile.affiliate_token}` : null
    )

    useEffect(() => {
        if (profile.affiliate_token) {
            setAffiliateLink(`${window.location.origin}/?ref=${profile.affiliate_token}`)
        }
    }, [profile.affiliate_token])

    const handleCopy = async () => {
        if (!affiliateLink) return
        await navigator.clipboard.writeText(affiliateLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePayout = async () => {
        setPayoutLoading(true)
        setPayoutError(null)
        const amount = parseFloat(payoutAmount.replace(',', '.'))
        if (isNaN(amount) || amount <= 0) {
            setPayoutError('Informe um valor válido.')
            setPayoutLoading(false)
            return
        }
        const result = await requestPayout(amount, payoutMethod, payoutDetails)
        if (result.error) {
            setPayoutError(result.error)
        } else {
            setPayoutSuccess(true)
            setShowPayoutForm(false)
        }
        setPayoutLoading(false)
    }

    const clickDays = Object.entries(clicksPerDay)
    const maxClicks = Math.max(...clickDays.map(([, v]) => v), 1)

    return (
        <>
            <Stack gap={{ base: 12.5, md: 'section' }} className="pb-10">
                {/* Hero Section */}
                <Stack gap={2.5}>
                    <Inline gap={2.5}>
                        <Icon icon={Megaphone} color="amber" size="sm" />
                        <Font variant="auxiliary" color="amber">Programa de Afiliados</Font>
                    </Inline>

                    <Stack gap={1}>
                        <Font variant="h1" color="white" weight="black" italic uppercase nowrap>
                            Meu <Font variant="h1" color="amber" weight="black" italic uppercase nowrap>Painel</Font>
                        </Font>
                        <Font variant="description">
                            Bem-vindo de volta, <span className="text-zinc-200 font-bold">{profile.full_name?.split(' ')[0] || 'Afiliado'}</span>. Acompanhe suas indicações e ganhos.
                        </Font>
                    </Stack>
                </Stack>

                {/* Affiliate Link Section */}
                <Surface variant="glass" padding={5} rounded="system" border="subtle">
                    <Stack gap={5} width="full">
                        <Inline justify="between" align="center" wrap gap={5}>
                            <Stack gap={2.5} flex1 width="full" className="min-w-0">
                                <Font variant="sub-tiny" color="amber" weight="black" uppercase italic tracking="widest">
                                    Seu Link de Afiliado
                                </Font>
                                
                                <Box className="bg-zinc-950/50 border border-white/5 rounded-full p-1 pl-4 md:pl-5 flex flex-row items-center justify-between gap-2 md:gap-4 overflow-hidden w-full">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <Font variant="sub-tiny" color="amber" weight="black" mono className="truncate block">
                                            {affiliateLink || 'Link não disponível'}
                                        </Font>
                                    </div>
                                    <Button 
                                        variant={copied ? 'emerald' : 'outline-amber'} 
                                        rounded="full" 
                                        onClick={handleCopy}
                                        className="shrink-0 h-10 px-6"
                                    >
                                        <Inline gap={2}>
                                            <Icon icon={copied ? Check : Copy} size="xs" color={copied ? 'black' : 'amber'} />
                                            <Font variant="label-caps" color={copied ? 'black' : 'amber'}>{copied ? 'Copiado' : 'Copiar'}</Font>
                                        </Inline>
                                    </Button>
                                </Box>

                                <Inline gap={2.5} className="opacity-40">
                                    <Icon icon={Info} size="xs" color="zinc-400" />
                                    <Font variant="sub-tiny" color="zinc-400">Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas</Font>
                                </Inline>
                            </Stack>

                            <Stack gap={0} align="end" className="hidden md:flex">
                                <Font variant="h1" color="white" weight="black" italic uppercase className="leading-none">10%</Font>
                                <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic tracking="widest">De Comissão</Font>
                            </Stack>
                        </Inline>
                    </Stack>
                </Surface>

                {/* Stats Grid */}
                <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                    <StatsCard 
                        label="Clicks no Link"
                        value={stats.totalClicks.toLocaleString()}
                        description="TOTAL ACUMULADO"
                        icon={MousePointer2}
                        color="blue"
                    />
                    <StatsCard 
                        label="Indicados"
                        value={stats.totalReferrals.toLocaleString()}
                        description={`${stats.activeTrainers} PERSONAIS ATIVOS`}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard 
                        label="Conversão"
                        value={`${stats.conversionRate}%`}
                        description="CLICK → CADASTRO"
                        icon={TrendingUp}
                        color="emerald"
                    />
                    <StatsCard 
                        label="Ganhos Totais"
                        value={`R$ ${stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        description={`R$ ${stats.pendingAmount.toFixed(2)} PENDENTE`}
                        icon={DollarSign}
                        color="amber"
                    />
                </Grid>

                <Grid cols={1} lgCols={12} gap={5}>
                    {/* Left Column */}
                    <Stack gap={5} className="lg:col-span-8">
                        {/* Clicks Chart Card */}
                        <Surface variant="base" padding={0} rounded="system" border="subtle" direction="col" className="overflow-hidden">
                            <CardHeader className="bg-zinc-900/50">
                                <Inline gap={2.5} align="center">
                                    <Icon icon={BarChart2} color="blue" size="sm" />
                                    <Font variant="label-caps" color="white">Clicks — Últimos 7 Dias</Font>
                                </Inline>
                            </CardHeader>
                            <Box padding={6}>
                                <Stack direction="row" align="end" gap={2} className="h-24">
                                    {clickDays.map(([date, count]) => (
                                        <Stack key={date} gap={1} align="center" flex1>
                                            <Box 
                                                fullWidth
                                                className="bg-blue-500/50 hover:bg-blue-500 rounded-t-md transition-all duration-300"
                                                style={{ height: `${(count / maxClicks) * 80}px`, minHeight: count > 0 ? '4px' : '2px' }}
                                            />
                                            <Font variant="sub-tiny" color="zinc-600" weight="black">{date.slice(5)}</Font>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        </Surface>

                        {/* Recent Referrals */}
                        <Surface variant="base" padding={0} rounded="system" border="subtle" direction="col" className="overflow-hidden">
                            <CardHeader className="bg-zinc-900/50">
                                <Inline gap={2.5} align="center">
                                    <Icon icon={Users} color="blue" size="sm" />
                                    <Font variant="label-caps" color="white">Indicados Recentes</Font>
                                </Inline>
                            </CardHeader>
                            <Stack gap={0}>
                                {recentReferrals.length > 0 ? (
                                    recentReferrals.map((r: any) => (
                                        <Box key={r.id} padding={5} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <UserListItem 
                                                name={r.full_name || r.email}
                                                email={r.email}
                                                registrationDate={new Date(r.created_at).toLocaleDateString('pt-BR')}
                                                role={r.role}
                                                roleLabel={r.role === 'trainer' ? 'PERSONAL TRAINER' : 'ALUNO'}
                                                initials={r.full_name?.substring(0, 2).toUpperCase() || '?'}
                                                avatarVariant={r.role === 'trainer' ? 'emerald' : 'orange'}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <CardContent padding={12.5}>
                                        <EmptyState 
                                            variant="amber"
                                            icon={Search}
                                            title="Nenhum indicado ainda"
                                            description="Compartilhe seu link para começar a ganhar comissões."
                                        />
                                    </CardContent>
                                )}
                            </Stack>
                        </Surface>

                        {/* Commission History */}
                        <Surface variant="base" padding={0} rounded="system" border="subtle" direction="col" className="overflow-hidden">
                            <CardHeader className="bg-zinc-900/50">
                                <Inline gap={2.5} align="center">
                                    <Icon icon={History} color="amber" size="sm" />
                                    <Font variant="label-caps" color="white">Histórico de Comissões</Font>
                                </Inline>
                            </CardHeader>
                            <Stack gap={0}>
                                {recentCommissions.length > 0 ? (
                                    recentCommissions.map((c: any) => (
                                        <Box key={c.id} padding={5} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <WithdrawalItem 
                                                id={c.id.substring(0, 8)}
                                                amount={`R$ ${Number(c.amount).toFixed(2)}`}
                                                date={new Date(c.created_at).toLocaleDateString('pt-BR')}
                                                method={c.description || 'Comissão'}
                                                recipient=""
                                                status={c.status === 'confirmed' ? 'completed' : 'pending'}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <CardContent padding={12.5}>
                                        <EmptyState 
                                            variant="amber"
                                            icon={DollarSign}
                                            title="Sem comissões ainda"
                                            description="Suas comissões aparecerão aqui quando seus indicados realizarem pagamentos."
                                        />
                                    </CardContent>
                                )}
                            </Stack>
                        </Surface>
                    </Stack>

                    {/* Right Column */}
                    <Stack gap={5} className="lg:col-span-4">
                        {/* Wallet Section */}
                        <Surface variant="glass" padding={5} rounded="system" border="subtle">
                            <Stack gap={5}>
                                <Inline gap={2.5} align="center">
                                    <Icon icon={Wallet} color="emerald" size="sm" />
                                    <Font variant="label-caps" color="emerald">Sua Carteira</Font>
                                </Inline>

                                <Stack gap={1}>
                                    <Font variant="h1" color="white" weight="black">
                                        R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Font>
                                    <Font variant="description" color="zinc-500">Saldo disponível para saque</Font>
                                </Stack>

                                {stats.pendingAmount > 0 && (
                                    <Box padding={2.5} rounded="system" className="bg-amber-500/5 border border-amber-500/10">
                                        <Inline gap={2.5} align="center">
                                            <Icon icon={Clock} size="xs" color="amber" />
                                            <Font variant="sub-tiny" color="amber">
                                                <span className="font-black">R$ {stats.pendingAmount.toFixed(2)}</span> aguardando confirmação
                                            </Font>
                                        </Inline>
                                    </Box>
                                )}

                                {payoutSuccess && (
                                    <Box padding={2.5} rounded="system" className="bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in zoom-in">
                                        <Inline gap={2.5} align="center">
                                            <Icon icon={CheckCircle2} size="xs" color="emerald" />
                                            <Font variant="sub-tiny" color="emerald" weight="black">SAQUE SOLICITADO COM SUCESSO!</Font>
                                        </Inline>
                                    </Box>
                                )}

                                <Button 
                                    variant="emerald" 
                                    fullWidth 
                                    rounded="full" 
                                    className="h-12"
                                    disabled={stats.balance < 50}
                                    onClick={() => setShowPayoutForm(true)}
                                >
                                    <Font variant="label-caps" color="black">Solicitar Saque</Font>
                                </Button>

                                <Box className="text-center">
                                    <Font variant="sub-tiny" color="zinc-600">Mínimo de R$ 50,00 para solicitar saque</Font>
                                </Box>
                            </Stack>
                        </Surface>

                        {/* Payout History */}
                        <Surface variant="base" padding={0} rounded="system" border="subtle" direction="col" className="overflow-hidden">
                            <CardHeader className="bg-zinc-900/50">
                                <Inline gap={2.5} align="center">
                                    <Icon icon={ArrowUpRight} color="zinc-400" size="sm" />
                                    <Font variant="label-caps" color="white">Histórico de Saques</Font>
                                </Inline>
                            </CardHeader>
                            <Stack gap={0}>
                                {payouts.length > 0 ? (
                                    payouts.map((p: any) => (
                                        <Box key={p.id} padding={5} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <WithdrawalItem 
                                                id={p.id.substring(0, 8)}
                                                amount={`R$ ${Number(p.amount).toFixed(2)}`}
                                                date={new Date(p.created_at).toLocaleDateString('pt-BR')}
                                                method={p.method?.toUpperCase() || 'PIX'}
                                                recipient=""
                                                status={p.status === 'paid' ? 'completed' : p.status === 'rejected' ? 'failed' : 'pending'}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <CardContent padding={7.5}>
                                        <Font variant="sub-tiny" color="zinc-600" align="center">Nenhum saque realizado</Font>
                                    </CardContent>
                                )}
                            </Stack>
                        </Surface>

                        {/* How it works */}
                        <Surface variant="base" padding={5} rounded="system" border="subtle">
                            <Stack gap={5}>
                                <Font variant="label-caps" color="zinc-400">Como Funciona</Font>
                                <Stack gap={4}>
                                    {[
                                        { icon: '🔗', text: 'Compartilhe seu link único' },
                                        { icon: '👤', text: 'Personal se cadastra pela sua indicação' },
                                        { icon: '💰', text: 'Personal contrata um plano' },
                                        { icon: '🎉', text: 'Você recebe 10% de comissão!' },
                                    ].map((step, i) => (
                                        <Inline key={i} gap={3} align="center">
                                            <Box padding={2.5} rounded="system" className="bg-zinc-900 border border-white/5">
                                                <Font variant="description">{step.icon}</Font>
                                            </Box>
                                            <Font variant="sub-tiny" color="zinc-400">{step.text}</Font>
                                        </Inline>
                                    ))}
                                </Stack>
                            </Stack>
                        </Surface>
                    </Stack>
                </Grid>
            </Stack>

            {/* Payout Modal */}
            <Modal
                isOpen={showPayoutForm}
                onClose={() => setShowPayoutForm(false)}
                title="Solicitar Saque"
                subtitle="Informe os dados para recebimento da sua comissão."
                icon={Wallet}
                variant="emerald"
                confirmLabel={payoutLoading ? 'Enviando...' : 'Confirmar Saque'}
                cancelLabel="Cancelar"
                onConfirm={handlePayout}
            >
                <Stack gap={5}>
                    {payoutError && (
                        <Box padding={3} rounded="system" className="bg-red-500/10 border border-red-500/20">
                            <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">{payoutError}</Font>
                        </Box>
                    )}

                    <Stack gap={2}>
                        <Input 
                            label="Valor (Mínimo R$ 50,00)"
                            type="text" 
                            value={payoutAmount}
                            onChange={e => setPayoutAmount(e.target.value)}
                            placeholder="0,00"
                            mask="number"
                        />
                    </Stack>

                    <Stack gap={2}>
                        <FormSelect 
                            label="Método de Recebimento"
                            value={payoutMethod}
                            onChange={setPayoutMethod}
                            options={[
                                { label: 'PIX', value: 'pix' },
                                { label: 'Transferência Bancária', value: 'bank' }
                            ]}
                        />
                    </Stack>

                    <Stack gap={2}>
                        <Textarea 
                            label="Dados da Conta / Chave PIX"
                            value={payoutDetails}
                            onChange={e => setPayoutDetails(e.target.value)}
                            placeholder="Sua chave PIX ou dados bancários completos"
                        />
                    </Stack>
                </Stack>
            </Modal>
        </>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Copy, Check, DollarSign, Users, MousePointerClick, TrendingUp,
    Megaphone, ExternalLink, Wallet, Clock, CheckCircle2, XCircle,
    ArrowUpRight, Info, BarChart2
} from 'lucide-react'
import { requestPayout } from '@/actions/affiliate-actions'

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

    const handlePayout = async (e: React.FormEvent) => {
        e.preventDefault()
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

    // Sparkline data
    const clickDays = Object.entries(clicksPerDay)
    const maxClicks = Math.max(...clickDays.map(([, v]) => v), 1)

    // Status badge
    const statusColor = (status: string) => {
        if (status === 'confirmed' || status === 'paid' || status === 'completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        if (status === 'pending' || status === 'processing' || status === 'requested') return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        return 'text-red-400 bg-red-500/10 border-red-500/20'
    }

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            pending: 'Pendente',
            confirmed: 'Confirmado',
            cancelled: 'Cancelado',
            paid: 'Pago',
            requested: 'Solicitado',
            processing: 'Processando',
            completed: 'Concluído',
            rejected: 'Rejeitado',
        }
        return map[s] || s
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Hero */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-amber-500" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Programa de Afiliados</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Meu Painel
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Bem-vindo, <span className="text-zinc-200">{profile.full_name?.split(' ')[0] || 'Afiliado'}</span>. Acompanhe suas indicações e ganhos.
                    </p>
                </div>
            </div>

            {/* Affiliate Link Card */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-zinc-900 border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Seu Link de Afiliado</p>
                            {affiliateLink ? (
                                <div className="flex items-center gap-3">
                                    <code className="text-sm text-amber-300 bg-zinc-950/50 px-4 py-2 rounded-xl border border-amber-500/20 font-mono break-all">
                                        {affiliateLink}
                                    </code>
                                    <Button
                                        onClick={handleCopy}
                                        className={`shrink-0 h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-zinc-950'}`}
                                    >
                                        {copied ? <><Check className="w-4 h-4 mr-2" />Copiado!</> : <><Copy className="w-4 h-4 mr-2" />Copiar</>}
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-zinc-500 text-sm">Token não gerado ainda. Contate o suporte.</p>
                            )}
                            <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Cookie persistido por 30 dias · Token oculto ao usuário · Conversões automáticas
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <div className="text-3xl font-black text-amber-400">10%</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">de comissão</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Clicks no Link"
                    value={stats.totalClicks.toLocaleString()}
                    icon={<MousePointerClick className="w-5 h-5" />}
                    color="text-blue-400"
                    sub="Total acumulado"
                />
                <StatCard
                    title="Indicados"
                    value={stats.totalReferrals.toLocaleString()}
                    icon={<Users className="w-5 h-5" />}
                    color="text-purple-400"
                    sub={`${stats.activeTrainers} personais ativos`}
                />
                <StatCard
                    title="Conversão"
                    value={`${stats.conversionRate}%`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="text-emerald-400"
                    sub="Click → Cadastro"
                />
                <StatCard
                    title="Ganhos Totais"
                    value={`R$ ${stats.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="text-amber-400"
                    sub={`R$ ${stats.pendingAmount.toFixed(2)} pendente`}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Sparkline — Clicks per Day */}
                    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-800/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-blue-400" />
                                Clicks — Últimos 7 Dias
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-end gap-2 h-24">
                                {clickDays.map(([date, count]) => (
                                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-blue-500/80 rounded-t-md transition-all hover:bg-blue-400"
                                            style={{ height: `${(count / maxClicks) * 80}px`, minHeight: count > 0 ? '4px' : '2px' }}
                                            title={`${count} clicks`}
                                        />
                                        <span className="text-[9px] text-zinc-600 font-bold">{date.slice(5)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Referrals */}
                    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-800/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-400" />
                                Indicados Recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentReferrals.length > 0 ? (
                                <div className="divide-y divide-zinc-800/50">
                                    {recentReferrals.map((r: any) => (
                                        <div key={r.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-zinc-700">
                                                    <AvatarImage src={r.avatar_url || undefined} />
                                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xs">
                                                        {r.full_name?.substring(0, 2) || '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-200">{r.full_name || r.email}</p>
                                                    <p className="text-[10px] text-zinc-500">
                                                        {r.role === 'trainer' ? 'Personal' : 'Aluno'} · {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`text-[9px] font-bold uppercase ${r.role === 'trainer' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-zinc-400 border-zinc-600'}`}>
                                                {r.role === 'trainer' ? 'Personal ✓' : 'Aluno'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center space-y-3">
                                    <Users className="w-8 h-8 text-zinc-700 mx-auto" />
                                    <p className="text-zinc-500 text-sm">Nenhum indicado ainda.</p>
                                    <p className="text-zinc-600 text-xs max-w-xs mx-auto">Compartilhe seu link e comece a ganhar comissões quando alguém se cadastrar!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Commission History */}
                    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-800/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-amber-400" />
                                Histórico de Comissões
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentCommissions.length > 0 ? (
                                <div className="divide-y divide-zinc-800/50">
                                    {recentCommissions.map((c: any) => (
                                        <div key={c.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-200">{c.description || 'Comissão de venda'}</p>
                                                <p className="text-[10px] text-zinc-500">{new Date(c.created_at).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black text-emerald-400">
                                                    +R$ {Number(c.amount).toFixed(2)}
                                                </span>
                                                <Badge variant="outline" className={`text-[9px] font-bold uppercase ${statusColor(c.status)}`}>
                                                    {statusLabel(c.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center space-y-3">
                                    <DollarSign className="w-8 h-8 text-zinc-700 mx-auto" />
                                    <p className="text-zinc-500 text-sm">Nenhuma comissão ainda.</p>
                                    <p className="text-zinc-600 text-xs max-w-xs mx-auto">Suas comissões aparecerão aqui quando seus indicados realizarem pagamentos na plataforma.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Wallet Card */}
                    <Card className="bg-gradient-to-br from-emerald-500/10 to-zinc-900 border-emerald-500/20 rounded-2xl overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-emerald-400" />
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sua Carteira</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">
                                    R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1">Saldo disponível para saque</p>
                            </div>
                            {stats.pendingAmount > 0 && (
                                <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                    <p className="text-xs text-amber-300">
                                        <span className="font-bold">R$ {stats.pendingAmount.toFixed(2)}</span> aguardando confirmação
                                    </p>
                                </div>
                            )}
                            {payoutSuccess && (
                                <Alert className="bg-emerald-500/10 border-emerald-500/20">
                                    <AlertDescription className="text-emerald-400 text-xs font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Saque solicitado com sucesso!
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!showPayoutForm ? (
                                <Button
                                    onClick={() => setShowPayoutForm(true)}
                                    disabled={stats.balance < 50}
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Solicitar Saque
                                </Button>
                            ) : (
                                <form onSubmit={handlePayout} className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor (min. R$ 50)</label>
                                        <input
                                            type="text"
                                            value={payoutAmount}
                                            onChange={e => setPayoutAmount(e.target.value)}
                                            placeholder="0,00"
                                            className="w-full mt-1 h-10 bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Método</label>
                                        <select
                                            value={payoutMethod}
                                            onChange={e => setPayoutMethod(e.target.value)}
                                            className="w-full mt-1 h-10 bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="pix">PIX</option>
                                            <option value="bank">Transferência Bancária</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Chave / Dados</label>
                                        <input
                                            type="text"
                                            value={payoutDetails}
                                            onChange={e => setPayoutDetails(e.target.value)}
                                            placeholder="Sua chave PIX ou dados bancários"
                                            className="w-full mt-1 h-10 bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    {payoutError && (
                                        <p className="text-red-400 text-[10px] font-bold flex items-center gap-1">
                                            <XCircle className="w-3 h-3" /> {payoutError}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => setShowPayoutForm(false)}
                                            variant="ghost"
                                            className="flex-1 h-10 text-zinc-500 hover:text-zinc-300 text-xs"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={payoutLoading}
                                            className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl text-xs"
                                        >
                                            {payoutLoading ? 'Enviando...' : 'Confirmar'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                            {stats.balance < 50 && !showPayoutForm && (
                                <p className="text-[10px] text-zinc-600 text-center">
                                    Mínimo de R$ 50,00 para solicitar saque
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payout History */}
                    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-800/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                                Saques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {payouts.length > 0 ? (
                                <div className="divide-y divide-zinc-800/50">
                                    {payouts.map((p: any) => (
                                        <div key={p.id} className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-200">R$ {Number(p.amount).toFixed(2)}</p>
                                                <p className="text-[10px] text-zinc-500">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                            <Badge variant="outline" className={`text-[9px] font-bold uppercase ${statusColor(p.status)}`}>
                                                {statusLabel(p.status)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-zinc-600 text-xs">Nenhum saque realizado</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* How it works */}
                    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Como funciona</p>
                            <div className="space-y-3">
                                {[
                                    { icon: '🔗', text: 'Compartilhe seu link único' },
                                    { icon: '👤', text: 'Personal se cadastra pela sua indicação' },
                                    { icon: '💰', text: 'Personal contrata um plano' },
                                    { icon: '🎉', text: 'Você recebe 10% de comissão!' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-lg">{step.icon}</span>
                                        <p className="text-xs text-zinc-400">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color, sub }: {
    title: string
    value: string
    icon: React.ReactNode
    color: string
    sub?: string
}) {
    return (
        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
                <div className={color}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black text-white">{value}</div>
                {sub && <p className="text-[10px] text-zinc-500 font-medium mt-1">{sub}</p>}
            </CardContent>
        </Card>
    )
}

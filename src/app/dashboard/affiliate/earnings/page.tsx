
import { getAffiliateTransactions } from '@/actions/affiliate-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, ArrowUpRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default async function AffiliateEarningsPage() {
    const { commissions, payouts, checks } = await getAffiliateTransactions()

    const statusColor = (status: string) => {
        if (['confirmed', 'paid', 'completed'].includes(status)) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        if (['pending', 'processing', 'requested'].includes(status)) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        return 'text-red-500 bg-red-500/10 border-red-500/20'
    }

    const statusLabel = (s: string) => {
        const map: Record<string, string> = {
            pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado',
            paid: 'Pago', requested: 'Solicitado', processing: 'Processando',
            completed: 'Concluído', rejected: 'Rejeitado',
        }
        return map[s] || s
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                    Meus Ganhos
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-2">
                    Extrato completo de suas comissões e histórico de saques.
                </p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Saldo Disponível
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">R$ {checks.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-zinc-500 mt-1">Pronto para saque</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            Pendente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-amber-500/90">R$ {checks.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-zinc-500 mt-1">Aguardando confirmação (30 dias)</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            Total Recebido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-blue-500/90">R$ {checks.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-zinc-500 mt-1">Já transferido para sua conta</p>
                    </CardContent>
                </Card>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Commissions List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-200">Histórico de Comissões</h2>
                        <span className="text-xs text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                            {commissions.length} registros
                        </span>
                    </div>

                    <div className="space-y-3">
                        {commissions.length > 0 ? (
                            commissions.map((c: any) => (
                                <Card key={c.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-zinc-300">{c.description || 'Comissão de Venda'}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                                <span>{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                                                <span>•</span>
                                                <span>{new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-400">+R$ {Number(c.amount).toFixed(2)}</p>
                                            <Badge variant="outline" className={`mt-1 text-[9px] uppercase tracking-widest font-bold ${statusColor(c.status)}`}>
                                                {statusLabel(c.status)}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="py-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-2">
                                <DollarSign className="w-8 h-8 opacity-20" />
                                <p className="text-sm">Nenhuma comissão registrada.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payouts List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-[2px]">
                        <h2 className="text-lg font-bold text-zinc-200">Histórico de Saques</h2>
                        <span className="text-xs text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                            {payouts.length} registros
                        </span>
                    </div>

                    <div className="space-y-3">
                        {payouts.length > 0 ? (
                            payouts.map((p: any) => (
                                <Card key={p.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                                Solicitação de Saque
                                                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                                <span>{new Date(p.created_at).toLocaleDateString('pt-BR')}</span>
                                                <span>•</span>
                                                <span className="uppercase">{p.payout_method || 'PIX'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-zinc-100">R$ {Number(p.amount).toFixed(2)}</p>
                                            <Badge variant="outline" className={`mt-1 text-[9px] uppercase tracking-widest font-bold ${statusColor(p.status)}`}>
                                                {statusLabel(p.status)}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="py-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-2">
                                <AlertCircle className="w-8 h-8 opacity-20" />
                                <p className="text-sm">Nenhum saque solicitado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

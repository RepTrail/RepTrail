'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updatePayoutStatus } from '@/actions/admin-affiliate-actions'
import { CheckCircle2, XCircle, Clock, Banknote } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface Payout {
    id: string
    amount: number
    status: string
    payout_method: string
    payout_details: any
    created_at: string
    affiliate_id: string
    profiles?: {
        full_name: string
        email: string
    }
}

export function PayoutsManagement({ initialPayouts }: { initialPayouts: Payout[] }) {
    const { toast } = useToast()
    const [payouts, setPayouts] = useState<Payout[]>(initialPayouts)
    const { mutate: updateStatusMutate } = useOptimisticMutation({
        actionName: 'update-payout-status',
        entity: ENTITIES.PAYOUT,
        queryKey: ['admin', 'payouts'],
        mutationFn: async (variables: { id: string, status: 'completed' | 'rejected' }) => variables,
        onMutate: (variables) => {
            const previousPayouts = [...payouts]
            setPayouts(prev => prev.map(p => p.id === variables.id ? { ...p, status: variables.status } : p))
            return { previousPayouts }
        },
        onSuccess: () => {
            toast({ title: 'Status do saque atualizado!', description: 'A alteração está sendo sincronizada.' })
        },
        onError: (err, variables, ctx) => {
            setPayouts(ctx?.previousPayouts || [])
            toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao atualizar status.' })
        }
    })

    const handleUpdateStatus = (id: string, status: 'completed' | 'rejected') => {
        if (!confirm(`Deseja marcar este saque como ${status === 'completed' ? 'PAGO' : 'REJEITADO'}?`)) return
        updateStatusMutate({ id, status })
    }

    const formatPixKey = (details: any) => {
        if (!details || !details.details) return 'Chave não informada'
        return details.details
    }

    const pendingPayouts = payouts.filter(p => p.status === 'requested' || p.status === 'pending')
    const completedPayouts = payouts.filter(p => p.status !== 'requested' && p.status !== 'pending')

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-500" />
                        Solicitações de Saque
                    </h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                        Aprove e gerencie pagamentos PIX dos seus afiliados.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Pendentes ({pendingPayouts.length})
                    </h3>

                    {pendingPayouts.length === 0 ? (
                        <div className="py-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-2">
                            <CheckCircle2 className="w-8 h-8 opacity-20 text-emerald-500" />
                            <p className="text-sm">Nenhuma solicitação de saque pendente!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingPayouts.map(payout => (
                                <Card key={payout.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white max-w-fulltruncate">{payout.profiles?.full_name || 'Usuário Desconhecido'}</p>
                                                    <p className="text-[10px] text-zinc-500 max-w-fulltruncate">{payout.profiles?.email}</p>
                                                </div>
                                                <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-[10px] font-bold tracking-wider">
                                                    PENDENTE
                                                </Badge>
                                            </div>

                                            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Chave PIX</p>
                                                <p className="text-xs font-mono text-zinc-300 break-all">{formatPixKey(payout.payout_details)}</p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className="text-[10px] text-zinc-500">{new Date(payout.created_at).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-xl font-black text-emerald-400">R$ {Number(payout.amount).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
                                            <Button
                                                variant="outline"
                                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 text-xs font-black uppercase tracking-widest h-9"
                                                onClick={() => handleUpdateStatus(payout.id, 'rejected')}
                                            >
                                                <XCircle className="w-4 h-4 mr-1.5" /> Rejeitar
                                            </Button>
                                            <Button
                                                className="bg-emerald-500 text-black hover:bg-emerald-600 text-xs font-black uppercase tracking-widest h-9"
                                                onClick={() => handleUpdateStatus(payout.id, 'completed')}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Pago (Pix)
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-8">
                    <h3 className="text-lg font-bold text-zinc-400">Histórico de Saques</h3>
                    {completedPayouts.length === 0 ? (
                        <p className="text-sm text-zinc-600">Nenhum saque processado ainda.</p>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-950/50 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Afiliado</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Data</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Valor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {completedPayouts.map(p => (
                                        <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-white">{p.profiles?.full_name}</p>
                                                <p className="text-[10px] text-zinc-500">{p.profiles?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs text-zinc-400">
                                                {new Date(p.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-black text-zinc-300">
                                                R$ {Number(p.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge className={`text-[9px] font-bold tracking-wider ${p.status === 'completed' || p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {p.status === 'completed' || p.status === 'paid' ? 'PAGO' : 'REJEITADO'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

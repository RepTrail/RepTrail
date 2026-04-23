'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Banknote, AlertCircle, ArrowRight } from 'lucide-react'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

interface RequestPayoutModalProps {
    isOpen: boolean
    onClose: () => void
    availableBalance: number
}

export function RequestPayoutModal({ isOpen, onClose, availableBalance }: RequestPayoutModalProps) {
    const { toast } = useToast()
    const [amount, setAmount] = useState<string>('')
    const [pixKey, setPixKey] = useState<string>('')

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'request-payout',
        entity: ENTITIES.PAYOUT,
        entityId: 'new',
        queryKey: QUERY_KEYS.affiliate.earnings,
        mutationFn: async (variables: { amount: number, method: string, details: string }) => {
            const { requestPayout } = await import('@/actions/affiliate-actions')
            const res = await requestPayout(variables.amount, variables.method, variables.details)
            if (res.error) throw new Error(res.error)
            return res
        },
        onMutate: () => {
             toast({ title: 'Solicitação registrada!', description: 'Sua solicitação foi salva e será sincronizada.' })
             onClose()
             setAmount('')
             setPixKey('')
        },
        onSuccess: () => {
            toast({ title: 'Saque solicitado!', description: 'Nossa equipe processará o pagamento em breve.' })
        }
    })

    const handleMaxAmount = () => {
        setAmount(availableBalance.toFixed(2))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const val = parseFloat(amount.replace(',', '.'))
        if (isNaN(val) || val < 50) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'O valor mínimo para saque é de R$ 50,00.' })
            return
        }
        if (val > availableBalance) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Saldo insuficiente.' })
            return
        }
        if (!pixKey.trim()) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Por favor, informe a chave PIX.' })
            return
        }

        mutate({ amount: val, method: 'PIX', details: pixKey.trim() })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-zinc-950 border-zinc-800">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Banknote className="w-6 h-6 text-emerald-500" />
                    </div>
                    <DialogTitle className="text-xl font-black italic uppercase">Solicitar Saque</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-sm">
                        Transfira suas comissões confirmadas para sua conta via PIX.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 flex justify-between items-center text-sm">
                        <span className="text-zinc-400 font-medium">Saldo Disponível:</span>
                        <span className="text-emerald-400 font-black">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Valor do Saque (R$)
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-black">R$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    min="50"
                                    max={availableBalance}
                                    className="pl-9 bg-zinc-900 border-zinc-800 h-12 text-lg font-black"
                                    disabled={isPending}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                    onClick={handleMaxAmount}
                                    disabled={isPending}
                                >
                                    SAQUE TOTAL
                                </Button>
                            </div>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Mínimo de R$ 50,00
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Chave PIX
                            </Label>
                            <Input
                                value={pixKey}
                                onChange={(e) => setPixKey(e.target.value)}
                                placeholder="CPF, Celular, E-mail ou Aleatória"
                                className="bg-zinc-900 border-zinc-800 h-12 text-sm font-medium focus-visible:ring-emerald-500"
                                disabled={isPending}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-zinc-800 hover:bg-zinc-800 text-xs font-black uppercase tracking-widest h-12"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black uppercase tracking-widest h-12 gap-2"
                            disabled={isPending || availableBalance < 50}
                        >
                            {isPending ? 'Processando...' : 'Confirmar'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { useState } from 'react'
import { Sparkles, Calendar, Zap, CreditCard, QrCode, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createAsaasSubscription } from '@/actions/asaas-actions'
import { toast } from '@/hooks/use-toast'

interface StudentTrialBadgeProps {
    trialEnd: string | null
    status: string | null
}

export function StudentTrialBadge({ trialEnd, status }: StudentTrialBadgeProps) {
    const [loading, setLoading] = useState(false)
    const [showPayment, setShowPayment] = useState(false)

    if (!trialEnd || status === 'active') return null

    const expiryDate = new Date(trialEnd)
    const now = new Date()
    const diffMs = expiryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    const isExpired = diffDays <= 0

    const handleSubscribe = async (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        setLoading(true)
        toast({
            title: "Gerando pagamento...",
            description: "Preparando sua assinatura Auto-Treino..."
        })

        const res = await createAsaasSubscription('auto_training', type)
        setLoading(false)

        if (res.success && res.invoiceUrl) {
            window.location.href = res.invoiceUrl
        } else if (res.error) {
            toast({ variant: 'destructive', title: 'Erro', description: res.error })
        }
    }

    return (
        <div className="space-y-4">
            <div className={`
                p-6 rounded-[2rem] border backdrop-blur-sm shadow-xl transition-all
                ${isExpired
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/20'}
            `}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className={`
                            p-3 rounded-2xl 
                            ${isExpired ? 'bg-red-500/20' : 'bg-emerald-500/20'}
                        `}>
                            <Sparkles className={`w-6 h-6 ${isExpired ? 'text-red-400' : 'text-emerald-400'}`} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                                {isExpired ? 'Período de Teste Encerrado' : 'Período de Teste Ativo'}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium max-w-sm">
                                {isExpired
                                    ? 'Seu acesso ao Auto-Treino expirou. Assine agora para continuar evoluindo.'
                                    : `Você ainda tem ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} de uso gratuito no RepTrail.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!showPayment ? (
                            <Button
                                onClick={() => setShowPayment(true)}
                                className="h-12 px-8 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-wide text-xs group"
                            >
                                Assinar Agora
                                <Zap className="w-3.5 h-3.5 ml-2 fill-current" />
                            </Button>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => handleSubscribe('PIX')}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-10 rounded-lg border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-black uppercase text-[9px] gap-2"
                                >
                                    <QrCode className="w-3 h-3" /> Pix
                                </Button>
                                <Button
                                    onClick={() => handleSubscribe('CREDIT_CARD')}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-10 rounded-lg border-zinc-800 bg-zinc-900 text-white font-black uppercase text-[9px] gap-2"
                                >
                                    <CreditCard className="w-3 h-3" /> Cartão
                                </Button>
                                <Button
                                    onClick={() => setShowPayment(false)}
                                    variant="ghost"
                                    className="h-10 px-3 text-zinc-500 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 px-6">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Válido até {expiryDate.toLocaleDateString('pt-BR')}
                </span>
            </div>
        </div>
    )
}

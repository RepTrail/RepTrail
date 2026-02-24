'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreditCard, QrCode, FileText, User, ShieldCheck } from 'lucide-react'
import { createAsaasSubscription } from '@/actions/asaas-actions'
import { useToast } from '@/hooks/use-toast'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    tier: 'on_demand' | 'auto_training'
    currentCpf?: string
    monthlyTotal: number
}

export function PaymentModal({ isOpen, onClose, tier, currentCpf, monthlyTotal }: PaymentModalProps) {
    const [step, setStep] = useState<'info' | 'payment'>(currentCpf ? 'payment' : 'info')
    const [cpf, setCpf] = useState(currentCpf || '')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleCpfSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanCpf = cpf.replace(/\D/g, '')
        if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
            toast({
                variant: 'destructive',
                title: 'Documento inválido',
                description: 'Por favor, insira um CPF ou CNPJ válido.'
            })
            return
        }
        setStep('payment')
    }

    const handleSubscribe = async (method: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        setLoading(true)
        toast({
            title: "Processando...",
            description: "Estamos preparando sua assinatura no Asaas."
        })

        try {
            const res = await createAsaasSubscription(tier, method, cpf.replace(/\D/g, ''))

            if (res.success) {
                if (res.invoiceUrl) {
                    window.location.href = res.invoiceUrl
                } else {
                    toast({ title: 'Sucesso!', description: 'Seu plano foi ativado com sucesso.' })
                    setTimeout(() => window.location.reload(), 2000)
                }
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro no Asaas',
                    description: res.error || 'Ocorreu um erro ao processar o pagamento.'
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erro inesperado',
                description: 'Tente novamente em instantes.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 sm:max-w-md rounded-[2.5rem] p-8 overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16" />

                <DialogHeader className="space-y-4 mb-6 relative z-10">
                    <div className="flex justify-center">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            Finalizar <span className="text-emerald-500">Assinatura</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                            {tier === 'auto_training' ? 'Plano Aluno Auto-Treino' : 'Plano Trainer On-Demand'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="relative z-10">
                    {step === 'info' ? (
                        <form onSubmit={handleCpfSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    CPF ou CNPJ para Nota Fiscal
                                </label>
                                <Input
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl focus:border-emerald-500/50 font-bold text-white text-center"
                                    required
                                />
                                <p className="text-[9px] text-zinc-600 font-bold uppercase text-center leading-relaxed">
                                    O Asaas exige um documento válido para gerar a cobrança de forma segura.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95"
                            >
                                Continuar para Pagamento
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-1">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Valor da Assinatura</p>
                                <p className="text-2xl font-black text-white italic">R$ {monthlyTotal.toFixed(2).replace('.', ',')}</p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => handleSubscribe('CREDIT_CARD')}
                                    disabled={loading}
                                    className="w-full h-14 bg-white hover:bg-zinc-100 text-zinc-950 rounded-2xl font-black uppercase italic tracking-wide text-sm gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <CreditCard className="w-5 h-5 text-zinc-950" />
                                    Cartão de Crédito
                                </Button>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => handleSubscribe('PIX')}
                                        disabled={loading}
                                        variant="outline"
                                        className="h-12 rounded-xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-widest text-[10px] gap-2 transition-all"
                                    >
                                        <QrCode className="w-4 h-4 text-emerald-500" />
                                        Pix
                                    </Button>
                                    <Button
                                        onClick={() => handleSubscribe('BOLETO')}
                                        disabled={loading}
                                        variant="outline"
                                        className="h-12 rounded-xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-widest text-[10px] gap-2 transition-all"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Boleto
                                    </Button>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('info')}
                                className="w-full py-2 text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Alterar Documento
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

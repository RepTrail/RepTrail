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
import { CreditCard, User, ShieldCheck } from 'lucide-react'
import { createAsaasSubscription, searchAsaasCustomer } from '@/actions/asaas-actions'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    tier: 'on_demand' | 'auto_training'
    currentCpf?: string
    currentName?: string
    monthlyTotal: number
}

export function PaymentModal({ isOpen, onClose, tier, currentCpf, currentName, monthlyTotal }: PaymentModalProps) {
    const [step, setStep] = useState<'info' | 'payment'>(currentCpf && currentName ? 'payment' : 'info')
    const [cpf, setCpf] = useState(currentCpf || '')
    const [fullName, setFullName] = useState(currentName || '')
    const [fetchingName, setFetchingName] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const maskCpfCnpj = (value: string) => {
        const clean = value.replace(/\D/g, '')
        if (clean.length <= 11) {
            return clean
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
        }
        return clean
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    }

    const validateCpfCnpj = (val: string) => {
        const clean = val.replace(/\D/g, '')
        if (clean.length === 11) {
            // Basic CPF validation logic
            if (/^(\d)\1+$/.test(clean)) return false
            let sum = 0
            for (let i = 1; i <= 9; i++) sum = sum + parseInt(clean.substring(i - 1, i)) * (11 - i)
            let rest = (sum * 10) % 11
            if ((rest === 10) || (rest === 11)) rest = 0
            if (rest !== parseInt(clean.substring(9, 10))) return false
            sum = 0
            for (let i = 1; i <= 10; i++) sum = sum + parseInt(clean.substring(i - 1, i)) * (12 - i)
            rest = (sum * 10) % 11
            if ((rest === 10) || (rest === 11)) rest = 0
            if (rest !== parseInt(clean.substring(10, 11))) return false
            return true
        }
        if (clean.length === 14) return true // Basic length check for CNPJ for now
        return false
    }

    // Auto-search name when CPF is completed
    useEffect(() => {
        const clean = cpf.replace(/\D/g, '')
        console.log(`[ASAAS_CLIENT] Input changed. Clean: ${clean} | Len: ${clean.length}`)

        if ((clean.length === 11 || clean.length === 14)) {
            console.log(`[ASAAS_CLIENT] Target length reached. Current fullName: "${fullName}"`)

            // Only search if we don't have a full name yet or if it looks like a placeholder
            const isPlaceholder = !fullName || fullName.trim().split(' ').length < 2

            if (isPlaceholder) {
                console.log(`[ASAAS_CLIENT] Triggering lookup for: ${clean}`)
                const timer = setTimeout(async () => {
                    setFetchingName(true)
                    try {
                        const res = await searchAsaasCustomer(clean)
                        console.log(`[ASAAS_CLIENT] API Response:`, res)
                        if (res.success && res.name) {
                            console.log(`[ASAAS_CLIENT] Name found! Updating to: ${res.name}`)
                            setFullName(res.name)
                            toast({
                                title: "Nome Identificado",
                                description: `Encontramos ${res.name} na base Asaas.`
                            })
                        } else {
                            console.log(`[ASAAS_CLIENT] Name not found in Asaas base.`)
                        }
                    } catch (err) {
                        console.error(`[ASAAS_CLIENT] Server Action Error:`, err)
                    } finally {
                        setFetchingName(false)
                    }
                }, 800)
                return () => clearTimeout(timer)
            }
        }
    }, [cpf])

    const handleCpfSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanCpf = cpf.replace(/\D/g, '')

        if (!validateCpfCnpj(cleanCpf)) {
            toast({
                variant: 'destructive',
                title: 'Documento inválido',
                description: 'Por favor, insira um CPF ou CNPJ válido.'
            })
            return
        }

        if (fullName.trim().split(' ').length < 2) {
            toast({
                variant: 'destructive',
                title: 'Nome incompleto',
                description: 'Por favor, insira seu nome completo para evitar problemas no pagamento.'
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
            const res = await createAsaasSubscription(tier, method, cpf.replace(/\D/g, ''), fullName.trim())

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
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />

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
                                    onChange={(e) => setCpf(maskCpfCnpj(e.target.value))}
                                    placeholder="000.000.000-00"
                                    className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl focus:border-emerald-500/50 font-bold text-white text-center"
                                    required
                                    maxLength={18}
                                />
                                <p className="text-[9px] text-zinc-600 font-bold uppercase text-center leading-relaxed">
                                    O Asaas exige um documento válido para gerar a cobrança de forma segura.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Ex: João Silva Santos"
                                        className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl focus:border-emerald-500/50 font-bold text-white text-center"
                                        required
                                    />
                                    {fetchingName && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase text-center leading-relaxed">
                                    O nome deve ser idêntico ao registrado no CPF e no cartão de crédito.
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

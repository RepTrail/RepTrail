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
import { searchAsaasCustomer } from '@/actions/asaas-actions'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    tier: 'on_demand' | 'auto_training'
    currentCpf?: string
    currentName?: string
    monthlyTotal: number
    userId?: string // Added userId for cache parity
}

export function PaymentModal({ isOpen, onClose, tier, currentCpf, currentName, monthlyTotal, userId }: PaymentModalProps) {
    const [step, setStep] = useState<'info' | 'payment' | 'card_details'>(currentCpf && currentName ? 'payment' : 'info')
    const [cpf, setCpf] = useState(currentCpf || '')
    const [fullName, setFullName] = useState(currentName || '')
    const [cardData, setCardData] = useState({
        number: '',
        holder: '',
        expiry: '',
        cvv: '',
        postalCode: '',
        addressNumber: ''
    })
    const [fetchingName, setFetchingName] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

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

    const maskCardNumber = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19)
    }

    const maskExpiry = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{2})/, '$1/').substring(0, 5)
    }

    const maskCep = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{5})/, '$1-').substring(0, 9)
    }

    const validateCpfCnpj = (val: string) => {
        const clean = val.replace(/\D/g, '')
        if (clean.length === 11) {
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
        if (clean.length === 14) return true 
        return false
    }

    useEffect(() => {
        const clean = cpf.replace(/\D/g, '')
        if ((clean.length === 11 || clean.length === 14)) {
            const isPlaceholder = !fullName || fullName.trim().split(' ').length < 2
            if (isPlaceholder) {
                const timer = setTimeout(async () => {
                    setFetchingName(true)
                    try {
                        const res = await searchAsaasCustomer(clean)
                        if (res.success && res.name) {
                            setFullName(res.name)
                            toast({
                                title: "Nome Identificado",
                                description: `Encontramos ${res.name} na base Asaas.`
                            })
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

    const { mutate } = useOptimisticMutation({
        actionName: 'create-asaas-subscription',
        entity: ENTITIES.SUBSCRIPTION,
        queryKey: ['profile'],
        mutationFn: async () => {}, // Sync Engine will handle it
        onSuccess: () => {
            toast({ title: 'Sucesso!', description: 'Sua assinatura está sendo processada.' })
            const target = tier === 'auto_training' ? '/dashboard/student' : '/dashboard/trainer'
            setTimeout(() => window.location.href = target, 1500)
        },
        onError: (err: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro no Pagamento',
                description: err.message || 'Ocorreu um erro ao processar o cartão.'
            })
        }
    })

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        
        toast({
            title: "Processando...",
            description: "Estamos preparando sua assinatura no Asaas."
        })

        const [month, year] = cardData.expiry.split('/')
        const fullYear = `20${year}`

        mutate({
            tier,
            paymentMethod: 'CREDIT_CARD',
            cpfCnpj: cpf.replace(/\D/g, ''),
            fullName: fullName.trim(),
            userId, // For query key reconciliation
            creditCard: {
                holderName: cardData.holder,
                number: cardData.number.replace(/\s/g, ''),
                expiryMonth: month,
                expiryYear: fullYear,
                ccv: cardData.cvv,
                postalCode: cardData.postalCode.replace(/\D/g, ''),
                addressNumber: cardData.addressNumber
            }
        })

        // 🚀 HARD LOCK: Close modal instantly
        onClose()
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
                                    O nome deve ser idêntico ao registrado no CPF.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95"
                            >
                                Continuar
                            </Button>
                        </form>
                    ) : step === 'payment' ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-1">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Valor da Assinatura</p>
                                <p className="text-2xl font-black text-white italic">R$ {monthlyTotal.toFixed(2).replace('.', ',')}</p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => setStep('card_details')}
                                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
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
                    ) : (
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Número do Cartão</label>
                                <Input
                                    value={cardData.number}
                                    onChange={(e) => setCardData(d => ({ ...d, number: maskCardNumber(e.target.value) }))}
                                    placeholder="0000 0000 0000 0000"
                                    className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Nome Impresso no Cartão</label>
                                <Input
                                    value={cardData.holder}
                                    onChange={(e) => setCardData(d => ({ ...d, holder: e.target.value.toUpperCase() }))}
                                    placeholder="JOÃO S SANTOS"
                                    className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Validade (MM/AA)</label>
                                    <Input
                                        value={cardData.expiry}
                                        onChange={(e) => setCardData(d => ({ ...d, expiry: maskExpiry(e.target.value) }))}
                                        placeholder="MM/AA"
                                        className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">CVV</label>
                                    <Input
                                        value={cardData.cvv}
                                        onChange={(e) => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                                        placeholder="000"
                                        className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white text-center"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">CEP (Endereço de Cobrança)</label>
                                    <Input
                                        value={cardData.postalCode}
                                        onChange={(e) => setCardData(d => ({ ...d, postalCode: maskCep(e.target.value) }))}
                                        placeholder="00000-000"
                                        className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Número</label>
                                    <Input
                                        value={cardData.addressNumber}
                                        onChange={(e) => setCardData(d => ({ ...d, addressNumber: e.target.value }))}
                                        placeholder="Ex: 123"
                                        className="h-12 bg-zinc-900 border-zinc-800 rounded-xl font-bold text-white text-center"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    type="submit"
                                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl font-black uppercase italic tracking-wide transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
                                >
                                    Finalizar Assinatura
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep('payment')}
                                    className="w-full text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    Voltar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Users, Zap, ArrowRight, Sparkles, CreditCard, QrCode, FileText } from 'lucide-react'
import { createAsaasSubscription } from "@/actions/asaas-actions"
import { useToast } from "@/hooks/use-toast"
import { PaymentModal } from "../asaas/payment-modal"

const FREE_LIMIT = 5
const PRICE_PER_STUDENT = 10.90

interface PlansClientProps {
    currentTier: string
    studentCount: number
    profile?: any
}

export function PlansClient({ currentTier, studentCount, profile }: PlansClientProps) {
    const [simStudents, setSimStudents] = useState(studentCount || FREE_LIMIT)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()

    const isActive = currentTier && currentTier !== 'none'

    const billableStudents = Math.max(0, simStudents - FREE_LIMIT)
    const monthlyTotal = billableStudents * PRICE_PER_STUDENT

    const handleSubscribeAsaas = async (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        setLoading(true)

        if (monthlyTotal === 0) {
            toast({
                title: "Ativando plano...",
                description: "Como você tem até 5 alunos, seu plano será ativado sem custo agora."
            })
            const res = await createAsaasSubscription('on_demand', type)
            setLoading(false)

            if (res.success) {
                toast({ title: 'Plano Ativado!', description: 'Seu plano on-demand foi ativado com sucesso.' })
                setTimeout(() => window.location.reload(), 2000)
            } else if (res.error) {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            }
        } else {
            setIsModalOpen(true)
            setLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return value.toFixed(2).replace('.', ',')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10" suppressHydrationWarning>
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tier="on_demand"
                currentCpf={profile?.cpf_cnpj}
                monthlyTotal={monthlyTotal}
            />

            {/* Plan Card */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">

                {/* Top gradient glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-5 right-5">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Plano único
                    </span>
                </div>

                <div className="p-8 space-y-8">
                    {/* Title */}
                    <div className="space-y-2 pr-28">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">RepTrail</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Comece grátis e cresça no seu ritmo. Sem contratos, sem mensalidade fixa.
                        </p>
                    </div>

                    {/* Pricing Display */}
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">Grátis</span>
                            <span className="text-zinc-500 text-sm font-medium">até {FREE_LIMIT} alunos</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-lg font-bold text-emerald-400">
                                R$ {formatCurrency(PRICE_PER_STUDENT)}
                            </span>
                            <span className="text-zinc-500 text-sm">/aluno/mês acima de {FREE_LIMIT}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-zinc-800" />

                    {/* Features */}
                    <ul className="space-y-3">
                        {[
                            'Alunos ilimitados',
                            'Treinos e dietas personalizados',
                            'Importação de PDF com IA',
                            'Anotação de cargas e evoluções',
                            'Gráficos de progresso',
                            'Fotos de evolução',
                            'Ranking entre treinadores',
                            'Presença no marketplace',
                        ].map(feature => (
                            <li key={feature} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                </div>
                                <span className="text-zinc-300 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Divider */}
                    <div className="h-px bg-zinc-800" />

                    {/* Calculator */}
                    <div className="space-y-4 bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-400" />
                            <p className="text-sm font-bold text-zinc-300 uppercase tracking-widest text-xs">Simule o seu custo</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 text-xs">Alunos</span>
                                <span className="text-white font-black text-lg">{simStudents}</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={100}
                                value={simStudents}
                                onChange={e => setSimStudents(Number(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                <span>1</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                            <div className="flex justify-between items-center text-xs text-zinc-500">
                                <span>Primeiros {FREE_LIMIT} alunos</span>
                                <span className="text-emerald-400 font-bold">GRÁTIS</span>
                            </div>
                            {billableStudents > 0 && (
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>{billableStudents} alunos extras × R$ {formatCurrency(PRICE_PER_STUDENT)}</span>
                                    <span className="text-zinc-300 font-bold">R$ {formatCurrency(billableStudents * PRICE_PER_STUDENT)}</span>
                                </div>
                            )}
                            <div className="h-px bg-zinc-800" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-white uppercase tracking-widest">Total/mês</span>
                                <span className="text-xl font-black text-white">
                                    {monthlyTotal === 0 ? 'R$ 0,00 🎉' : `R$ ${formatCurrency(monthlyTotal)}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    {profile?.is_billing_exempt ? (
                        <div className="flex items-center gap-3 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-xl shadow-amber-950/20">
                            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                            <div className="space-y-0.5">
                                <p className="text-amber-500 font-black text-sm uppercase italic tracking-tighter">Acesso VIP Ilimitado</p>
                                <p className="text-amber-500/60 text-[10px] font-bold uppercase tracking-widest">Você é um parceiro isento de cobranças.</p>
                            </div>
                        </div>
                    ) : isActive ? (
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-400 font-bold text-sm">Plano ativo — você está sendo cobrado conforme o uso</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {monthlyTotal === 0 ? (
                                <Button
                                    onClick={() => handleSubscribeAsaas('PIX')}
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest text-sm gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Zap className="w-5 h-5 fill-current" />
                                    Ativar Plano Gratuito
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest text-sm gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Zap className="w-5 h-5 fill-current" />
                                    Finalizar Assinatura
                                </Button>
                            )}
                        </div>
                    )}


                    <p className="text-center text-zinc-600 text-xs">
                        Sem taxa de setup · Cancele quando quiser · Checkout Seguro via Asaas
                    </p>
                </div>
            </div>

        </div>
    )
}


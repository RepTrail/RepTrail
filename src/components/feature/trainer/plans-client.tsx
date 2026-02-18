'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Crown, Zap, X } from 'lucide-react'
import { updateTrainerPlan } from "@/actions/trainer-actions"
import { createCheckoutSession } from "@/actions/stripe-actions"
import { useToast } from "@/hooks/use-toast"

interface PlansClientProps {
    currentTier: 'none' | 'start' | 'pro' | 'elite'
}

type BillingPeriod = 'monthly' | 'quarterly' | 'annual'

const tiers = [
    {
        id: 'start' as const,
        name: 'Start',
        tagline: 'Para começar',
        icon: Zap,
        gradient: 'from-blue-500 via-blue-600 to-cyan-600',
        accentColor: 'bg-blue-500',
        monthlyPrice: 49.90,
        features: [
            'Até 10 alunos',
            'Atualizações de fotos 2x/mês',
            'Gestão básica de treinos',
            'Gestão básica de dietas',
            'Presença no ranking',
        ],
        blocked: [
            'Anotação de cargas',
            'Importação de PDF',
            'IA para macros',
            'Gráficos de evolução',
        ]
    },
    {
        id: 'pro' as const,
        name: 'Pro',
        tagline: 'Mais popular',
        icon: Sparkles,
        gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
        accentColor: 'bg-emerald-500',
        monthlyPrice: 149.90,
        popular: true,
        features: [
            'Até 50 alunos',
            'Atualizações de fotos 4x/mês',
            'Anotação de cargas',
            'Importação de PDF',
            'IA para cálculo de macros',
            'Badge PRO no ranking',
            'Gráficos de evolução',
        ],
        blocked: []
    },
    {
        id: 'elite' as const,
        name: 'Elite',
        tagline: 'Poder máximo',
        icon: Crown,
        gradient: 'from-amber-500 via-orange-600 to-red-600',
        accentColor: 'bg-amber-500',
        monthlyPrice: 299.90,
        features: [
            'Alunos ilimitados',
            'Atualizações ilimitadas',
            'Tudo do plano PRO',
            'Prioridade no ranking',
            'Badge ELITE de destaque',
            'Suporte prioritário',
        ],
        blocked: []
    }
]

export function PlansClient({ currentTier }: PlansClientProps) {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
    const [loading, setLoading] = useState<string | null>(null)
    const { toast } = useToast()

    const getDiscount = (period: BillingPeriod) => {
        if (period === 'quarterly') return 0.15
        if (period === 'annual') return 0.20
        return 0
    }

    const calculatePrice = (monthlyPrice: number, period: BillingPeriod) => {
        const discount = getDiscount(period)
        const multiplier = period === 'quarterly' ? 3 : period === 'annual' ? 12 : 1
        const total = monthlyPrice * multiplier * (1 - discount)
        return total
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const handleSelectPlan = async (tier: 'start' | 'pro' | 'elite') => {
        if (tier === currentTier) return

        setLoading(tier)

        // Simulate Stripe Checkout Flow
        toast({
            title: "Processando...",
            description: "Redirecionando para o ambiente seguro de pagamento...",
        })

        const res = await createCheckoutSession(tier, billingPeriod)

        setLoading(null)

        if (res.success) {
            toast({
                title: "Mock: Checkout Iniciado",
                description: "Nesta etapa, o usuário seria redirecionado para a Stripe. Como você é Admin, pode liberar o acesso via painel /admin.",
            })

            // For now, if it's a mock, we can still allow the update if we want to keep it "working" 
            // but the user said "even if locked", so let's keep it as redirect only.
            // If the user wants to keep the direct update for testing, I'll comment it out below.

            /* 
            const result = await updateTrainerPlan(tier)
            if (result.success) {
                toast({ title: '✓ Plano Atualizado (Modo Teste)' })
            }
            */
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro no checkout',
                description: res.error || 'Não foi possível iniciar o pagamento.'
            })
        }
    }

    return (
        <div className="space-y-10">
            {/* Billing Period Toggle */}
            <div className="flex justify-center">
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-1.5 inline-flex gap-1 shadow-xl">
                    <button
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${billingPeriod === 'monthly'
                            ? 'bg-white text-zinc-900 shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            }`}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setBillingPeriod('quarterly')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative active:scale-95 ${billingPeriod === 'quarterly'
                            ? 'bg-white text-zinc-900 shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            }`}
                    >
                        Trimestral
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                            -15%
                        </span>
                    </button>
                    <button
                        onClick={() => setBillingPeriod('annual')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative active:scale-95 ${billingPeriod === 'annual'
                            ? 'bg-white text-zinc-900 shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            }`}
                    >
                        Anual
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-3">
                {tiers.map((tier) => {
                    const Icon = tier.icon
                    const price = calculatePrice(tier.monthlyPrice, billingPeriod)
                    const isCurrentTier = tier.id === currentTier
                    const savings = billingPeriod !== 'monthly'
                        ? tier.monthlyPrice * (billingPeriod === 'quarterly' ? 3 : 12) - price
                        : 0

                    return (
                        <Card
                            key={tier.id}
                            className={`relative overflow-hidden bg-zinc-950/50 backdrop-blur-sm border-2 transition-all duration-300 ${tier.popular
                                ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105'
                                : isCurrentTier
                                    ? 'border-zinc-700'
                                    : 'border-zinc-800/50 hover:border-zinc-700/50'
                                }`}
                        >
                            {/* Popular Badge */}
                            {tier.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 py-2 text-center">
                                    <span className="text-white text-xs font-black uppercase tracking-widest">
                                        ⚡ Mais Popular
                                    </span>
                                </div>
                            )}

                            {/* Current Plan Badge */}
                            {isCurrentTier && !tier.popular && (
                                <div className="absolute top-4 right-4 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                                    Plano Atual
                                </div>
                            )}

                            <div className={`${tier.popular ? 'pt-14' : 'pt-6'} px-6 pb-8 space-y-6`}>
                                {/* Header */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tier.gradient} shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                                {tier.name}
                                            </h3>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                                                {tier.tagline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-white">
                                                {formatPrice(price).split(',')[0]}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black text-white">
                                                    ,{formatPrice(price).split(',')[1]}
                                                </span>
                                                <span className="text-xs text-zinc-600 font-bold uppercase">
                                                    /{billingPeriod === 'monthly' ? 'mês' : billingPeriod === 'quarterly' ? 'trimestre' : 'ano'}
                                                </span>
                                            </div>
                                        </div>

                                        {savings > 0 && (
                                            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                                <span className="text-xs text-emerald-500 font-bold">
                                                    Economize R$ {formatPrice(savings)}
                                                </span>
                                            </div>
                                        )}

                                        {billingPeriod !== 'monthly' && (
                                            <p className="text-sm text-zinc-500">
                                                <span className="font-semibold text-zinc-400">R$ {formatPrice(price / (billingPeriod === 'quarterly' ? 3 : 12))}</span> por mês
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                                {/* Features */}
                                <div className="space-y-3">
                                    {tier.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${tier.accentColor}`}>
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                            <span className="text-sm text-zinc-300 font-medium leading-tight">{feature}</span>
                                        </div>
                                    ))}

                                    {tier.blocked.length > 0 && (
                                        <>
                                            {tier.blocked.map((feature, index) => (
                                                <div key={index} className="flex items-start gap-3 opacity-40">
                                                    <div className="mt-0.5 p-0.5 rounded-full bg-zinc-800">
                                                        <X className="w-3 h-3 text-zinc-600" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-sm text-zinc-600 font-medium line-through leading-tight">{feature}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleSelectPlan(tier.id)}
                                    disabled={isCurrentTier || loading !== null}
                                    className={`w-full h-12 font-bold uppercase tracking-wide text-sm transition-all duration-200 rounded-xl active:scale-[0.98] ${isCurrentTier
                                        ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                                        : tier.popular
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400'
                                            : 'bg-white text-zinc-900 hover:bg-zinc-100 hover:shadow-lg'
                                        }`}
                                >
                                    {loading === tier.id ? 'Atualizando...' : isCurrentTier ? '✓ Plano Atual' : 'Contratar Agora'}
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

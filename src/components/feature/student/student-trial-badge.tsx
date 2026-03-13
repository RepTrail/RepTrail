'use client'

import { useState } from 'react'
import { Sparkles, Calendar, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AUTO_TRAINING_PRICE } from '@/lib/constants'
import { PaymentModal } from '../asaas/payment-modal'

interface StudentTrialBadgeProps {
    trialEnd: string | null
    status: string | null
    currentCpf?: string
    currentName?: string
}

export function StudentTrialBadge({ trialEnd, status, currentCpf, currentName }: StudentTrialBadgeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Only show if trial is active or expired, but not if it was never started (none) or is already a subscription (active)
    if (!trialEnd || status === 'active' || status === 'none' || !status) return null

    const expiryDate = new Date(trialEnd)
    const now = new Date()
    const diffMs = expiryDate.getTime() - now.getTime()
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

    const isExpired = diffDays <= 0

    return (
        <div className="space-y-4">
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tier="auto_training"
                currentCpf={currentCpf}
                currentName={currentName}
                monthlyTotal={AUTO_TRAINING_PRICE}
            />

            <div className={`
                p-6 sm:p-8 rounded-3xl border backdrop-blur-sm shadow-xl transition-all
                ${isExpired
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/20'}
            `}>
                <div className="flex flex-col gap-6">
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

                    <div className="w-full">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full h-14 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-wide text-sm group shadow-xl active:scale-95 transition-all"
                        >
                            Assinar Agora
                            <Zap className="w-4 h-4 ml-2 fill-current" />
                        </Button>
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

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, ChevronRight, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface PaymentWarningProps {
    relationship: any
}

export function PaymentWarning({ relationship }: PaymentWarningProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!relationship?.payment_day) return

        const today = new Date()
        const currentDay = today.getDate()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()

        const paymentDay = relationship.payment_day
        const lastPaymentDate = relationship.last_payment_date ? new Date(relationship.last_payment_date) : null

        // Overdue logic:
        // 1. Current day is >= payment day
        // 2. AND (Last payment is null OR Last payment month is before current month)
        const isOverdue = currentDay >= paymentDay && (
            !lastPaymentDate ||
            (lastPaymentDate.getMonth() < currentMonth && lastPaymentDate.getFullYear() <= currentYear) ||
            (lastPaymentDate.getFullYear() < currentYear)
        )

        if (isOverdue) {
            // Check session storage to avoid showing every refresh
            const dismissed = sessionStorage.getItem('payment_warning_dismissed')
            if (!dismissed) {
                setIsVisible(true)
            }
        }
    }, [relationship])

    if (!isVisible) return null

    return (
        <Dialog open={isVisible} onOpenChange={(open) => {
            if (!open) {
                setIsVisible(false)
                sessionStorage.setItem('payment_warning_dismissed', 'true')
            }
        }}>
            <DialogContent className="max-w-md border-orange-500/30">
                <div className="space-y-8">
                    <div className="space-y-4 text-center">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center border-2 border-orange-500/20 mx-auto animate-pulse">
                            <CreditCard className="w-10 h-10 text-orange-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Vencimento Próximo</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                Notamos que o prazo de pagamento do seu plano com <span className="text-white">{relationship.trainer?.full_name}</span> venceu ou está próximo.
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                            <span className="text-zinc-500">Dia de Vencimento</span>
                            <span className="text-orange-500">Dia {relationship.payment_day}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest border-t border-zinc-800 pt-4">
                            <span className="text-zinc-500">Valor Mensal</span>
                            <span className="text-white">R$ {relationship.monthly_fee?.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase leading-snug">
                                Para manter seu acesso aos treinos e dietas, realize o pagamento via PIX ou conforme combinado com seu personal.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            setIsVisible(false)
                            sessionStorage.setItem('payment_warning_dismissed', 'true')
                        }}
                        className="w-full h-14 bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl font-black uppercase italic tracking-widest shadow-xl active:scale-[0.98] transition-all"
                    >
                        Entendido, vou realizar
                        <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

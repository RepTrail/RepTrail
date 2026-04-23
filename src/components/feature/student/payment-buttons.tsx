'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { createAsaasSubscription } from '@/actions/asaas-actions'
import { useMutation } from '@tanstack/react-query'

export function StudentPaymentButtons() {
    const { toast } = useToast()

    const { mutate, isPending } = /* ❌ OUTBOX VIOLATION */ useMutation({
        mutationFn: async (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
            toast({
                title: "Gerando pagamento...",
                description: `Aguarde um instante enquanto preparamos seu checkout...`
            })
            return /* ❌ OUTBOX VIOLATION */ await createAsaasSubscription('auto_training', type)
        },
        onSuccess: (res) => {
            if (res.success && res.invoiceUrl) {
                window.location.href = res.invoiceUrl
            } else if (res.error) {
                toast({ variant: 'destructive', title: 'Erro no Asaas', description: res.error })
            }
        }
    })

    const handleAsaas = (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        mutate(type)
    }

    return (
        <div className="flex flex-col gap-3">
            <Button
                onClick={() => handleAsaas('CREDIT_CARD')}
                /* ❌ UI BLOCKING REMOVED */ disabled={false}
                className="w-full h-14 font-black uppercase tracking-[0.15em] bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Assinar com Cartão
                    </>
                )}
            </Button>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center mt-2">
                Pagamento processado com segurança pelo Asaas
            </p>
        </div>
    )
}

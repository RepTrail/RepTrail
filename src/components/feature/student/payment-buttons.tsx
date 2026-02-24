'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, CreditCard, QrCode } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { createAsaasSubscription } from '@/actions/asaas-actions'

export function StudentPaymentButtons() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleAsaas = async (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        setLoading(true)
        toast({
            title: "Gerando pagamento...",
            description: `Aguarde um instante enquanto preparamos seu checkout via ${type === 'PIX' ? 'Pix' : type === 'BOLETO' ? 'Boleto' : 'Cartão'}...`
        })
        const res = await createAsaasSubscription('auto_training', type)
        setLoading(false)

        if (res.success && res.invoiceUrl) {
            window.location.href = res.invoiceUrl
        } else if (res.error) {
            toast({ variant: 'destructive', title: 'Erro no Asaas', description: res.error })
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <Button
                onClick={() => handleAsaas('CREDIT_CARD')}
                disabled={loading}
                className="w-full h-14 font-black uppercase tracking-widest bg-white text-zinc-950 hover:bg-zinc-100 transition-all rounded-2xl shadow-xl flex items-center justify-center gap-2"
            >
                <CreditCard className="w-4 h-4" />
                Cartão de Crédito
            </Button>

            <div className="flex gap-3">
                <Button
                    onClick={() => handleAsaas('PIX')}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 h-12 font-black uppercase tracking-widest border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-xl flex items-center justify-center gap-2"
                >
                    <QrCode className="w-4 h-4" />
                    Pix
                </Button>
                <Button
                    onClick={() => handleAsaas('BOLETO')}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 h-12 font-black uppercase tracking-widest border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-xl flex items-center justify-center gap-2"
                >
                    Boleto
                </Button>
            </div>
        </div>
    )
}

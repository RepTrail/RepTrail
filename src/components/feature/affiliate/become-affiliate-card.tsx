'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Megaphone, DollarSign, Users, TrendingUp, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useToast } from '@/hooks/use-toast'

export function BecomeAffiliateCard() {
    const router = useRouter()
    const { toast } = useToast()

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'enable-affiliate',
        entity: ENTITIES.USER,
        entityId: 'me',
        queryKey: QUERY_KEYS.affiliate.all,
        mutationFn: async () => {
             const { enableAffiliate } = await import('@/actions/affiliate-actions')
             const res = await enableAffiliate()
             if (res.error) throw new Error(res.error)
             return res
        },
        onMutate: () => {
            toast({
                title: "Ativando programa...",
                description: "Seu link de afiliado está sendo gerado."
            })
        },
        onSuccess: () => {
            router.push('/dashboard/affiliate')
        }
    })

    return (
        <Card className="bg-gradient-to-br from-amber-500/10 to-zinc-900 border-amber-500/20 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-500" />
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Programa de Afiliados</p>
                </div>

                <div>
                    <h3 className="text-lg font-black text-white tracking-tight">Ganhe indicando personais</h3>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        Compartilhe seu link único e receba 10% de comissão por cada personal que contratar um plano.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: <Users className="w-4 h-4" />, label: 'Indicações', color: 'text-purple-400' },
                        { icon: <TrendingUp className="w-4 h-4" />, label: 'Conversões', color: 'text-blue-400' },
                        { icon: <DollarSign className="w-4 h-4" />, label: 'Comissão 10%', color: 'text-amber-400' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 bg-zinc-900/50 rounded-xl py-3 border border-zinc-800">
                            <span className={item.color}>{item.icon}</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center">{item.label}</span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={() => mutate(undefined)}
                    disabled={isPending}
                    className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                >
                    {isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Ativando...</>
                    ) : (
                        <>Ativar Programa <ArrowRight className="w-4 h-4" /></>
                    )}
                </Button>
                <p className="text-[10px] text-zinc-600 text-center">Sem custo. Sem taxas ocultas. Apenas ganhos.</p>
            </CardContent>
        </Card>
    )
}

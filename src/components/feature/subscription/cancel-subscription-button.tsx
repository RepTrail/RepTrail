'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cancelSubscription, reactivateSubscription } from "@/actions/stripe-actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { XCircle, AlertTriangle, ShieldAlert, ArrowRight, RefreshCcw, Calendar, Zap, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CancelSubscriptionButtonProps {
    isCancelled?: boolean
    periodEnd?: string | null
}

export function CancelSubscriptionButton({ isCancelled = false, periodEnd }: CancelSubscriptionButtonProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleAction = async () => {
        setLoading(true)
        try {
            const result = isCancelled ? await reactivateSubscription() : await cancelSubscription()
            if (result.success) {
                toast({
                    title: isCancelled ? "Assinatura Reativada! 🚀" : "Cancelamento Agendado 🗓️",
                    description: isCancelled
                        ? "Sua assinatura continuará ativa normalmente."
                        : "Seu plano será encerrado ao final do ciclo. Você ainda tem acesso total.",
                })
                setOpen(false)
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao processar",
                    description: result.error,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Tente novamente mais tarde.",
            })
        } finally {
            setLoading(false)
        }
    }

    if (isCancelled) {
        return (
            <div className="w-full space-y-4 pt-2">
                <div className="relative group p-4 bg-zinc-900/50 border border-orange-500/20 rounded-2xl overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-orange-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Renovação Inativa</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                            Seu plano On Demand termina em <span className="text-zinc-200 font-bold">{periodEnd ? formatDistanceToNow(new Date(periodEnd), { locale: ptBR }) : 'alguns dias'}</span>.
                        </p>
                    </div>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full h-12 rounded-xl bg-white text-zinc-950 hover:bg-emerald-500 hover:text-white font-black uppercase italic tracking-widest text-xs transition-all shadow-xl group">
                            <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                            Reativar Assinatura
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] bg-zinc-950 border-zinc-800/50 text-zinc-100 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <div className="p-8 space-y-8 relative z-10">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                                        Deseja <span className="text-emerald-500">Reativar?</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.15em] max-w-[280px]">
                                        Ao reativar, as cobranças automáticas serão retomadas e seu plano continuará sem interrupções.
                                    </DialogDescription>
                                </div>
                            </div>
                            <DialogFooter className="flex flex-col sm:flex-row gap-4">
                                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 h-14 bg-zinc-900 border-zinc-800 rounded-2xl font-black uppercase italic tracking-widest text-xs">Voltar</Button>
                                <Button onClick={handleAction} disabled={loading} className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-900/40">
                                    {loading ? 'Processando...' : 'Reativar Agora'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-auto py-2 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:bg-red-500/5 mt-4 group transition-all rounded-full border border-zinc-800/50 hover:border-red-500/30">
                    <XCircle className="w-3.5 h-3.5 mr-2 opacity-50 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
                    Encerrar Assinatura
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-zinc-950 border-zinc-800/50 text-zinc-100 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="p-8 space-y-8 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                            <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                                Confirmar <br /> <span className="text-red-500">Cancelamento?</span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.15em] max-w-[280px]">
                                Você manterá o acesso total ao plano On Demand até o final do ciclo já pago.
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
                                    O que acontece agora?
                                </p>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    <ArrowRight className="w-3 h-3 text-zinc-700 mt-0.5" />
                                    O acesso continua até o fim do ciclo atual.
                                </li>
                                <li className="flex items-start gap-2 text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    <ArrowRight className="w-3 h-3 text-zinc-700 mt-0.5" />
                                    Nenhuma nova cobrança será realizada.
                                </li>
                                <li className="flex items-start gap-2 text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    <ArrowRight className="w-3 h-3 text-zinc-700 mt-0.5" />
                                    Você poderá reativar a qualquer momento.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 h-14 bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all"
                        >
                            Manter Plano
                        </Button>
                        <Button
                            onClick={handleAction}
                            disabled={loading}
                            className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                            {loading ? 'Processando...' : (
                                <span className="flex items-center gap-2">
                                    Encerrar Ciclo
                                    <XCircle className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

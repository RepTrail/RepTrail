'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { BellRing, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { registerServiceWorker, subscribeToPush } from '@/lib/notifications'

export function NotificationRequestModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
    const { toast } = useToast()

    useEffect(() => {
        if (typeof window !== 'undefined' && "Notification" in window) {
            setPermissionStatus(Notification.permission)
            if (Notification.permission === 'default') {
                const timer = setTimeout(() => setIsOpen(true), 1500)
                return () => clearTimeout(timer)
            }
        }

        const handleManualOpen = () => {
            if ("Notification" in window) {
                setPermissionStatus(Notification.permission)
            }
            setIsOpen(true)
        }
        window.addEventListener('open-notifications-prompt', handleManualOpen)
        return () => window.removeEventListener('open-notifications-prompt', handleManualOpen)
    }, [])

    const handleRequest = async () => {
        if (!("Notification" in window)) {
            toast({
                title: "Não suportado",
                description: "Seu navegador não suporta notificações nativas.",
                variant: "destructive"
            })
            return
        }

        if (Notification.permission === 'denied') {
            toast({
                title: "Como Ativar Manualmente",
                description: "Clique no ícone de cadeado/configurações na barra de endereço do seu navegador e ative as notificações.",
            })
            return
        }

        if (Notification.permission === 'granted') {
            toast({
                title: "Já Ativado",
                description: "As notificações já estão funcionando corretamente.",
            })
            setIsOpen(false)
            return
        }

        setLoading(true)
        try {
            // Some browsers require a callback and some return a promise
            // This is the most compatible way to handle it
            const result = await Notification.requestPermission()
            setPermissionStatus(result)

            if (result === 'granted') {
                // Register SW and subscribe to push
                await registerServiceWorker()
                await subscribeToPush()

                toast({
                    title: "Tudo pronto!",
                    description: "Notificações ativadas com sucesso.",
                })
                setIsOpen(false)
            } else if (result === 'denied') {
                toast({
                    title: "Permissão Negada",
                    description: "Você bloqueou as notificações. Veja as instruções para reativar.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error)
            toast({
                title: "Erro",
                description: "Não foi possível solicitar permissão.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const isDenied = permissionStatus === 'denied'
    const isGranted = permissionStatus === 'granted'

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                showCloseButton={true}
                className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] sm:rounded-[3rem] max-w-[90vw] sm:max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
                <DialogHeader className="space-y-4 sm:space-y-6">
                    <div className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border shadow-2xl animate-in zoom-in duration-500 ${isDenied ? 'bg-red-500/10 border-red-500/30' :
                        isGranted ? 'bg-emerald-500/10 border-emerald-500/30' :
                            'bg-gradient-to-br from-amber-500/20 to-amber-900/10 border-amber-500/30'
                        }`}>
                        {isDenied ? (
                            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 animate-pulse" />
                        ) : isGranted ? (
                            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                        ) : (
                            <BellRing className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-pulse stroke-[1.5]" />
                        )}
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-center">
                        <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tighter leading-tight">
                            {isDenied ? (
                                <>Acesso <br /><span className="text-red-500">Bloqueado</span></>
                            ) : isGranted ? (
                                <>Notificações <br /><span className="text-emerald-500">Ativas</span></>
                            ) : (
                                <>Não perca o <br /><span className="text-amber-500">Timing!</span></>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium text-sm sm:text-base leading-relaxed px-2">
                            {isDenied ? (
                                "As notificações estão bloqueadas no navegador. Para receber alertas de descanso, você precisará reativar manualmente."
                            ) : isGranted ? (
                                "Seu navegador já está configurado para receber avisos de descanso e atualizações em tempo real."
                            ) : (
                                "Para garantir que você respeite os tempos de descanso exatos e receba atualizações do seu treinador, precisamos da sua permissão."
                            )}
                            <br /><br />
                            <span className={`text-zinc-300 font-bold block bg-zinc-900/50 py-3 rounded-2xl border ${isDenied ? 'border-red-900/30' :
                                isGranted ? 'border-emerald-900/30' :
                                    'border-zinc-800 shadow-inner'
                                }`}>
                                {isDenied ? "Status: Bloqueado" : isGranted ? "Status: 100% Configurado" : "Essencial para o funcionamento."}
                            </span>
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 sm:mt-6">
                    <Button
                        onClick={isGranted ? () => setIsOpen(false) : handleRequest}
                        /* ❌ UI BLOCKING REMOVED */ disabled={false}
                        className={`w-full font-black uppercase italic tracking-widest rounded-2xl h-12 sm:h-14 text-xs sm:text-sm shadow-xl transition-all active:scale-95 hover:scale-[1.02] ${isDenied ? 'bg-zinc-800 text-zinc-400' :
                            isGranted ? 'bg-zinc-100 text-zinc-950 hover:bg-white' :
                                'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : isDenied ? (
                            "Tentar Novamente"
                        ) : isGranted ? (
                            "Fechar"
                        ) : (
                            "Ativar Notificações"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

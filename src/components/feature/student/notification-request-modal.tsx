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
import { BellRing } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function NotificationRequestModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' && "Notification" in window) {
            if (Notification.permission === 'default') {
                const timer = setTimeout(() => setIsOpen(true), 1500)
                return () => clearTimeout(timer)
            }
        }

        const handleManualOpen = () => setIsOpen(true)
        window.addEventListener('open-notifications-prompt', handleManualOpen)
        return () => window.removeEventListener('open-notifications-prompt', handleManualOpen)
    }, [])

    const handleRequest = async () => {
        const permission = await Notification.requestPermission()
        // If permission is granted or denied (not default), close modal
        if (permission !== 'default') {
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                showCloseButton={true}
                className="bg-zinc-950 border border-zinc-800 rounded-[2rem] max-w-sm sm:max-w-md p-8"
                onInteractOutside={(e) => {
                    e.preventDefault()
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault()
                }}
            >
                <DialogHeader className="space-y-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-500/20 to-amber-900/10 rounded-full flex items-center justify-center border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] animate-in zoom-in duration-500">
                        <BellRing className="w-12 h-12 text-amber-500 animate-pulse stroke-[1.5]" />
                    </div>
                    <div className="space-y-3 text-center">
                        <DialogTitle className="text-3xl font-black italic uppercase text-white tracking-tighter">
                            Não perca o <br /><span className="text-amber-500">Timing!</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium text-base leading-relaxed">
                            Para garantir que você respeite os tempos de descanso exatos, precisamos te enviar notificações.
                            <br /><br />
                            <span className="text-zinc-300 font-bold block bg-zinc-900/50 py-2 rounded-lg border border-zinc-800">
                                Essencial para o funcionamento do app.
                            </span>
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-6">
                    <Button
                        onClick={handleRequest}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl h-14 text-sm shadow-xl transition-all active:scale-95 hover:scale-[1.02]"
                    >
                        Ativar Notificações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

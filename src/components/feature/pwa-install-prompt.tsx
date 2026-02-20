'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function PWAInstallPrompt() {
    const pathname = usePathname()
    const [showPrompt, setShowPrompt] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    // Only allow for students
    const isStudentPath = pathname?.startsWith('/dashboard/student')

    useEffect(() => {
        if (!isStudentPath) return

        // 1. Detect if already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://')

        setIsStandalone(isStandaloneMode)

        // 2. Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const ios = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(ios)

        // 3. Handle Android/Chrome Install Prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)

            // Only show if not already standalone and we haven't shown it before
            if (!isStandaloneMode && !localStorage.getItem('pwa_prompt_shown_v1')) {
                setShowPrompt(true)
            }
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // Listen for manual trigger
        const handleManualTrigger = () => {
            setShowPrompt(true)
        }
        window.addEventListener('open-pwa-prompt', handleManualTrigger)

        // 4. Special check for iOS (since there's no beforeinstallprompt)
        if (ios && !isStandaloneMode && !localStorage.getItem('pwa_prompt_shown_v1')) {
            // Show after a small delay to not annoy the user immediately
            const timer = setTimeout(() => {
                setShowPrompt(true)
            }, 3000)
            return () => clearTimeout(timer)
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('open-pwa-prompt', handleManualTrigger)
        }
    }, [isStandalone, isStudentPath])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt')
            }
            setDeferredPrompt(null)
            setShowPrompt(false)
        }
        localStorage.setItem('pwa_prompt_shown_v1', 'true')
    }

    const closePrompt = () => {
        setShowPrompt(false)
        localStorage.setItem('pwa_prompt_shown_v1', 'true')
    }

    if (!isStudentPath || isStandalone || !showPrompt) return null

    return (
        <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden rounded-[2.5rem]">
                <div className="relative p-8 space-y-8">
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Smartphone className="w-32 h-32 text-emerald-500" />
                    </div>

                    <DialogHeader className="relative z-10 text-left space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                            <Download className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tight">
                                RepTrail no seu Celular
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium text-base mt-2">
                                Experimente a melhor performance usando o RepTrail em tela cheia, como um aplicativo instalado.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 relative z-10">
                        <div className="grid gap-4">
                            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Sem Barras</p>
                                    <p className="text-xs text-zinc-500">Navegue em tela cheia sem a barra de endereço do navegador.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Acesso Rápido</p>
                                    <p className="text-xs text-zinc-500">Ícone na sua tela de início para abrir instantaneamente.</p>
                                </div>
                            </div>
                        </div>

                        {isIOS ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
                                <p className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                    Como instalar no iPhone:
                                </p>
                                <ol className="space-y-4">
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm font-bold">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                            <Share className="w-4 h-4 text-white" />
                                        </div>
                                        1. Clique no botão de Compartilhar
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm font-bold">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                            <PlusSquare className="w-4 h-4 text-white" />
                                        </div>
                                        2. Selecione "Adicionar à Tela de Início"
                                    </li>
                                </ol>
                                <Button
                                    onClick={closePrompt}
                                    className="w-full mt-6 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic"
                                >
                                    Entendi
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleInstallClick}
                                    className="h-14 rounded-2xl bg-white hover:bg-emerald-500 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl text-lg"
                                >
                                    Instalar Agora
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={closePrompt}
                                    className="h-12 text-zinc-500 hover:text-white"
                                >
                                    Agora não
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

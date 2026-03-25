'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
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
            <DialogContent className="bg-zinc-950/95 border-zinc-900 text-white max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] backdrop-blur-3xl p-0 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] gap-0 [&>button]:hidden max-h-[90dvh] flex flex-col">
                <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
                    <DialogClose asChild>
                        <Button variant="ghost" className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all backdrop-blur-md">
                            <span className="sr-only">Fechar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    </DialogClose>
                </div>

                <div className="relative p-6 pt-16 md:p-10 md:pt-20 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Smartphone className="w-48 h-48 text-emerald-500" />
                    </div>

                    <DialogHeader className="relative z-10 text-left space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/10">
                            <Download className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                RepTrail no seu <span className="text-emerald-500">Celular</span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">
                                Performance máxima em tela cheia
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-8 relative z-10">
                        <div className="grid gap-4 pb-4">
                            <div className="flex items-center gap-4 md:gap-5 p-4 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform shrink-0">
                                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider">Sem Barras</p>
                                    <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Navegação Full Screen</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 md:gap-5 p-4 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform shrink-0">
                                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider">Acesso Rápido</p>
                                    <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Atalho na Home</p>
                                </div>
                            </div>
                        </div>

                        {isIOS ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-4 md:space-y-6">
                                <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-2 md:mb-4">
                                    Configuração iOS:
                                </p>
                                <ol className="space-y-3 md:space-y-4">
                                    <li className="flex items-center gap-3 pb-4md:gap-4 text-white text-[10px] md:text-xs font-black uppercase italic tracking-widest">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shrink-0 shadow-2xl">
                                            <Share className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                                        </div>
                                        1. Clique em Compartilhar
                                    </li>
                                    <li className="flex items-center gap-3 pb-4md:gap-4 text-white text-[10px] md:text-xs font-black uppercase italic tracking-widest">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shrink-0 shadow-2xl">
                                            <PlusSquare className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                                        </div>
                                        2. "Tela de Início"
                                    </li>
                                </ol>
                                <Button
                                    onClick={closePrompt}
                                    className="w-full mt-4 md:mt-6 h-12 md:h-14 rounded-xl md:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-widest shadow-xl shadow-emerald-500/20 text-xs md:text-sm"
                                >
                                    Entendi
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={handleInstallClick}
                                    className="h-14 md:h-16 rounded-2xl md:rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-widest transition-all shadow-2xl shadow-emerald-500/30 text-base md:text-lg group"
                                >
                                    <Download className="w-5 h-5 mr-3 group-hover:bounce" />
                                    Instalar Agora
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={closePrompt}
                                    className="h-12 text-zinc-600 hover:text-white font-black uppercase italic tracking-widest text-[10px]"
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

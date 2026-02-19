'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

interface TrialWarningPopupProps {
    eliteUntil: string | null
}

export function TrialWarningPopup({ eliteUntil }: TrialWarningPopupProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!eliteUntil) return

        const expiryDate = new Date(eliteUntil)
        const now = new Date()
        const diffMs = expiryDate.getTime() - now.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        // Show popup if trial expires in less than 24 hours
        if (diffHours <= 24) {
            setIsOpen(true)
        }
    }, [eliteUntil])

    if (!isOpen) return null

    const isExpired = eliteUntil ? new Date(eliteUntil) <= new Date() : false
    const whatsappNumber = "5541998364028"
    const message = encodeURIComponent(isExpired
        ? "Olá! Meu período de teste Elite no RepTrail expirou e gostaria de falar sobre as opções de planos para continuar escalando minha consultoria."
        : "Olá! Estou usando o plano Elite do RepTrail e gostaria de falar sobre minha experiência e interesse em continuar usando a plataforma."
    )
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-[2.5rem] p-8 max-w-md w-full relative overflow-hidden shadow-2xl shadow-emerald-500/10">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-6 text-center relative z-10">
                    <div className="flex justify-center mb-2">
                        <Logo size="md" color="emerald" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-3">
                            <AlertCircle className={`w-6 h-6 ${isExpired ? 'text-red-500' : 'text-amber-500'}`} />
                            {isExpired ? 'Acesso Expirado' : 'Atenção, Coach!'}
                        </h3>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                            {isExpired ? 'Seu período de teste Elite terminou' : 'Seu período de teste está chegando ao fim'}
                        </p>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed">
                        {isExpired ? (
                            <>
                                Seu acesso ao <span className="text-emerald-500 font-black italic uppercase">Plano Elite</span> expirou.
                                Não se preocupe! Você foi movido para o <span className="text-white font-bold">Plano On Demand</span> e seus dados continuam seguros.
                            </>
                        ) : (
                            <>
                                Seu acesso ao <span className="text-emerald-500 font-black italic uppercase">Plano Elite</span> expira em menos de 24 horas.
                                Esperamos que esteja aproveitando a experiência!
                            </>
                        )}
                    </p>

                    <div className="pt-4 space-y-3">
                        <a
                            href="/dashboard/trainer/plans"
                            onClick={() => setIsOpen(false)}
                            className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95 group"
                        >
                            Ver Planos de Upgrade
                        </a>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic tracking-wide transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
                        >
                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Falar no WhatsApp
                        </a>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Continuar no On Demand
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

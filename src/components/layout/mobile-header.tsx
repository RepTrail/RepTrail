'use client'

import { useState } from 'react'
import { Menu, X, LogOut, Dumbbell, Utensils, Activity, Home, Users, Trophy, CreditCard, FileUp, Sparkles, FlaskConical, TrendingUp, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { signOutAction } from '@/actions/auth-actions'

interface MobileHeaderProps {
    role: 'student' | 'trainer'
    hasTrainer?: boolean // for students
    steroidUse?: boolean
    hideImportPdf?: boolean // for trainers
}

export function MobileHeader({ role, hasTrainer, steroidUse, hideImportPdf }: MobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const studentLinks = [
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-5 h-5" />, label: 'Meus Treinos', requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-5 h-5" />, label: 'Minha Dieta', requiresTrainer: true },
        { href: '/dashboard/student/cardio', icon: <Activity className="w-5 h-5" />, label: 'Cardio', requiresTrainer: true },
        { href: '/dashboard/student/progress', icon: <TrendingUp className="w-5 h-5" />, label: 'Minha Evolução', requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Sparkles className="w-5 h-5" />, label: 'Ergogênicos', requiresTrainer: true, showOnlyIfSteroidUse: true },
    ]

    const trainerLinks = [
        { href: '/dashboard/trainer/workouts', icon: <Dumbbell className="w-5 h-5" />, label: 'Treinos' },
        { href: '/dashboard/trainer/diets', icon: <Utensils className="w-5 h-5" />, label: 'Dietas' },
        { href: '/dashboard/trainer/cardio', icon: <Activity className="w-5 h-5" />, label: 'Cardio' },
        { href: '/dashboard/trainer/ergogenics', icon: <FlaskConical className="w-5 h-5" />, label: 'Ergogênicos' },
        ...(hideImportPdf ? [] : [{ href: '/dashboard/trainer/import-pdf', icon: <FileUp className="w-5 h-5" />, label: 'Importar PDF' }]),
        { href: '/dashboard/trainer/plans', icon: <CreditCard className="w-5 h-5" />, label: 'Planos & Assinatura' },
    ]

    const links = role === 'student'
        ? studentLinks.filter(link => {
            if (link.requiresTrainer && !hasTrainer) return false
            if (link.showOnlyIfSteroidUse && !steroidUse) return false
            return true
        })
        : trainerLinks

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 flex items-center justify-between px-6">
                <Link href="/">
                    <Logo size="sm" color={role === 'trainer' ? 'emerald' : 'orange'} />
                </Link>

                {links.length > 0 && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all active:scale-90"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
            </header>

            {/* Slide-over Menu */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Panel */}
                <div className={`absolute top-0 right-0 w-[280px] h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-transform duration-300 ease-out p-8 flex flex-col justify-between ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="space-y-10">
                        <div className="flex items-center justify-between">
                            <Link href="/">
                                <Logo size="sm" color={role === 'trainer' ? 'emerald' : 'orange'} />
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-bold uppercase italic tracking-widest text-xs"
                                >
                                    <span className={role === 'trainer' ? "text-emerald-500" : "text-orange-500"}>{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <div className="h-px bg-zinc-800" />

                        {role === 'student' && (
                            <button
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('open-pwa-prompt'))
                                    setIsOpen(false)
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all font-bold uppercase italic tracking-widest text-xs"
                            >
                                <Download className="w-5 h-5" />
                                Instalar Aplicativo
                            </button>
                        )}

                        <form action={signOutAction}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-4 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 h-14 rounded-2xl transition-all px-4"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-[10px]">Sair da Conta</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

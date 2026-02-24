'use client'

import { useState } from 'react'
import { Menu, X, LogOut, Dumbbell, Utensils, Activity, Home, Users, Trophy, CreditCard, FileUp, Sparkles, FlaskConical, TrendingUp, Download, Settings, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { signOutAction } from '@/actions/auth-actions'

interface MobileHeaderProps {
    role: 'student' | 'trainer'
    hasTrainer?: boolean // for students
    steroidUse?: boolean
    hideImportPdf?: boolean // for trainers
    autoTrainingActive?: boolean
}

export function MobileHeader({ role, hasTrainer, steroidUse, hideImportPdf, autoTrainingActive }: MobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const studentLinks = [
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-5 h-5" />, label: 'Meus Treinos', requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-5 h-5" />, label: 'Minha Dieta', requiresTrainer: true },
        { href: '/dashboard/student/cardio', icon: <Activity className="w-5 h-5" />, label: 'Cardio', requiresTrainer: true },
        { href: '/dashboard/student/import-pdf', icon: <FileUp className="w-5 h-5" />, label: 'Importar PDF', requiresTrainer: true, hideIfHasTrainer: true },
        { href: '/dashboard/student/progress', icon: <TrendingUp className="w-5 h-5" />, label: 'Minha Evolução', requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Sparkles className="w-5 h-5" />, label: 'Ergogênicos', requiresTrainer: true, showOnlyIfSteroidUse: true },
        { href: '/dashboard/student/feed', icon: <Users className="w-5 h-5" />, label: 'Feed de Alunos' },
        { href: '/dashboard/student/anamnese', icon: <ClipboardList className="w-5 h-5" />, label: 'Anamnese' },
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
            const item = link as any;
            if (item.requiresTrainer && !hasTrainer && !autoTrainingActive) return false
            if (item.showOnlyIfSteroidUse && !steroidUse) return false
            if (item.hideIfHasTrainer && hasTrainer) return false
            return true
        })
        : trainerLinks

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-20 bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-900 flex items-center justify-between px-6 gpu-accelerated" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px))' }}>
                <Link href="/" className="relative z-10">
                    <Logo size="sm" color={role === 'trainer' ? 'emerald' : 'orange'} />
                </Link>

                {links.length > 0 && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative z-10 p-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all active:scale-95 touch-manipulation"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
            </header>

            {/* Slide-over Menu - Only render if open to avoid iOS blocking issues */}
            {isOpen && (
                <div className="fixed inset-0 z-[150] animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute top-0 right-0 w-[280px] h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl animate-in slide-in-from-right duration-300 ease-out p-8 flex flex-col justify-between" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)' }}>
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <Link href="/" onClick={() => setIsOpen(false)}>
                                    <Logo size="sm" color={role === 'trainer' ? 'emerald' : 'orange'} />
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="space-y-4 flex-1 overflow-y-auto pb-4">
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

                        <div className="space-y-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                            <div className="h-px bg-zinc-800" />

                            {role === 'student' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            window.dispatchEvent(new CustomEvent('open-settings'))
                                            setIsOpen(false)
                                        }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all font-bold uppercase italic tracking-widest text-xs"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Configurações
                                    </button>

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
                                </div>
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
            )}
        </>
    )
}

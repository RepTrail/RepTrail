'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dumbbell, Utensils, Activity, User, Home, ShoppingBag, Trophy, Search, UserCheck, Sparkles, LogOut, TrendingUp, ClipboardList, Settings, Syringe } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'

import { SmartLink } from '@/components/shared/smart-link'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

interface StudentNavProps {
    hasTrainer: boolean
    steroidUse?: boolean
    autoTrainingActive?: boolean
    userId: string
}

export function StudentNav({ hasTrainer, steroidUse, autoTrainingActive = false, userId }: StudentNavProps) {
    const pathname = usePathname()

    const allLinks = [
        { href: '/dashboard/student', icon: <Home className="w-4 h-4" />, label: 'Home', requiresTrainer: false },
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-4 h-4" />, label: 'Meus Treinos', requiresTrainer: true },
        { href: '/dashboard/student/cardio', icon: <Activity className="w-4 h-4" />, label: 'Cardio', requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-4 h-4" />, label: 'Minha Dieta', requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Syringe className="w-4 h-4" />, label: 'Ergogênicos', requiresTrainer: true, showOnlyIfSteroidUse: true },
        { href: '/dashboard/student/progress', icon: <TrendingUp className="w-4 h-4" />, label: 'Evolução', requiresTrainer: true },
        { href: '/dashboard/student/import-pdf', icon: <Sparkles className="w-4 h-4" />, label: 'Importar PDF', requiresTrainer: false, hideIfHasTrainer: true },
        { href: '/dashboard/student/anamnese', icon: <ClipboardList className="w-4 h-4" />, label: 'Anamnese', requiresTrainer: true, showOnlyIfHasTrainer: true },
        { href: '/dashboard/student/buscar-personal', icon: <Search className="w-4 h-4" />, label: 'Buscar Personal', requiresTrainer: false, hideIfHasTrainer: true },
        { href: '/dashboard/student/feed', icon: <UserCheck className="w-4 h-4" />, label: 'Feed de Alunos', requiresTrainer: false },
        { href: '/dashboard/student/ranking', icon: <Trophy className="w-4 h-4" />, label: 'Ranking', requiresTrainer: false },
        { href: '/dashboard/student/loja', icon: <ShoppingBag className="w-4 h-4" />, label: 'Loja', requiresTrainer: false },
        { href: '/dashboard/student/meu-personal', icon: <UserCheck className="w-4 h-4" />, label: 'Meu Personal', requiresTrainer: true, showOnlyIfHasTrainer: true },
        { href: '/dashboard/student/profile', icon: <User className="w-4 h-4" />, label: 'Meu Perfil', requiresTrainer: false },
    ]

    const links = allLinks.filter(link => {
        const item = link as any
        if (item.hideIfHasTrainer && hasTrainer) return false
        if (item.showOnlyIfHasTrainer && !hasTrainer) return false
        if (item.showOnlyIfSteroidUse && !steroidUse) return false
        // Hide "Buscar Personal" when auto-training is active
        if (item.href === '/dashboard/student/buscar-personal' && autoTrainingActive) return false
        return !item.requiresTrainer || hasTrainer || autoTrainingActive
    })

    return (
        <nav className="space-y-1.5">
            {links.map((link) => {
                const isActive = pathname === link.href
                const prefetchConfigs = PREFETCH_REGISTRY[link.href]?.(userId) || []

                return (
                    <SmartLink
                        key={link.href}
                        href={link.href}
                        prefetch={true}
                        prefetchConfigs={prefetchConfigs}
                        className={`
                            flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-orange-500/10 border-orange-500/30 text-white border-2'
                                : 'text-zinc-500 hover:bg-zinc-800 hover:text-white border-2 border-transparent hover:border-zinc-700'}
                        `}
                    >
                        <div className={`transition-all duration-300 ${isActive ? 'scale-110 text-orange-500' : 'group-hover:scale-110'}`}>
                            {link.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{link.label}</span>
                    </SmartLink>
                )
            })}

            <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group text-zinc-500 hover:bg-zinc-800 hover:text-white border border-transparent hover:border-zinc-700 w-full"
            >
                <div className="transition-all duration-300 group-hover:scale-110">
                    <Settings className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configurações</span>
            </button>
        </nav>
    )
}

export function MobileStudentNav({ hasTrainer, steroidUse, autoTrainingActive = false, userId }: StudentNavProps) {
    const pathname = usePathname()

    // Mobile: Home, Loja, Ranking, Encontre/Meu Personal, Perfil, Logout
    return (
        <nav
            className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 p-1.5 rounded-2xl flex items-center justify-around shadow-2xl gap-1 gpu-accelerated touch-manipulation"
            style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0px))' }}
        >
            <SmartLink
                href="/dashboard/student"
                prefetch={true}
                prefetchConfigs={PREFETCH_REGISTRY['/dashboard/student']?.(userId) || []}
                className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Home className="w-5 h-5" />
            </SmartLink>
            <SmartLink
                href="/dashboard/student/loja"
                prefetch={true}
                prefetchConfigs={PREFETCH_REGISTRY['/dashboard/student/loja']?.(userId) || []}
                className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student/loja' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <ShoppingBag className="w-5 h-5" />
            </SmartLink>
            <SmartLink
                href="/dashboard/student/ranking"
                prefetch={true}
                prefetchConfigs={PREFETCH_REGISTRY['/dashboard/student/ranking']?.(userId) || []}
                className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student/ranking' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Trophy className="w-5 h-5" />
            </SmartLink>
            {hasTrainer ? (
                <SmartLink
                    href="/dashboard/student/meu-personal"
                    prefetch={true}
                    prefetchConfigs={PREFETCH_REGISTRY['/dashboard/student/meu-personal']?.(userId) || []}
                    className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student/meu-personal' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <UserCheck className="w-5 h-5" />
                </SmartLink>
            ) : !autoTrainingActive ? (
                <SmartLink
                    href="/dashboard/student/buscar-personal"
                    prefetch={true}
                    className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student/buscar-personal' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Search className="w-5 h-5" />
                </SmartLink>
            ) : null}
            <SmartLink
                href="/dashboard/student/profile"
                prefetch={true}
                prefetchConfigs={PREFETCH_REGISTRY['/dashboard/student/profile']?.(userId) || []}
                className={`z-10 relative p-2.5 rounded-xl transition-all ${pathname === '/dashboard/student/profile' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <User className="w-5 h-5" />
            </SmartLink>
            <form action={signOutAction} className="flex">
                <button
                    type="submit"
                    className="p-2.5 rounded-xl transition-all text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                    aria-label="Sair da conta"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </form>
        </nav>
    )
}

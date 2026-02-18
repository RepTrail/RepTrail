'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dumbbell, Utensils, Activity, User, Home, ShoppingBag, Trophy, Search, UserCheck, Sparkles } from 'lucide-react'

interface StudentNavProps {
    hasTrainer: boolean
    steroidUse?: boolean
}

export function StudentNav({ hasTrainer, steroidUse }: StudentNavProps) {
    const pathname = usePathname()

    const allLinks = [
        { href: '/dashboard/student', icon: <Home className="w-4 h-4" />, label: 'Home', requiresTrainer: false },
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-4 h-4" />, label: 'Meus Treinos', requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-4 h-4" />, label: 'Minha Dieta', requiresTrainer: true },
        { href: '/dashboard/student/cardio', icon: <Activity className="w-4 h-4" />, label: 'Cardio', requiresTrainer: true },
        { href: '/dashboard/student/progress', icon: <Activity className="w-4 h-4" />, label: 'Evolução', requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Sparkles className="w-4 h-4" />, label: 'Ergogênicos', requiresTrainer: true, showOnlyIfSteroidUse: true },
        { href: '/dashboard/student/loja', icon: <ShoppingBag className="w-4 h-4" />, label: 'Loja', requiresTrainer: false },
        { href: '/dashboard/student/ranking', icon: <Trophy className="w-4 h-4" />, label: 'Ranking', requiresTrainer: false },
        { href: '/buscar-personal', icon: <Search className="w-4 h-4" />, label: 'Buscar Personal', requiresTrainer: false, hideIfHasTrainer: true },
        { href: '/dashboard/student/meu-personal', icon: <UserCheck className="w-4 h-4" />, label: 'Meu Personal', requiresTrainer: true, showOnlyIfHasTrainer: true },
        { href: '/dashboard/student/profile', icon: <User className="w-4 h-4" />, label: 'Meu Perfil', requiresTrainer: false },
    ]

    const links = allLinks.filter(link => {
        const item = link as any
        if (item.hideIfHasTrainer && hasTrainer) return false
        if (item.showOnlyIfHasTrainer && !hasTrainer) return false
        if (item.showOnlyIfSteroidUse && !steroidUse) return false
        return !item.requiresTrainer || hasTrainer
    })

    return (
        <nav className="space-y-1.5">
            {links.map((link) => {
                const isActive = pathname === link.href

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-zinc-900 text-emerald-500 border border-zinc-800 shadow-xl'
                                : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 border border-transparent hover:border-zinc-800/50'}
                        `}
                    >
                        <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'group-hover:scale-110'}`}>
                            {link.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{link.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export function MobileStudentNav({ hasTrainer, steroidUse }: StudentNavProps) {
    const pathname = usePathname()

    const allLinks = [
        { href: '/dashboard/student', icon: <Home className="w-5 h-5" />, requiresTrainer: false },
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-5 h-5" />, requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-5 h-5" />, requiresTrainer: true },
        { href: '/dashboard/student/progress', icon: <Activity className="w-5 h-5" />, requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Sparkles className="w-5 h-5" />, requiresTrainer: true, showOnlyIfSteroidUse: true },
    ]

    const links = allLinks.filter(link => {
        const item = link as any
        if (item.showOnlyIfSteroidUse && !steroidUse) return false
        return !item.requiresTrainer || hasTrainer
    })

    return (
        <nav className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 p-2 rounded-2xl flex items-center justify-around shadow-2xl">
            {links.map((link) => {
                const isActive = pathname === link.href

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`p-3 rounded-xl transition-all ${isActive ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {link.icon}
                    </Link>
                )
            })}
        </nav>
    )
}

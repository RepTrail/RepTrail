'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TrainerNavLinkProps {
    href: string
    icon: React.ReactNode
    children: React.ReactNode
    exact?: boolean
}

export function TrainerNavLink({ href, icon, children, exact = false }: TrainerNavLinkProps) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 pb-4 px-5 py-3.5 rounded-xl transition-all duration-300 group border-2',
                isActive
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_8px_32px_rgba(16,185,129,0.1)]'
                    : 'text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 hover:shadow-xl'
            )}
        >
            <span className={cn(
                'transition-all duration-300',
                isActive
                    ? 'text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : 'group-hover:scale-110 group-hover:text-white'
            )}>
                {icon}
            </span>
            <span className="font-medium text-sm">{children}</span>
        </Link>
    )
}

interface TrainerMobileNavLinkProps {
    href: string
    icon: React.ReactNode
    exact?: boolean
}

export function TrainerMobileNavLink({ href, icon, exact = false }: TrainerMobileNavLinkProps) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center justify-center p-3 rounded-xl transition-all duration-300',
                isActive
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            )}
        >
            {icon}
        </Link>
    )
}

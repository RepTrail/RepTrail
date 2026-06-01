import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { Icon } from './icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface BaseBottomNavLinkProps {
  icon: LucideIcon
  active?: boolean
  onClick?: () => void
  href?: string
  variant?: 'orange' | 'emerald' | 'red' | 'amber' | 'blue' | 'zinc'
}

export function BaseBottomNavLink({
  icon,
  active,
  onClick,
  href,
  variant = 'orange'
}: BaseBottomNavLinkProps) {
  const activeClasses = {
    orange:  'bg-orange-500/10 text-orange-500 border-orange-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    red:     'bg-red-500/10 text-red-500 border-red-500/20',
    amber:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue:    'bg-blue-500/10 text-blue-500 border-blue-500/20',
    zinc:    'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  }

  const classes = cn(
    "inline-flex items-center justify-center transition-all active:scale-90 w-11 h-11 border-2 group",
    STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
    active 
      ? cn(activeClasses[variant], "shadow-lg shadow-black/20")
      : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
  )

  const content = (
    <div className={cn(
        "transition-all duration-300",
        active && "scale-110"
    )}>
        <Icon
            icon={icon}
            size="sm"
            color={(active ? variant : STORE_TOKENS.COLORS.WHITE) as any}
            opacity={active ? 100 : 40}
        />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes} type="button">
      {content}
    </button>
  )
}

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from './icon'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface BaseSidebarLinkProps {
  id?: string
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  href?: string
  variant?: 'orange' | 'emerald' | 'red' | 'amber' | 'blue'
}

export function BaseSidebarLink({
  id,
  icon,
  label,
  active,
  onClick,
  href,
  variant = 'orange'
}: BaseSidebarLinkProps) {
  const content = (
    <>
      <div className={cn(
        "transition-all duration-300 scale-110",
        active ? (
          variant === 'orange' ? 'text-orange-500' :
            variant === 'emerald' ? 'text-emerald-500' :
              variant === 'red' ? 'text-red-500' :
                variant === 'amber' ? 'text-amber-500' :
                  'text-blue-500'
        ) : "text-zinc-600 group-hover:text-zinc-400"
      )}>
        <Icon
          icon={icon}
          size="sm"
          color={active ? variant : STORE_TOKENS.COLORS.TEXT.DIM}
          groupHoverColor="current"
          transition
        />
      </div>
      <span>{label}</span>
    </>
  )

  const classes = cn(
    "w-full flex items-center gap-4 px-5 py-3.5 transition-all duration-300 group border-2 overflow-hidden",
    STORE_TOKENS.RADIUS.FULL === 'full' ? 'rounded-full' : 'rounded-[5px]',
    "text-[10px] font-black uppercase tracking-[0.2em] italic",
    active ? (
      variant === 'orange' ? 'bg-orange-500/5 border-orange-500/20 text-orange-500' :
        variant === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
          variant === 'red' ? 'bg-red-500/5 border-red-500/20 text-red-500' :
            variant === 'amber' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' :
              'bg-blue-500/5 border-blue-500/20 text-blue-500'
    ) : (
      "bg-zinc-900/20 border-white/5 text-zinc-600 hover:bg-zinc-900/40 hover:border-white/10 hover:text-zinc-300"
    )
  )

  if (href) {
    return (
      <Link id={id} href={href} className={classes} role="button">
        {content}
      </Link>
    )
  }

  return (
    <button
      id={id}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  )
}

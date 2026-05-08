import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'white' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'outline' | 'ghost' | 'zinc' | 'outline-orange' | 'outline-emerald' | 'outline-blue' | 'outline-red' | 'outline-amber' | 'close'
  fullWidth?: boolean
  isLoading?: boolean
  isIconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  padding?: 0 | 2.5 | 5
  flex1?: boolean
  shrink0?: boolean
  mdFullWidth?: boolean
  height?: 10 | 12 | 16 | 'full'
}

export function Button({
  children,
  variant = 'white',
  fullWidth = false,
  mdFullWidth,
  isLoading = false,
  isIconOnly = false,
  rounded = 'system',
  size = 'md',
  padding = 2.5,
  flex1 = false,
  shrink0 = false,
  height,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base structure
        'flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        !isIconOnly && size === 'md' && 'font-black uppercase italic tracking-widest text-[10px]',
        !isIconOnly && size === 'sm' && 'font-black uppercase italic tracking-widest text-[8px]',
        !isIconOnly && size === 'lg' && 'font-black uppercase italic tracking-widest text-xs',
        isIconOnly && 'aspect-square',

        // Padding Governance (Rule 16 & User Directive)
        padding === 5 && 'p-5',
        padding === 2.5 && size === 'md' && 'p-2.5',
        padding === 2.5 && size === 'sm' && 'px-3 py-1.5',
        padding === 2.5 && size === 'lg' && 'px-6 py-3',
        padding === 0 && 'p-0',

        // Radius
        (rounded === 'system' || rounded === 'sm') && 'rounded-[5px]',
        rounded === 'full' && 'rounded-full',
        rounded === 'none' && 'rounded-none',

        fullWidth && 'w-full',
        mdFullWidth === true && 'md:w-full',
        mdFullWidth === false && 'md:w-auto',
        shrink0 && 'shrink-0',

        // Variants
        variant === 'white' && 'bg-white hover:bg-zinc-200 text-zinc-950',
        variant === 'orange' && 'bg-orange-500 hover:bg-orange-400 text-zinc-950',
        variant === 'emerald' && 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
        variant === 'amber' && 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
        variant === 'red' && 'bg-red-500 hover:bg-red-400 text-white',
        variant === 'blue' && 'bg-blue-500 hover:bg-blue-400 text-white',
        variant === 'outline' && 'border-2 border-zinc-800 text-white hover:bg-white/5',
        variant === 'ghost' && 'text-zinc-500 hover:text-white hover:bg-white/5',
        variant === 'zinc' && 'bg-zinc-900/40 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white',
        variant === 'outline-orange' && 'border-2 border-orange-500/30 text-orange-500 bg-orange-500/20 hover:bg-orange-500/30',
        variant === 'outline-emerald' && 'border-2 border-emerald-500/30 text-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30',
        variant === 'outline-blue' && 'border-2 border-blue-500/30 text-blue-500 bg-blue-500/20 hover:bg-blue-500/30',
        variant === 'outline-red' && 'border-2 border-red-500/30 text-red-500 bg-red-500/20 hover:bg-red-500/30',
        flex1 && 'flex-1',
        variant === 'outline-amber' && 'border-2 border-amber-500/30 text-amber-500 bg-amber-500/20 hover:bg-amber-500/30',
        variant === 'close' && 'bg-zinc-950/40 text-zinc-500 hover:text-white hover:bg-zinc-900 border border-white/5',

        className
      )}
      {...props}
    >
      {isLoading ? (
        <Box className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'white' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'outline' | 'ghost' | 'zinc' | 'outline-orange' | 'outline-emerald' | 'outline-blue' | 'outline-red' | 'outline-amber' | 'close'
  fullWidth?: boolean
  isLoading?: boolean
  isIconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  flex1?: boolean
  shrink0?: boolean
  mdFullWidth?: boolean
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
  flex1 = false,
  shrink0 = false,
  className, 
  ...props 
}: ButtonProps) {
  
  const sizes = {
    sm: cn(
      'h-8 px-3',
      !isIconOnly && 'font-black uppercase italic tracking-widest text-[8px]'
    ),
    md: cn(
      'h-12 px-5',
      !isIconOnly && 'font-black uppercase italic tracking-widest text-[10px]'
    ),
    lg: cn(
      'h-14 px-8',
      !isIconOnly && 'font-black uppercase italic tracking-widest text-xs'
    )
  }

  const radii = {
    system: 'rounded-[5px]',
    sm: 'rounded-[5px]',
    full: 'rounded-full',
    none: 'rounded-none'
  }

  const variants = {
    white: 'bg-white hover:bg-zinc-200 text-zinc-950',
    orange: 'bg-orange-500 hover:bg-orange-400 text-zinc-950',
    emerald: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    amber: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
    red: 'bg-red-500 hover:bg-red-400 text-white',
    blue: 'bg-blue-500 hover:bg-blue-400 text-white',
    outline: 'border-2 border-zinc-800 text-white hover:bg-white/5',
    ghost: 'text-zinc-500 hover:text-white hover:bg-white/5',
    zinc: 'bg-zinc-900/40 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white',
    'outline-orange': 'border-2 border-orange-500/30 text-orange-500 bg-orange-500/20 hover:bg-orange-500/30',
    'outline-emerald': 'border-2 border-emerald-500/30 text-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30',
    'outline-blue': 'border-2 border-blue-500/30 text-blue-500 bg-blue-500/20 hover:bg-blue-500/30',
    'outline-red': 'border-2 border-red-500/30 text-red-500 bg-red-500/20 hover:bg-red-500/30',
    'outline-amber': 'border-2 border-amber-500/30 text-amber-500 bg-amber-500/20 hover:bg-amber-500/30',
    close: 'bg-zinc-950/40 text-zinc-500 hover:text-white hover:bg-zinc-900 border border-white/5'
  }

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        sizes[size],
        isIconOnly && 'aspect-square px-0',
        radii[rounded],
        fullWidth && 'w-full',
        mdFullWidth === true && 'md:w-full',
        mdFullWidth === false && 'md:w-auto',
        shrink0 && 'shrink-0',
        flex1 && 'flex-1',
        variants[variant],
        className 
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

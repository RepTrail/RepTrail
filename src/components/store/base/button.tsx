import React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 
  | 'orange' 
  | 'emerald' 
  | 'amber' 
  | 'red' 
  | 'blue' 
  | 'indigo'
  | 'zinc' 
  | 'white' 
  | 'ghost' 
  | 'close'
  | 'outline-orange'
  | 'outline-emerald'
  | 'outline-amber'
  | 'outline-red'
  | 'outline-blue'
  | 'outline-indigo'
  | 'outline-zinc'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  fullWidth?: boolean
  isIconOnly?: boolean
  flex1?: boolean
  shrink?: number
  direction?: 'row' | 'col'
  gap?: 0 | 1 | 2.5 | 5
  height?: 'auto' | 'full'
  paddingY?: number
  textColor?: 'white' | 'black' | 'zinc'
}

/**
 * Button: A powerful action primitive with built-in design system tokens.
 */
export function Button({
  children,
  variant = 'zinc',
  size = 'md',
  rounded = 'system',
  fullWidth = false,
  isIconOnly = false,
  flex1 = false,
  shrink,
  direction = 'row',
  gap,
  height,
  paddingY,
  textColor,
  className,
  ...props
}: ButtonProps) {
  
  const variantClasses = {
    orange: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20',
    emerald: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20',
    amber: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20',
    red: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    blue: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20',
    zinc: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5',
    white: 'bg-white text-black hover:bg-zinc-100',
    ghost: 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white',
    close: 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-white/5',
    
    'outline-orange': 'bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20',
    'outline-emerald': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20',
    'outline-amber': 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20',
    'outline-red': 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    'outline-blue': 'bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20',
    'outline-indigo': 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20',
    'outline-zinc': 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10',
  }

  const sizeClasses = {
    xs: isIconOnly ? 'p-1' : 'px-2 py-1 text-[10px]',
    sm: isIconOnly ? 'p-2' : 'px-3 py-1.5 text-xs',
    md: isIconOnly ? 'p-2.5' : 'px-4 py-2 text-sm',
    lg: isIconOnly ? 'p-4' : 'px-6 py-3 text-base',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-[3px]',
    system: 'rounded-[5px]',
    full: 'rounded-full',
  }

  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2.5: 'gap-2.5',
    5: 'gap-5'
  }

  const textColorClasses = {
    white: '!text-white',
    black: '!text-black',
    zinc: '!text-zinc-500'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase italic tracking-wider',
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        fullWidth ? 'w-full' : '',
        flex1 ? 'flex-1' : '',
        shrink !== undefined && `shrink-${shrink}`,
        direction === 'col' ? 'flex-col' : 'flex-row',
        gap !== undefined && gapClasses[gap as keyof typeof gapClasses],
        height === 'auto' ? 'h-auto' : height === 'full' ? 'h-full' : '',
        paddingY !== undefined && `py-${paddingY}`,
        textColor && textColorClasses[textColor],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

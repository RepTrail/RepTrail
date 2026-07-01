'use client'
import React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'

export type ButtonVariant = 
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
  | 'primary'
  | 'outline-primary'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  children?: React.ReactNode
  text?: React.ReactNode
  iconLeft?: any
  iconRight?: any
  variant?: ButtonVariant
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  fullWidth?: boolean | { base: boolean, sm?: boolean, md?: boolean, lg?: boolean }
  isIconOnly?: boolean
  flex1?: boolean | { base: boolean, sm?: boolean, md?: boolean, lg?: boolean }
  hoverScale?: 110 | 105
  activeScale?: 95 | 90
  transition?: boolean
  cursor?: 'pointer' | 'default' | 'not-allowed'
  asChild?: boolean
  loading?: boolean
  shine?: boolean
  className?: never
  style?: never
}

/**
 * Button: A powerful action primitive with built-in design system tokens.
 */
export function Button({
  children,
  text,
  iconLeft: IconLeft,
  iconRight: IconRight,
  variant = 'zinc',
  size = 'md',
  rounded = 'system',
  fullWidth = false,
  isIconOnly = false,
  flex1 = false,
  hoverScale,
  activeScale,
  transition,
  cursor,
  asChild,
  loading,
  shine,
  className,
  ...props
}: ButtonProps) {
  
  const { primaryColor } = useRegistry()
  
  if (process.env.NODE_ENV !== 'production') {
    if (asChild && !children) {
      throw new Error('Button: prop "asChild" was passed but no "children" was provided. Radix Slot requires exactly one child element.')
    }
    if (!asChild && children && typeof children !== 'string' && typeof children !== 'number') {
      console.warn('Button: Complex "children" passed without "asChild". Use "text", "iconLeft", or "iconRight" instead.')
    }
    if (isIconOnly && text) {
      console.warn('Button: "isIconOnly" is true but "text" was provided. The text will be rendered inside an icon padding and will look broken!')
    }
    if (!isIconOnly && !text && !IconLeft && !IconRight && !children && !asChild) {
      console.warn('Button: Rendered without any content (no text, icons, or children).')
    }
  }
  
  const resolvedVariant = variant === 'primary' ? primaryColor 
    : variant === 'outline-primary' ? `outline-${primaryColor}` as ButtonVariant
    : variant

  const variantClasses = {
    orange: 'bg-orange-500 text-black shadow-lg shadow-orange-500/20',
    emerald: 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20',
    amber: 'bg-amber-500 text-black shadow-lg shadow-amber-500/20',
    red: 'bg-red-500 text-black shadow-lg shadow-red-500/20',
    blue: 'bg-blue-500 text-black shadow-lg shadow-blue-500/20',
    indigo: 'bg-indigo-500 text-black shadow-lg shadow-indigo-500/20',
    zinc: 'bg-zinc-800 text-white border-2 border-white/5',
    white: 'bg-white text-black',
    ghost: 'bg-transparent text-zinc-400',
    close: 'bg-white/5 text-zinc-500 border-2 border-white/5',
    
    'outline-orange': 'bg-orange-500/10 text-orange-500 border-2 border-orange-500/20',
    'outline-emerald': 'bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20',
    'outline-amber': 'bg-amber-500/10 text-amber-500 border-2 border-amber-500/20',
    'outline-red': 'bg-red-500/10 text-red-500 border-2 border-red-500/20',
    'outline-blue': 'bg-blue-500/10 text-blue-500 border-2 border-blue-500/20',
    'outline-indigo': 'bg-indigo-500/10 text-indigo-500 border-2 border-indigo-500/20',
    'outline-zinc': 'bg-white/5 text-zinc-400 border-2 border-white/10',
  }

  const sizeClasses = {
    xs: isIconOnly ? 'p-1' : 'px-2 py-1 text-[12px]',
    sm: isIconOnly ? 'p-2' : 'px-5 py-1.5 text-[12px]',
    md: isIconOnly ? 'p-2.5' : 'px-5 py-2 text-[12px]',
    lg: isIconOnly ? 'p-4' : 'px-6 py-3 text-[12px]',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-[3px]',
    system: 'rounded-[5px]',
    full: 'rounded-full',
  }

  const Component = asChild ? Slot : 'button'

  return (
    <Component
      disabled={props.disabled || loading}
      className={cn(
        'relative overflow-hidden inline-flex flex-wrap-reverse items-center justify-center text-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase italic tracking-wider leading-tight [&_svg]:text-current [&_svg]:stroke-current [&_*]:text-current',
        variantClasses[resolvedVariant as keyof typeof variantClasses],
        sizeClasses[size],
        roundedClasses[rounded],
        typeof fullWidth === 'boolean' ? (fullWidth ? 'w-full' : '') : cn(
            fullWidth?.base && 'w-full',
            fullWidth?.sm && 'sm:w-full',
            fullWidth?.sm === false && 'sm:w-auto',
            fullWidth?.md && 'md:w-full',
            fullWidth?.md === false && 'md:w-auto',
            fullWidth?.lg && 'lg:w-full',
            fullWidth?.lg === false && 'lg:w-auto'
        ),
        flex1 && (typeof flex1 === 'boolean' ? (flex1 ? 'flex-1' : '') : cn(
            (flex1 as any)?.base && 'flex-1',
            (flex1 as any)?.md && 'md:flex-1',
            (flex1 as any)?.md === false && 'md:flex-none',
            (flex1 as any)?.lg && 'lg:flex-1',
            (flex1 as any)?.lg === false && 'lg:flex-none'
        )),
        cursor && `cursor-${cursor}`,
        hoverScale === 110 && 'hover:scale-110',
        hoverScale === 105 && 'hover:scale-105',
        activeScale === 95 && 'active:scale-95',
        activeScale === 90 && 'active:scale-90',
        transition && 'transition-all duration-300',
        className
      )}
      {...props}
    >
      {shine && (
        <div className="shine-container">
          <div className="shine-line" />
        </div>
      )}
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (text || IconLeft || IconRight) ? (
        <div 
          className={cn(
            "flex items-center justify-center gap-2.5",
            (IconLeft && IconRight) ? "flex-row flex-nowrap whitespace-nowrap" : "flex-wrap"
          )}
        >
          {IconLeft && (
            <div className="flex shrink-0">
               {typeof IconLeft === 'function' || typeof IconLeft === 'object' ? <IconLeft size={16} /> : IconLeft}
            </div>
          )}
          {text && (
            <span className="text-current font-bold uppercase italic tracking-wider leading-tight text-center">
              {text}
            </span>
          )}
          {IconRight && (
            <div className="flex shrink-0">
               {typeof IconRight === 'function' || typeof IconRight === 'object' ? <IconRight size={16} /> : IconRight}
            </div>
          )}
        </div>
      ) : null}
      <Slottable>{children}</Slottable>
    </Component>
  )
}

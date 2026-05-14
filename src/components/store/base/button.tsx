'use client'
import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/advanced/registry-context'

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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  fullWidth?: boolean | { base: boolean, sm?: boolean, md?: boolean, lg?: boolean }
  isIconOnly?: boolean
  flex1?: boolean | { base: boolean, sm?: boolean, md?: boolean, lg?: boolean }
  shrink?: number | { base: number, sm?: number, md?: number, lg?: number }
  direction?: 'row' | 'col'
  gap?: 0 | 1 | 2.5 | 5
  height?: 'auto' | 'full' | 'anatomy-item' | 'anatomy-header' | '8' | '12' | '24'
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  hoverScale?: 110 | 105
  activeScale?: 95 | 90
  transition?: boolean
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  grayscale?: boolean
  textColor?: 'white' | 'black' | 'zinc'
  bg?: 'white' | 'black' | 'zinc'
  bgOpacity?: number
  hoverBgOpacity?: number
  borderColor?: string
  cursor?: 'pointer' | 'default' | 'not-allowed'
  asChild?: boolean
  marginTop?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  loading?: boolean
  width?: number | string
  minWidth?: number | string | { base: number | string, sm?: number | string, md?: number | string, lg?: number | string }
  padding?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5
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
  paddingX,
  hoverScale,
  activeScale,
  transition,
  opacity,
  grayscale,
  textColor,
  bg,
  bgOpacity,
  hoverBgOpacity,
  borderColor,
  cursor,
  asChild,
  marginTop,
  loading,
  width,
  minWidth,
  padding,
  className,
  ...props
}: ButtonProps) {
  
  const { primaryColor } = useRegistry()
  
  const resolvedVariant = variant === 'primary' ? primaryColor 
    : variant === 'outline-primary' ? `outline-${primaryColor}` as ButtonVariant
    : variant

  const isRespMinWidth = typeof minWidth === 'object'
  const minWidthBase = isRespMinWidth ? (minWidth as any).base : minWidth
  const minWidthMd = isRespMinWidth ? (minWidth as any).md : undefined
  
  const variantClasses = {
    orange: 'bg-orange-500 text-black shadow-lg shadow-orange-500/20',
    emerald: 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20',
    amber: 'bg-amber-500 text-black shadow-lg shadow-amber-500/20',
    red: 'bg-red-500 text-black shadow-lg shadow-red-500/20',
    blue: 'bg-blue-500 text-black shadow-lg shadow-blue-500/20',
    indigo: 'bg-indigo-500 text-black shadow-lg shadow-indigo-500/20',
    zinc: 'bg-zinc-800 text-white border border-white/5',
    white: 'bg-white text-black',
    ghost: 'bg-transparent text-zinc-400',
    close: 'bg-white/5 text-zinc-500 border border-white/5',
    
    'outline-orange': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    'outline-emerald': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    'outline-amber': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    'outline-red': 'bg-red-500/10 text-red-500 border border-red-500/20',
    'outline-blue': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    'outline-indigo': 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
    'outline-zinc': 'bg-white/5 text-zinc-400 border border-white/10',
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

  const Component = asChild ? Slot : 'button'

  return (
    <Component
      disabled={props.disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase italic tracking-wider [&_*]:text-current',
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
        shrink !== undefined && (typeof shrink === 'number' ? `shrink-${shrink}` : cn(
            (shrink as any)?.base !== undefined && `shrink-${(shrink as any)?.base}`,
            (shrink as any)?.md !== undefined && `md:shrink-${(shrink as any)?.md}`,
            (shrink as any)?.lg !== undefined && `lg:shrink-${(shrink as any)?.lg}`
        )),
        direction === 'col' ? 'flex-col' : 'flex-row',
        gap !== undefined && gapClasses[gap as keyof typeof gapClasses],
        height === 'auto' ? 'h-auto' : height === 'full' ? 'h-full' : '',
        height === 'anatomy-item' && 'h-10',
        height === 'anatomy-header' && 'h-24',
        height === '8' && 'h-8',
        height === '12' && 'h-12',
        height === '24' && 'h-24',
        paddingY !== undefined && `py-${paddingY}`,
        paddingX !== undefined && `px-${paddingX}`,
        padding !== undefined && `p-${padding}`,
        cursor && `cursor-${cursor}`,
        hoverScale === 110 && 'hover:scale-110',
        hoverScale === 105 && 'hover:scale-105',
        activeScale === 95 && 'active:scale-95',
        activeScale === 90 && 'active:scale-90',
        transition && 'transition-all duration-300',
        opacity === 0 && 'opacity-0',
        opacity === 10 && 'opacity-10',
        opacity === 20 && 'opacity-20',
        opacity === 30 && 'opacity-30',
        opacity === 40 && 'opacity-40',
        opacity === 50 && 'opacity-50',
        opacity === 100 && 'opacity-100',
        grayscale && 'grayscale',
        textColor && textColorClasses[textColor],
        bg === 'white' && 'bg-white',
        bg === 'black' && 'bg-black',
        bgOpacity !== undefined && `bg-opacity-[${bgOpacity}%]`,
        hoverBgOpacity !== undefined && `hover:bg-opacity-[${hoverBgOpacity}%]`,
        borderColor === 'transparent' && 'border-transparent',
        marginTop !== undefined && `mt-${marginTop}`,
        minWidthBase && (
            minWidthBase === 'auto' ? 'min-w-auto' :
            typeof minWidthBase === 'number' ? `min-w-[${minWidthBase}px]` :
            `min-w-[${String(minWidthBase).replace(/\s+/g, '')}]`
        ),
        minWidthMd && (
            minWidthMd === 'auto' ? 'md:min-w-auto' :
            typeof minWidthMd === 'number' ? `md:min-w-[${minWidthMd}px]` :
            `md:min-w-[${String(minWidthMd).replace(/\s+/g, '')}]`
        ),
        className
      )}
      style={{
          width: typeof width === 'number' ? `${width}px` : width,
          ...props.style
      }}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : children}
    </Component>
  )
}

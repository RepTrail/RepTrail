'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'

export type FontVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'heading'
  | 'description'
  | 'body'
  | 'body-sm'
  | 'label-caps'
  | 'auxiliary'
  | 'sub-tiny'
  | 'tiny'
  | 'massive'
  | 'display'
  | 'hero'

export type FontColor = 
  | 'PRIMARY' | 'SECONDARY' | 'MUTED' | 'DIM'
  | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700'
  | 'primary' | 'success' | 'warning' | 'error' | 'white' | 'black' | 'inherit'
  | 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc'

interface FontProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color' | 'className' | 'style'> {
  children: React.ReactNode
  variant?: FontVariant | { base: FontVariant, md?: FontVariant, lg?: FontVariant }
  color?: FontColor
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black'
  align?: 'left' | 'center' | 'right' | { base: 'left' | 'center' | 'right', sm?: 'left' | 'center' | 'right', md?: 'left' | 'center' | 'right', lg?: 'left' | 'center' | 'right' }
  uppercase?: boolean
  lowercase?: boolean
  italic?: boolean
  nowrap?: boolean
  mono?: boolean
  tracking?: 'tight' | 'normal' | 'wide' | 'wider' | 'widest'
  opacity?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  lineClamp?: 1 | 2 | 3 | 4
  whitespace?: 'pre-line' | 'nowrap' | 'normal'
  transition?: boolean
  cursor?: 'pointer' | 'default' | 'not-allowed'
  truncate?: boolean
  scale?: 100 | 105 | 110 | 125 | 150
  underline?: boolean
  breakAll?: boolean
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'grid'
  flex?: 0 | 1 | 'none'
  className?: never
  style?: never
}

/**
 * Font: Central typography primitive.
 */
export function Font({
  children,
  variant = 'body',
  color,
  weight,
  align,
  uppercase,
  lowercase,
  italic,
  nowrap,
  mono,
  tracking,
  opacity,
  lineClamp,
  whitespace,
  transition,
  cursor,
  truncate,
  scale,
  underline,
  breakAll,
  display,
  flex,
  ...props
}: FontProps) {
  const { primaryColor } = useRegistry()

  const variantClasses = {
    h1: 'text-3xl md:text-5xl font-black tracking-tighter uppercase italic',
    h2: 'text-2xl md:text-4xl font-black tracking-tight uppercase italic',
    h3: 'text-xl md:text-3xl font-black tracking-tight uppercase italic',
    h4: 'text-lg md:text-2xl font-black tracking-tight uppercase italic',
    h5: 'text-base md:text-xl font-black tracking-tight uppercase italic',
    heading: 'text-xl md:text-2xl font-bold tracking-tight',
    description: 'text-base md:text-lg text-zinc-400 leading-relaxed',
    body: 'text-sm md:text-base leading-relaxed',
    'body-sm': 'text-xs md:text-sm leading-relaxed',
    'label-caps': 'text-[10px] font-black uppercase tracking-[0.2em] italic leading-tight',
    auxiliary: 'text-[11px] font-bold uppercase tracking-widest leading-tight',
    'sub-tiny': 'text-[10px] font-medium leading-tight',
    tiny: 'text-[9px] font-medium leading-tight',
    massive: 'text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]',
    display: 'text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8]',
    hero: 'text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]'
  }

  const isRespVariant = typeof variant === 'object'
  const variantBase = isRespVariant ? (variant as any).base : variant
  const variantMd = isRespVariant ? (variant as any).md : undefined
  const variantLg = isRespVariant ? (variant as any).lg : undefined

  const isRespAlign = typeof align === 'object'
  const alignBase = isRespAlign ? (align as any).base : align
  const alignMd = isRespAlign ? (align as any).md : undefined
  const alignLg = isRespAlign ? (align as any).lg : undefined

  const alignClasses = {
    left: 'text-left block w-full',
    center: 'text-center block w-full',
    right: 'text-right block w-full'
  }

  const alignMdClasses = {
    left: 'md:text-left',
    center: 'md:text-center',
    right: 'md:text-right'
  }

  const alignLgClasses = {
    left: 'lg:text-left',
    center: 'lg:text-center',
    right: 'lg:text-right'
  }

  const colorClasses = {
    PRIMARY: 'text-white',
    SECONDARY: 'text-zinc-400',
    MUTED: 'text-zinc-500',
    DIM: 'text-zinc-600',
    'zinc-400': 'text-zinc-400',
    'zinc-500': 'text-zinc-500',
    'zinc-600': 'text-zinc-600',
    'zinc-700': 'text-zinc-700',
    primary: `text-${primaryColor}-500`,
    white: 'text-white',
    black: 'text-black',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    inherit: 'text-inherit',
    orange: 'text-orange-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    zinc: 'text-zinc-500'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black'
  }

  const opacityClasses = {
    10: 'opacity-10',
    20: 'opacity-20',
    30: 'opacity-30',
    40: 'opacity-40',
    50: 'opacity-50',
    60: 'opacity-60',
    70: 'opacity-70',
    80: 'opacity-80',
    90: 'opacity-90',
    100: 'opacity-100'
  }

  return (
    <span
      className={cn(
        variantBase && variantClasses[variantBase as keyof typeof variantClasses],
        variantMd && `md:${variantClasses[variantMd as keyof typeof variantClasses]}`,
        variantLg && `lg:${variantClasses[variantLg as keyof typeof variantClasses]}`,
        color && colorClasses[color as keyof typeof colorClasses],
        weight && weightClasses[weight],
        alignBase && alignClasses[alignBase as keyof typeof alignClasses],
        alignMd && alignMdClasses[alignMd as keyof typeof alignMdClasses],
        alignLg && alignLgClasses[alignLg as keyof typeof alignLgClasses],
        uppercase && 'uppercase',
        lowercase && 'lowercase',
        italic && 'italic',
        nowrap && 'whitespace-nowrap',
        mono && 'font-mono',
        tracking && `tracking-${tracking}`,
        opacity !== undefined && opacityClasses[opacity as keyof typeof opacityClasses],
        lineClamp && 'overflow-hidden',
        whitespace === 'pre-line' && 'whitespace-pre-line',
        whitespace === 'nowrap' && 'whitespace-nowrap',
        transition && 'transition-opacity duration-300',
        cursor && `cursor-${cursor}`,
        truncate && 'truncate',
        scale && `scale-${scale} inline-block`,
        underline && 'underline',
        breakAll && 'break-all',
        display === 'block' && 'block',
        display === 'inline-block' && 'inline-block',
        display === 'inline' && 'inline',
        display === 'flex' && 'flex',
        display === 'grid' && 'grid',
        flex === 1 && 'flex-1',
        flex === 0 && 'flex-none',
        flex === 'none' && 'flex-none',
        props.className
      )}
      style={{
        ...(lineClamp ? {
          display: '-webkit-box',
          WebkitLineClamp: lineClamp,
          WebkitBoxOrient: 'vertical',
        } : {})
      }}
      {...props}
    >
      {children}
    </span>
  )
}

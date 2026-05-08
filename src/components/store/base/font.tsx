import React from 'react'
import { cn } from '@/lib/utils'

interface FontProps {
  children: React.ReactNode
  variant?: 'heading' | 'h1' | 'h2' | 'body' | 'body-sm' | 'description' | 'auxiliary' | 'label-caps' | 'sub-tiny'
  color?: 'foreground' | 'muted' | 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'zinc-800' | 'black' | 'white' | 'inherit' | 'brand-accent' | 'zinc'
  italic?: boolean
  uppercase?: boolean
  underline?: boolean
  weight?: 'normal' | 'medium' | 'bold' | 'black'
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest'
  leading?: 'none' | 'tight' | 'relaxed'
  align?: 'left' | 'center' | 'right' | 'justify'
  rotate?: 90 | -90
  scale?: 75 | 50 | 40
  nowrap?: boolean
  inlineBlock?: boolean
  truncate?: boolean
  breakAll?: boolean
  mono?: boolean
  paddingLeft?: 1 | 2 | 4 | 5 | 6 | 8
  className?: string // Internal use only
}

export function Font({ 
  children, 
  variant = 'body', 
  color = 'inherit',
  italic = false,
  uppercase = false,
  underline = false,
  weight,
  tracking = 'normal',
  leading,
  align = 'left',
  rotate,
  scale,
  nowrap,
  inlineBlock,
  truncate,
  breakAll,
  mono,
  paddingLeft,
  className
}: FontProps) {
  // Internal mappings to consolidate logic and improve atomic predictability
  const variantMap = {
    heading: 'text-xl md:text-3xl font-black uppercase italic tracking-tighter',
    h1: 'text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-none',
    h2: 'text-2xl md:text-4xl font-black italic uppercase tracking-tight',
    body: 'text-sm md:text-lg font-medium leading-relaxed',
    'body-sm': 'text-sm font-medium leading-normal',
    description: 'text-xl text-zinc-400',
    auxiliary: 'text-[10px] font-black uppercase tracking-widest',
    'label-caps': 'text-xs font-black uppercase tracking-[0.2em]',
    'sub-tiny': 'text-[8px] uppercase tracking-widest'
  }

  const colorMap = {
    foreground: 'text-foreground',
    muted: 'text-zinc-500',
    orange: 'text-orange-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    'zinc-400': 'text-zinc-400',
    'zinc-500': 'text-zinc-500',
    'zinc-600': 'text-zinc-600',
    'zinc-700': 'text-zinc-700',
    'zinc-800': 'text-zinc-800',
    zinc: 'text-zinc-500',
    black: 'text-black',
    white: 'text-white',
    'brand-accent': 'text-orange-500',
    inherit: 'text-inherit'
  }

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
    black: 'font-black'
  }

  const trackingMap = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    widest: 'tracking-widest'
  }

  return (
    <span className={cn(
      variantMap[variant],
      colorMap[color],

      // Alignment
      align === 'left' && 'text-left',
      align === 'center' && 'text-center block w-full',
      align === 'right' && 'text-right block w-full',
      align === 'justify' && 'text-justify block w-full',

      // Modifiers
      italic && 'italic',
      uppercase && 'uppercase',
      underline && 'underline',
      
      weight && weightMap[weight],
      tracking !== 'normal' && trackingMap[tracking],

      leading === 'none' && 'leading-none',
      leading === 'tight' && 'leading-tight',
      leading === 'relaxed' && 'leading-relaxed',

      // Transformations
      rotate === 90 && 'rotate-90',
      rotate === -90 && '-rotate-90',
      scale === 75 && 'scale-75',
      scale === 50 && 'scale-50',
      scale === 40 && 'scale-[0.4]',
      
      nowrap && 'whitespace-nowrap',
      inlineBlock && 'inline-block',
      truncate && 'truncate',
      breakAll && 'break-all',
      mono && 'font-mono',

      paddingLeft === 1 && 'pl-1',
      paddingLeft === 2 && 'pl-2',
      paddingLeft === 4 && 'pl-4',
      paddingLeft === 5 && 'pl-5',
      paddingLeft === 6 && 'pl-6',
      paddingLeft === 8 && 'pl-8',

      className
    )}>
      {children}
    </span>
  )
}

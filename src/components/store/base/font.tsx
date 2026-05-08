import React from 'react'
import { cn } from '@/lib/utils'

export type FontVariant = 
  | 'h1' 
  | 'h2' 
  | 'heading' 
  | 'description' 
  | 'body' 
  | 'body-sm' 
  | 'label-caps' 
  | 'auxiliary' 
  | 'sub-tiny'

interface FontProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: FontVariant
  color?: 'white' | 'zinc' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'black'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black'
  align?: 'left' | 'center' | 'right'
  uppercase?: boolean
  italic?: boolean
  nowrap?: boolean
  mono?: boolean
  tracking?: 'tight' | 'normal' | 'wide' | 'widest'
  scale?: 50 | 75 | 100 | 110 | 125 | 150
  rotate?: 90 | 180 | 270
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  groupHoverOpacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  transition?: boolean
  className?: string
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
  italic,
  nowrap,
  mono,
  tracking,
  scale,
  rotate,
  maxWidth,
  opacity,
  groupHoverOpacity,
  transition,
  className,
  ...props
}: FontProps) {
  
  const variantClasses = {
    h1: 'text-3xl md:text-5xl font-black tracking-tighter uppercase italic',
    h2: 'text-2xl md:text-4xl font-black tracking-tight uppercase italic',
    heading: 'text-xl md:text-2xl font-bold tracking-tight',
    description: 'text-base md:text-lg text-zinc-400 leading-relaxed',
    body: 'text-sm md:text-base leading-relaxed',
    'body-sm': 'text-xs md:text-sm leading-relaxed',
    'label-caps': 'text-[10px] font-black uppercase tracking-[0.2em] italic',
    auxiliary: 'text-[11px] font-bold uppercase tracking-widest',
    'sub-tiny': 'text-[10px] font-medium leading-none'
  }

  const colorClasses = {
    white: 'text-white',
    zinc: 'text-zinc-500',
    'zinc-400': 'text-zinc-400',
    'zinc-500': 'text-zinc-500',
    'zinc-600': 'text-zinc-600',
    'zinc-700': 'text-zinc-700',
    orange: 'text-orange-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    black: 'text-black'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black'
  }

  const rotateClasses = {
    90: 'rotate-90',
    180: 'rotate-180',
    270: 'rotate-270'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    none: 'max-w-none'
  }

  const opacityClasses = {
    0: 'opacity-0',
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

  const groupHoverOpacityClasses = {
    0: 'group-hover:opacity-0',
    10: 'group-hover:opacity-10',
    20: 'group-hover:opacity-20',
    30: 'group-hover:opacity-30',
    40: 'group-hover:opacity-40',
    50: 'group-hover:opacity-50',
    60: 'group-hover:opacity-60',
    70: 'group-hover:opacity-70',
    80: 'group-hover:opacity-80',
    90: 'group-hover:opacity-90',
    100: 'group-hover:opacity-100'
  }

  return (
    <span
      className={cn(
        variantClasses[variant],
        color && colorClasses[color],
        weight && weightClasses[weight],
        align && `text-${align}`,
        uppercase && 'uppercase',
        italic && 'italic',
        nowrap && 'whitespace-nowrap',
        mono && 'font-mono',
        tracking && `tracking-${tracking}`,
        scale && {
          50: 'scale-50',
          75: 'scale-75',
          100: 'scale-100',
          110: 'scale-110',
          125: 'scale-125',
          150: 'scale-150'
        }[scale],
        rotate && rotateClasses[rotate],
        maxWidth && maxWidthClasses[maxWidth],
        opacity !== undefined && opacityClasses[opacity],
        groupHoverOpacity !== undefined && groupHoverOpacityClasses[groupHoverOpacity],
        transition && 'transition-opacity duration-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps {
  icon: LucideIcon
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'foreground' | 'muted' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'white' | 'black' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'zinc-800'
  className?: string
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  color,
  className
}: IconProps) {
  return (
    <IconComponent
      className={cn(
        className,
        // Sizes
        size === 'xs' && 'w-3 h-3',
        size === 'sm' && 'w-4 h-4',
        size === 'md' && 'w-5 h-5',
        size === 'lg' && 'w-6 h-6',
        size === 'xl' && 'w-8 h-8',

        // Colors
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-zinc-500',
        color === 'orange' && 'text-orange-500',
        color === 'emerald' && 'text-emerald-500',
        color === 'red' && 'text-red-500',
        color === 'blue' && 'text-blue-500',
        color === 'amber' && 'text-amber-500',
        color === 'zinc-400' && 'text-zinc-400',
        color === 'zinc-500' && 'text-zinc-500',
        color === 'zinc-600' && 'text-zinc-600',
        color === 'zinc-700' && 'text-zinc-700',
        color === 'zinc-800' && 'text-zinc-800',
        color === 'black' && 'text-black',
        color === 'white' && 'text-white'
      )}
    />
  )
}

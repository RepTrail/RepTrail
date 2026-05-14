import React from 'react'
import { cn } from '@/lib/utils'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

type SwatchColor = 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'white'
type SwatchOpacity = 10 | 20 | 30 | 50 | 100
type SwatchSize = 'sm' | 'md' | 'lg' | 'full'

interface SwatchProps {
  color: SwatchColor
  opacity?: SwatchOpacity
  size?: SwatchSize
  rounded?: 'system' | 'full' | 'none'
  className?: string
}

/**
 * Swatch: A primitive for displaying color tokens and spectrums.
 * Used primarily in documentation and color-coded UI indicators.
 */
export function Swatch({
  color,
  opacity = 100,
  size = 'md',
  rounded = 'system',
  className
}: SwatchProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16',
    full: 'w-full h-12'
  }

  const roundedClasses = {
    system: STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
      full: 'rounded-full',
    none: 'rounded-none'
  }

  const colorMapping = {
    orange: {
      100: 'bg-orange-500',
      50: 'bg-orange-500/50',
      30: 'bg-orange-500/30',
      20: 'bg-orange-500/20',
      10: 'bg-orange-500/10'
    },
    emerald: {
      100: 'bg-emerald-500',
      50: 'bg-emerald-500/50',
      30: 'bg-emerald-500/30',
      20: 'bg-emerald-500/20',
      10: 'bg-emerald-500/10'
    },
    amber: {
      100: 'bg-amber-500',
      50: 'bg-amber-500/50',
      30: 'bg-amber-500/30',
      20: 'bg-amber-500/20',
      10: 'bg-amber-500/10'
    },
    red: {
      100: 'bg-red-500',
      50: 'bg-red-500/50',
      30: 'bg-red-500/30',
      20: 'bg-red-500/20',
      10: 'bg-red-500/10'
    },
    blue: {
      100: 'bg-blue-500',
      50: 'bg-blue-500/50',
      30: 'bg-blue-500/30',
      20: 'bg-blue-500/20',
      10: 'bg-blue-500/10'
    },
    zinc: {
      100: 'bg-zinc-500',
      50: 'bg-zinc-500/50',
      30: 'bg-zinc-500/30',
      20: 'bg-zinc-500/20',
      10: 'bg-zinc-500/10'
    },
    white: {
      100: 'bg-white',
      50: 'bg-white/50',
      30: 'bg-white/30',
      20: 'bg-white/20',
      10: 'bg-white/10'
    }
  }

  return (
    <div 
      className={cn(
        'border border-white/10 shrink-0',
        sizeClasses[size],
        roundedClasses[rounded],
        colorMapping[color][opacity as keyof typeof colorMapping['orange']],
        className
      )}
    />
  )
}

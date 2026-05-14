'use client'
import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/advanced/registry-context'

interface IconProps {
  icon: LucideIcon
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '100'
  color?: 'foreground' | 'muted' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'white' | 'black' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'zinc-800' | 'primary'
  spin?: boolean
  animation?: 'bounce' | 'pulse'
  className?: string
  animate?: 'spin'
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  color,
  spin,
  animation,
  className,
  animate,
  opacity
}: IconProps) {
  const { primaryColor } = useRegistry()
  const resolvedColor = color === 'primary' ? primaryColor : color

  return (
    <IconComponent
      className={cn(
        className,
        (spin || animate === 'spin') && 'animate-spin',
        animation === 'bounce' && 'animate-bounce',
        animation === 'pulse' && 'animate-pulse',
        opacity !== undefined && `opacity-${opacity}`,
        // Sizes
        size === 'xs' && 'w-3 h-3',
        size === 'sm' && 'w-4 h-4',
        size === 'md' && 'w-5 h-5',
        size === 'lg' && 'w-6 h-6',
        size === 'xl' && 'w-8 h-8',
        size === '2xl' && 'w-10 h-10',
        size === '3xl' && 'w-12 h-12',
        size === '100' && 'w-[100px] h-[100px]',

        // Colors
        resolvedColor === 'foreground' && 'text-foreground',
        resolvedColor === 'muted' && 'text-zinc-500',
        resolvedColor === 'orange' && 'text-orange-500',
        resolvedColor === 'emerald' && 'text-emerald-500',
        resolvedColor === 'red' && 'text-red-500',
        resolvedColor === 'blue' && 'text-blue-500',
        resolvedColor === 'amber' && 'text-amber-500',
        resolvedColor === 'zinc-400' && 'text-zinc-400',
        resolvedColor === 'zinc-500' && 'text-zinc-500',
        resolvedColor === 'zinc-600' && 'text-zinc-600',
        resolvedColor === 'zinc-700' && 'text-zinc-700',
        resolvedColor === 'zinc-800' && 'text-zinc-800',
        resolvedColor === 'black' && 'text-black',
        resolvedColor === 'white' && 'text-white'
      )}
    />
  )
}

interface IconBoxProps {
  icon: LucideIcon
  variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'system' | 'full'
  className?: string
}

export function IconBox({ icon, variant = 'zinc', size = 'md', rounded = 'system', className }: IconBoxProps) {
  const { primaryColor } = useRegistry()
  const resolvedVariant = variant === 'primary' ? primaryColor : variant

  const bgClasses = {
    orange: 'bg-orange-500/20 border-orange-500/20',
    emerald: 'bg-emerald-500/20 border-emerald-500/20',
    red: 'bg-red-500/20 border-red-500/20',
    blue: 'bg-blue-500/20 border-blue-500/20',
    amber: 'bg-amber-500/20 border-amber-500/20',
    zinc: 'bg-white/5 border-white/10'
  }

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-4'
  }

  return (
    <div className={cn(
      'border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110',
      rounded === 'system' ? 'rounded-[5px]' : 'rounded-full',
      bgClasses[resolvedVariant as keyof typeof bgClasses],
      sizeClasses[size],
      className
    )}>
      <Icon icon={icon} color={resolvedVariant === 'zinc' ? 'white' : resolvedVariant as any} size={size === 'sm' ? 'xs' : 'sm'} />
    </div>
  )
}

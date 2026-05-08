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

interface IconBoxProps {
  icon: LucideIcon
  variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'system' | 'full'
  className?: string
}

export function IconBox({ icon, variant = 'zinc', size = 'md', rounded = 'system', className }: IconBoxProps) {
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
      bgClasses[variant],
      sizeClasses[size],
      className
    )}>
      <Icon icon={icon} color={variant === 'zinc' ? 'white' : variant} size={size === 'sm' ? 'xs' : 'sm'} />
    </div>
  )
}

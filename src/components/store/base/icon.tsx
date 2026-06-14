'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'

interface IconProps {
  icon: LucideIcon
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '100'
  color?: 'foreground' | 'muted' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'white' | 'black' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'zinc-800' | 'primary'
  spin?: boolean
  animation?: 'bounce' | 'pulse'
  className?: never
  animate?: 'spin'
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  style?: never
  groupHoverTranslateX?: 1 | 2 | 3 | 4 | 'full'
  groupHoverColor?: 'current'
  transition?: boolean
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'zinc-400',
  spin,
  animation,
  className,
  animate,
  opacity,
  style,
  groupHoverTranslateX,
  groupHoverColor,
  transition
}: IconProps) {
  const { primaryColor } = useRegistry()
  const resolvedColor = color === 'primary' ? primaryColor : color

  return (
    <IconComponent
      style={style}
      className={cn(
        'shrink-0',
        className,
        transition && 'transition-colors transition-transform',
        (spin || animate === 'spin') && 'animate-spin',
        animation === 'bounce' && 'animate-bounce',
        animation === 'pulse' && 'animate-pulse',
        opacity !== undefined && `opacity-${opacity}`,
        groupHoverColor === 'current' && 'group-hover:text-current',
        groupHoverTranslateX === 1 && 'group-hover:translate-x-1',
        groupHoverTranslateX === 2 && 'group-hover:translate-x-2',
        groupHoverTranslateX === 3 && 'group-hover:translate-x-3',
        groupHoverTranslateX === 4 && 'group-hover:translate-x-4',
        groupHoverTranslateX === 'full' && 'group-hover:translate-x-full',
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
        resolvedColor === 'white' && 'text-white',
        resolvedColor === 'black' && 'text-black'
      )}
    />
  )
}

interface IconBoxProps {
  icon: LucideIcon
  variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'system' | 'full'
  className?: never
  style?: never
  groupHoverTranslateX?: 1 | 2 | 3 | 4 | 'full'
  groupHoverColor?: 'current'
  transition?: boolean
}

export function IconBox({ icon, variant = 'zinc', size = 'md', rounded = 'system', className, style }: IconBoxProps) {
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
      <Icon icon={icon} color={resolvedVariant === STORE_TOKENS.COLORS.BACKGROUND ? STORE_TOKENS.COLORS.WHITE : resolvedVariant as any} size={size === 'sm' ? 'xs' : 'sm'} />
    </div>
  );
}

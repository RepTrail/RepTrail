'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { cn } from '@/lib/utils'

interface CircleIconProps {
  icon: LucideIcon
  color?: 'blue' | 'orange' | 'emerald' | 'red' | 'zinc'
  size?: 'xs' | 'sm' | 'md'
}

/**
 * CircleIcon: A circular container for icons with themed borders and backgrounds.
 */
export function CircleIcon({ 
  icon: IconComp, 
  color = 'zinc',
  size = 'sm'
}: CircleIconProps) {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12'
  }

  // We use a Box but since it's a fixed circular icon with specific border/bg combination,
  // we can use a wrapper that encapsulates the design rules.
  return (
    <Box shrink={0}>
      <div className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all duration-300",
        sizeClasses[size],
        color === 'blue' && "bg-blue-500/10 border-blue-500/20",
        color === 'orange' && "bg-orange-500/10 border-orange-500/20",
        color === 'emerald' && "bg-emerald-500/10 border-emerald-500/20",
        color === 'red' && "bg-red-500/10 border-red-500/20",
        color === 'zinc' && "bg-zinc-500/10 border-zinc-500/20"
      )}>
        <Icon icon={IconComp} size="xs" color={color} />
      </div>
    </Box>
  )
}

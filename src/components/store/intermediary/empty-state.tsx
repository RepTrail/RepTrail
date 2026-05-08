'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: 'blue' | 'red' | 'amber' | 'emerald' | 'orange'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  variant = 'blue',
  className
}: EmptyStateProps) {
  
  const colorMap = {
    blue: 'bg-blue-500/5 border-blue-500/50 hover:bg-blue-500/10 shadow-blue-500/5',
    red: 'bg-red-500/5 border-red-500/50 hover:bg-red-500/10 shadow-red-500/5',
    amber: 'bg-amber-500/5 border-amber-500/50 hover:bg-amber-500/10 shadow-amber-500/5',
    emerald: 'bg-emerald-500/5 border-emerald-500/50 hover:bg-emerald-500/10 shadow-emerald-500/5',
    orange: 'bg-orange-500/5 border-orange-500/50 hover:bg-orange-500/10 shadow-orange-500/5',
  }

  const iconBgMap = {
    blue: 'bg-blue-500/20',
    red: 'bg-red-500/20',
    amber: 'bg-amber-500/20',
    emerald: 'bg-emerald-500/20',
    orange: 'bg-orange-500/20',
  }

  return (
    <div className={cn(
        "py-20 px-10 flex items-center justify-center w-full rounded-[20px] border-2 transition-all duration-500 group",
        colorMap[variant],
        className
    )}>
      <Stack align="center" gap={5}>
        {/* Decorative Icon Wrapper */}
        <div className={cn(
          'p-5 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110',
          iconBgMap[variant]
        )}>
          <Icon icon={icon} size="lg" color={variant as any} />
        </div>

        {/* Textual Content */}
        <Stack align="center" gap={2.5}>
          <Font variant="heading" color="white" uppercase italic weight="black">
            {title}
          </Font>
          <Font variant="description" align="center" color="white" className="max-w-md opacity-60 group-hover:opacity-100 transition-opacity">
            {description}
          </Font>
        </Stack>
      </Stack>
    </div>
  )
}

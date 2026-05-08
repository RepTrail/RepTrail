import React from 'react'
import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 0 | 2 | 2.5 | 4 | 5 | 8 | 12 | 12.5 | 'section'
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string // Internal use only
}

export function Grid({
  children,
  cols = 1,
  gap = 8,
  align = 'stretch'
}: GridProps) {
  return (
    <div className={cn(
      'grid',
      // Columns
      cols === 1 && 'grid-cols-1',
      cols === 2 && 'grid-cols-1 md:grid-cols-2',
      cols === 3 && 'grid-cols-1 md:grid-cols-3',
      cols === 4 && 'grid-cols-1 md:grid-cols-4',
      cols === 5 && 'grid-cols-1 md:grid-cols-5',
      cols === 12 && 'grid-cols-12',

      // Gaps
      gap === 2 && 'gap-2',
      gap === 2.5 && 'gap-2.5',
      gap === 4 && 'gap-4',
      gap === 5 && 'gap-5',
      gap === 8 && 'gap-8',
      gap === 12 && 'gap-12',
      gap === 12.5 && 'gap-[50px]',
      gap === 'section' && 'gap-[50px]',

      // Alignment
      align === 'start' && 'items-start',
      align === 'center' && 'items-center',
      align === 'end' && 'items-end',
      align === 'stretch' && 'items-stretch'
    )}>
      {children}
    </div>
  )
}

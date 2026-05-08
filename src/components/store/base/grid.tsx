import React from 'react'
import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 0 | 2 | 2.5 | 4 | 5 | 8 | 10 | 12 | 12.5 | 'section'
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
}

/**
 * Grid: A layout-only component for CSS Grid distribution.
 */
export function Grid({
  children,
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  gap = 8,
  align = 'stretch',
  className
}: GridProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2: 'gap-2',
    2.5: 'gap-2.5',
    4: 'gap-4',
    5: 'gap-5',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    12.5: 'gap-[50px]',
    'section': 'gap-[50px]'
  }

  return (
    <div className={cn(
      'grid w-full',
      // Columns mapping
      cols && `grid-cols-${cols}`,
      smCols && `sm:grid-cols-${smCols}`,
      mdCols && `md:grid-cols-${mdCols}`,
      lgCols && `lg:grid-cols-${lgCols}`,

      // Gap mapping
      gap !== undefined && gapClasses[gap as keyof typeof gapClasses],

      // Alignment
      align && `items-${align}`,
      
      className
    )}>
      {children}
    </div>
  )
}

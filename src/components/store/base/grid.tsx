import React from 'react'
import { cn } from '@/lib/utils'

type GapToken = 0 | 2 | 2.5 | 4 | 5 | 8 | 10 | 12 | 12.5 | 'section'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: GapToken | { base: GapToken, md: GapToken }
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
    'section': 'gap-[100px]'
  }

  const gapMdClasses = {
    0: 'md:gap-0',
    2: 'md:gap-2',
    2.5: 'md:gap-2.5',
    4: 'md:gap-4',
    5: 'md:gap-5',
    8: 'md:gap-8',
    10: 'md:gap-10',
    12: 'md:gap-12',
    12.5: 'md:gap-[50px]',
    'section': 'md:gap-[100px]'
  }

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

  return (
    <div className={cn(
      'grid w-full',
      // Columns mapping
      cols && `grid-cols-${cols}`,
      smCols && `sm:grid-cols-${smCols}`,
      mdCols && `md:grid-cols-${mdCols}`,
      lgCols && `lg:grid-cols-${lgCols}`,

      // Gap mapping
      gapBase !== undefined && gapClasses[gapBase as keyof typeof gapClasses],
      gapMd !== undefined && gapMdClasses[gapMd as keyof typeof gapMdClasses],

      // Alignment
      align && `items-${align}`,
      
      className
    )}>
      {children}
    </div>
  )
}

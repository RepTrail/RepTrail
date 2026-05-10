import React from 'react'
import { cn } from '@/lib/utils'

type GapToken = 0 | 1 | 2 | 2.5 | 4 | 5 | 8 | 10 | 12 | 12.5 | 'section'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | { base: number, md?: number, lg?: number }
  columns?: number
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: GapToken | { base: GapToken, md: GapToken }
  align?: 'start' | 'center' | 'end' | 'stretch'
  padding?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  fullWidth?: boolean
  className?: string
}

/**
 * Grid: A layout-only component for CSS Grid distribution.
 */
export function Grid({
  children,
  cols = 1,
  columns,
  smCols,
  mdCols,
  lgCols,
  gap = 8,
  align = 'stretch',
  padding,
  paddingX,
  paddingY,
  fullWidth,
  className
}: GridProps) {
  
  const effectiveCols = columns || cols
  
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
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

  const paddingClasses = {
    0: 'p-0',
    1: 'p-1',
    2.5: 'p-2.5',
    5: 'p-5',
    7.5: 'p-[30px]',
    12.5: 'p-[50px]'
  }

  const paddingXClasses = {
    0: 'px-0',
    1: 'px-1',
    2.5: 'px-2.5',
    5: 'px-5',
    7.5: 'px-[30px]',
    12.5: 'px-[50px]'
  }

  const paddingYClasses = {
    0: 'py-0',
    1: 'py-1',
    2.5: 'py-2.5',
    5: 'py-5',
    7.5: 'py-[30px]',
    12.5: 'py-[50px]'
  }

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

  return (
    <div className={cn(
      'grid w-full',
      // Columns mapping
      typeof effectiveCols === 'number' ? `grid-cols-${effectiveCols}` : 
        cn(
          (effectiveCols as any).base && `grid-cols-${(effectiveCols as any).base}`,
          (effectiveCols as any).md && `md:grid-cols-${(effectiveCols as any).md}`,
          (effectiveCols as any).lg && `lg:grid-cols-${(effectiveCols as any).lg}`
        ),
      smCols && `sm:grid-cols-${smCols}`,
      mdCols && `md:grid-cols-${mdCols}`,
      lgCols && `lg:grid-cols-${lgCols}`,

      // Gap mapping
      gapBase !== undefined && gapClasses[gapBase as keyof typeof gapClasses],
      gapMd !== undefined && gapMdClasses[gapMd as keyof typeof gapMdClasses],

      // Alignment
      align && `items-${align}`,
      
      // Padding
      padding !== undefined && paddingClasses[padding as keyof typeof paddingClasses],
      paddingX !== undefined && paddingXClasses[paddingX as keyof typeof paddingXClasses],
      paddingY !== undefined && paddingYClasses[paddingY as keyof typeof paddingYClasses],

      fullWidth && 'w-full',
      
      className
    )}>
      {children}
    </div>
  )
}

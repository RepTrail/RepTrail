import React from 'react'
import { cn } from '@/lib/utils'

type GapToken = 0 | 1 | 2 | 2.5 | 4 | 5 | 7.5 | 8 | 10 | 12 | 12.5 | 'section' | 'header-gap'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | { base: number, md?: number, lg?: number }
  columns?: number
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
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
    7.5: 'gap-[30px]',
    'section': 'gap-[100px]',
    'header-gap': 'gap-8'
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
    7.5: 'md:gap-[30px]',
    'section': 'md:gap-[100px]',
    'header-gap': 'md:gap-8'
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

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    10: 'grid-cols-10',
    12: 'grid-cols-12',
  }

  const mdColClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    10: 'md:grid-cols-10',
    12: 'md:grid-cols-12',
  }

  const lgColClasses = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    10: 'lg:grid-cols-10',
    12: 'lg:grid-cols-12',
  }

  return (
    <div className={cn(
      'grid w-full',
      // Columns mapping
      typeof effectiveCols === 'number' ? colClasses[effectiveCols as keyof typeof colClasses] : 
        cn(
          (effectiveCols as any).base && colClasses[(effectiveCols as any).base as keyof typeof colClasses],
          (effectiveCols as any).md && mdColClasses[(effectiveCols as any).md as keyof typeof mdColClasses],
          (effectiveCols as any).lg && lgColClasses[(effectiveCols as any).lg as keyof typeof lgColClasses]
        ),
      smCols && colClasses[smCols as keyof typeof colClasses], // simplified for sm
      mdCols && mdColClasses[mdCols as keyof typeof mdColClasses],
      lgCols && lgColClasses[lgCols as keyof typeof lgColClasses],

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

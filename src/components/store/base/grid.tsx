import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps, SpacingToken } from './box'

type GapToken = SpacingToken

export interface GridProps extends Omit<BoxProps, 'gap' | 'align' | 'padding' | 'cols'> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | { base: number, md?: number, lg?: number }
  columns?: number
  smCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  xlCols?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12
  gap?: GapToken | { base: GapToken, md: GapToken }
  align?: 'start' | 'center' | 'end' | 'stretch'
  padding?: SpacingToken
  paddingX?: SpacingToken
  paddingY?: SpacingToken
  className?: never
  style?: never
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
  xlCols,
  gap = "element",
  align = 'stretch',
  padding,
  paddingX,
  paddingY,
  fullWidth,
  className,
  ...props
}: GridProps) {
  
  const effectiveCols = columns || cols
  
  const gapClasses = {
    none: 'gap-0',
    tiny: 'gap-1',
    element: 'gap-2.5',
    container: 'gap-5',
    empty_state: 'gap-[50px]',
    section: 'gap-[50px]',
    'title-content': 'gap-[30px]',
    'header-gap': 'gap-8'
  }

  const gapMdClasses = {
    none: 'md:gap-0',
    tiny: 'md:gap-1',
    element: 'md:gap-2.5',
    container: 'md:gap-5',
    empty_state: 'md:gap-[50px]',
    section: 'md:gap-[100px]',
    'title-content': 'md:gap-[50px]',
    'header-gap': 'md:gap-8'
  }

  const paddingClasses = {
    none: 'p-0',
    tiny: 'p-1',
    element: 'p-2.5',
    container: 'p-5',
    empty_state: 'p-[50px]',
    section: 'p-[100px]'
  }

  const paddingXClasses = {
    none: 'px-0',
    tiny: 'px-1',
    element: 'px-2.5',
    container: 'px-5',
    empty_state: 'px-[50px]',
    section: 'px-[100px]'
  }

  const paddingYClasses = {
    none: 'py-0',
    tiny: 'py-1',
    element: 'py-2.5',
    container: 'py-5',
    empty_state: 'py-[50px]',
    section: 'py-[100px]'
  }

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  let gapBase = isRespGap ? (gap as any).base : gap
  let gapMd = isRespGap ? (gap as any).md : undefined

  // Auto-responsive tokens
  if (gap === 'section' || gap === 'title-content') {
    gapBase = gap
    gapMd = gap
  }

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
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
    7: 'md:grid-cols-7',
    8: 'md:grid-cols-8',
    9: 'md:grid-cols-9',
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
    7: 'lg:grid-cols-7',
    8: 'lg:grid-cols-8',
    9: 'lg:grid-cols-9',
    10: 'lg:grid-cols-10',
    12: 'lg:grid-cols-12',
  }

  const xlColClasses = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    7: 'xl:grid-cols-7',
    8: 'xl:grid-cols-8',
    9: 'xl:grid-cols-9',
    10: 'xl:grid-cols-10',
    12: 'xl:grid-cols-12',
  }

  return (
    <Box 
      display="grid"
      fullWidth={fullWidth}
      className={cn(
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
        xlCols && xlColClasses[xlCols as keyof typeof xlColClasses],

        // Gap mapping
        gapBase !== undefined && gapClasses[gapBase as keyof typeof gapClasses],
        gapMd !== undefined && gapMdClasses[gapMd as keyof typeof gapMdClasses],

        // Alignment
        align && `items-${align}`,
        
        // Padding
        padding !== undefined && paddingClasses[padding as keyof typeof paddingClasses],
        paddingX !== undefined && paddingXClasses[paddingX as keyof typeof paddingXClasses],
        paddingY !== undefined && paddingYClasses[paddingY as keyof typeof paddingYClasses],

        className
      ) as any}
      {...props}
    >
      {children}
    </Box>
  )
}

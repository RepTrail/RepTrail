import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps } from './box'

export type GapToken = 
  | 0 
  | 2.5 
  | 5 
  | 10 
  | 12.5 
  | 20 
  | 50 
  | 100 
  | 'section' 
  | 'title-content' 
  | 'header-gap'
  | 'empty-state'
  | 'container'
  | 'element'

export interface StackProps extends Omit<BoxProps, 'gap'> {
  children: React.ReactNode
  direction?: 'row' | 'col' | { base: 'row' | 'col', md?: 'row' | 'col', lg?: 'row' | 'col' }
  gap?: GapToken | { base: GapToken, md: GapToken }
  divide?: boolean
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | { base: 'start' | 'center' | 'end' | 'stretch' | 'baseline', md?: 'start' | 'center' | 'end' | 'stretch' | 'baseline', lg?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' }
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | { base: 'start' | 'center' | 'end' | 'between' | 'around', md?: 'start' | 'center' | 'end' | 'between' | 'around', lg?: 'start' | 'center' | 'end' | 'between' | 'around' }
  flex1?: boolean | { base: boolean, md?: boolean, lg?: boolean }
  fullWidth?: boolean
  wrap?: 'wrap' | 'nowrap'
  className?: string
  id?: string
}

/**
 * Stack: Vertical or Horizontal layout with consistent spacing.
 */
export function Stack({ 
  children, 
  direction = 'col', 
  gap = 2.5, 
  divide,
  align = 'stretch', 
  justify = 'start',
  flex1,
  fullWidth,
  wrap,
  className,
  id,
  ...props
}: StackProps) {
  
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2.5: 'gap-2.5',
    5: 'gap-5',
    7.5: 'gap-[30px]',
    10: 'gap-10',
    12.5: 'gap-[50px]',
    'section': 'gap-[50px]',
    'title-content': 'gap-[30px]',
    'header-gap': 'gap-8'
  }

  const gapMdClasses = {
    0: 'md:gap-0',
    1: 'md:gap-1',
    2.5: 'md:gap-2.5',
    5: 'md:gap-5',
    7.5: 'md:gap-[30px]',
    10: 'md:gap-10',
    12.5: 'md:gap-[50px]',
    'section': 'md:gap-[100px]',
    'title-content': 'md:gap-[50px]',
    'header-gap': 'md:gap-8'
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

  return (
    <Box 
      id={id}
      fullWidth={fullWidth}
      flex1={flex1}
      align={align}
      justify={justify}
      display="flex"
      direction={direction}
      className={cn(
        gapClasses[gapBase as keyof typeof gapClasses],
        gapMd && gapMdClasses[gapMd as keyof typeof gapMdClasses],
        wrap === 'wrap' && 'flex-wrap',
        wrap === 'nowrap' && 'flex-nowrap',
        divide && (direction === 'col' ? 'divide-y divide-white/10' : 'divide-x divide-white/10'),
        className
      )}
      {...props}
    >
      {children}
    </Box>
  )
}

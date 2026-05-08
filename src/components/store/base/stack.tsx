import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps } from './box'

type GapToken = 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'section' | 'title-content'

export interface StackProps extends Omit<BoxProps, 'gap'> {
  children: React.ReactNode
  direction?: 'row' | 'col' | { base: 'row' | 'col', md: 'row' | 'col' }
  gap?: GapToken | { base: GapToken, md: GapToken }
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  flex1?: boolean
  fullWidth?: boolean
  wrap?: boolean
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
  align = 'stretch', 
  justify = 'start',
  flex1,
  fullWidth,
  wrap = false,
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
    'section': 'gap-[100px]',
    'title-content': 'gap-10'
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
    'title-content': 'md:gap-10'
  }

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

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
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </Box>
  )
}

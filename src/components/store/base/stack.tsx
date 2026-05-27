import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps, SpacingToken } from './box'

export type GapToken = SpacingToken

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
  className?: never
  id?: string
  style?: never
}

/**
 * Stack: Vertical or Horizontal layout with consistent spacing.
 */
export function Stack({
  children,
  direction = 'col',
  gap = "element",
  divide,
  align = 'stretch',
  justify = 'start',
  flex1,
  fullWidth,
  wrap,
  className,
  ...props
}: StackProps) {

  const gapClasses = {
    none: 'gap-0',
    element: 'gap-2.5',
    container: 'gap-5',
    empty_state: 'gap-[50px]',
    section: 'gap-[50px]',
    'title-content': 'gap-[30px]',
    'header-gap': 'gap-8'
  }

  const gapMdClasses = {
    none: 'md:gap-0',
    element: 'md:gap-2.5',
    container: 'md:gap-5',
    empty_state: 'md:gap-[50px]',
    section: 'md:gap-[100px]',
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
      ) as any}
      {...props}
    >
      {children}
    </Box>
  )
}

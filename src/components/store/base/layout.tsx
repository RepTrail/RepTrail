import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

interface LayoutBaseProps {
  children: React.ReactNode
  gap?: 0 | 2.5 | 5 | 12.5
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  flex1?: boolean
  className?: string
}

/**
 * Inline: Horizontal layout for elements that should stay in a single row.
 */
export function Inline({ 
  children, 
  gap = 2.5, 
  align = 'center', 
  justify = 'start',
  flex1,
  className 
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    12.5: 'gap-[50px]'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  return (
    <Box 
      className={cn(
        'flex flex-row',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        flex1 && 'flex-1',
        className
      )}
    >
      {children}
    </Box>
  )
}

/**
 * Cluster: Layout for elements that should wrap if there's no space.
 */
export function Cluster({ 
  children, 
  gap = 2.5, 
  align = 'center', 
  justify = 'start',
  className 
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    12.5: 'gap-[50px]'
  }

  return (
    <Box 
      className={cn(
        'flex flex-row flex-wrap',
        gapClasses[gap],
        align && `items-${align}`,
        justify && `justify-${justify}`,
        className
      )}
    >
      {children}
    </Box>
  )
}

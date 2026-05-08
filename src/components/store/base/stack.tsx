import React from 'react'
import { cn } from '@/lib/utils'

export interface StackProps {
  children: React.ReactNode
  direction?: 'row' | 'col'
  mdDirection?: 'row' | 'col'
  gap?: 0 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'section' | 'title-content'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  mdAlign?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  mdJustify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  flex1?: boolean
  shrink0?: boolean
  className?: string
  id?: string
}

/**
 * Stack: A layout-only component for vertical or horizontal alignment.
 * Encapsulates rhythm (gaps) and distribution logic.
 */
export function Stack({
  children,
  direction = 'col',
  mdDirection,
  gap,
  align,
  mdAlign,
  justify,
  mdJustify,
  wrap = false,
  flex1 = false,
  shrink0 = false,
  className,
  id
}: StackProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    7.5: 'gap-[30px]',
    10: 'gap-10',
    12.5: 'gap-[50px]',
    'section': 'gap-[50px] md:gap-[100px]',
    'title-content': 'gap-[30px] md:gap-[50px]'
  }

  return (
    <div
      id={id}
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        mdDirection === 'col' && 'md:flex-col',
        mdDirection === 'row' && 'md:flex-row',
        wrap && 'flex-wrap',
        flex1 && 'flex-1',
        shrink0 && 'shrink-0',

        // Gap mapping
        gap !== undefined && gapClasses[gap],

        // Alignment
        align && `items-${align}`,
        mdAlign && `md:items-${mdAlign}`,

        // Justification
        justify && `justify-${justify === 'between' ? 'between' : justify}`,
        mdJustify && `md:justify-${mdJustify === 'between' ? 'between' : mdJustify}`,

        className
      )}
    >
      {children}
    </div>
  )
}

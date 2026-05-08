import React from 'react'
import { cn } from '@/lib/utils'

export interface StackProps {
  children: React.ReactNode
  direction?: 'row' | 'col'
  mdDirection?: 'row' | 'col'
  gap?: 0 | 2.5 | 5 | 12.5 | 'section' | 'title-content'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  height?: 'full' | 'screen' | string
  width?: 'full' | 'screen' | 'fit-content' | string
  mdWidth?: 'full' | 'screen' | 'fit-content' | string
  padding?: 0 | 2 | 4 | 6 | 8 | 12 | 16
  paddingTop?: 0 | 4 | 8 | 12 | 16
  position?: 'fixed' | 'absolute' | 'relative'
  inset?: '0' | string
  zIndex?: number
  display?: 'flex' | 'hidden' | 'lg-flex' | string
  shrink0?: boolean
  overflow?: 'hidden' | 'auto' | 'visible' | string
  className?: string
  flex1?: boolean
  id?: string
  mdAlign?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  mdJustify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

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
  fullWidth = false,
  fullHeight = false,
  height,
  width,
  mdWidth,
  padding,
  paddingTop,
  position,
  inset,
  zIndex,
  display,
  shrink0 = false,
  overflow,
  className,
  flex1 = false,
  id
}: StackProps) {
  return (
    <div
      id={id}
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        mdDirection === 'col' && 'md:flex-col',
        mdDirection === 'row' && 'md:flex-row',
        fullHeight && 'h-full',
        width === 'full' && 'w-full',
        width === 'screen' && 'w-screen',
        width === 'fit-content' && 'w-fit',
        mdWidth === 'full' && 'md:w-full',
        mdWidth === 'screen' && 'md:w-screen',
        mdWidth === 'fit-content' && 'md:w-fit',
        height === 'full' && 'h-full',
        height === 'screen' && 'h-screen',
        wrap && 'flex-wrap',
        flex1 && 'flex-1',
        shrink0 && 'shrink-0',

        // Position
        position === 'fixed' && 'fixed',
        position === 'absolute' && 'absolute',
        position === 'relative' && 'relative',
        inset === '0' && 'inset-0',
        zIndex && `z-[${zIndex}]`,

        // Display
        display === 'flex' && 'flex',
        display === 'hidden' && 'hidden',
        display === 'lg-flex' && 'hidden lg:flex',
        overflow === 'hidden' && 'overflow-hidden',
        overflow === 'auto' && 'overflow-auto',
        overflow === 'visible' && 'overflow-visible',

        // Paddings
        padding === 2 && 'p-2',
        padding === 4 && 'p-4',
        padding === 6 && 'p-6',
        padding === 8 && 'p-8',
        padding === 12 && 'p-12',
        padding === 16 && 'p-16',

        paddingTop === 4 && 'pt-4',
        paddingTop === 8 && 'pt-8',
        paddingTop === 12 && 'pt-12',
        paddingTop === 16 && 'pt-16',

        // Gap tokens
        gap === 2.5 && 'gap-[10px]',
        gap === 5 && 'gap-5',
        gap === 12.5 && 'gap-[50px]',

        // Special rhythm tokens
        gap === 'section' && 'gap-[50px] md:gap-[100px]',
        gap === 'title-content' && 'gap-[30px] md:gap-[50px]',

        // Alignment
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'baseline' && 'items-baseline',
        align === 'stretch' && 'items-stretch',

        mdAlign === 'start' && 'md:items-start',
        mdAlign === 'center' && 'md:items-center',
        mdAlign === 'end' && 'md:items-end',

        // Justification
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        justify === 'around' && 'justify-around',

        mdJustify === 'start' && 'md:justify-start',
        mdJustify === 'center' && 'md:justify-center',
        mdJustify === 'end' && 'md:justify-end',
        mdJustify === 'between' && 'md:justify-between'
      )}
    >
      {children}
    </div>
  )
}

import React from 'react'
import { cn } from '@/lib/utils'

type BoxColor = 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'white' | 'transparent' | 'black'

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  as?: 'div' | 'aside' | 'nav' | 'main' | 'section' | 'header' | 'footer' | 'button' | 'img' | 'input' | 'label' | 'span'
  variant?: 'base' | 'skeleton'
  padding?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  bg?: BoxColor
  bgOpacity?: 5 | 10 | 20 | 30 | 50 | 80 | 90 | 95 | 100
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  overflow?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip'
  overflowX?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip'
  overflowY?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip'
  rounded?: 'none' | 'full' | 'system'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  display?: 'flex' | 'block' | 'inline-block' | 'inline-flex' | 'none' | { base: 'flex' | 'block' | 'none', md: 'flex' | 'block' | 'none' }
  direction?: 'row' | 'col' | { base: 'row' | 'col', md: 'row' | 'col' }
  position?: 'relative' | 'absolute' | 'fixed' | 'static'
  width?: 'full' | 'auto' | 'sidebar' | 'anatomy-title' | 'px' | 'half' | { base: 'full' | 'auto', md: 'half' | 'sidebar' | 'auto' }
  height?: 'full' | 'auto' | 'screen' | 'px' | 'anatomy-skeleton' | 'anatomy-header' | 'anatomy-item' | 'anatomy-line' | '8' | '24'
  minHeight?: 'screen'
  shrink?: 0 | 1
  flex1?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  noScrollbar?: boolean
  borderR?: boolean
  borderColor?: string
  group?: boolean
  transition?: boolean
  className?: string
  id?: string
  onClick?: () => void
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

/**
 * Box: A minimal semantic wrapper primitive.
 * Now evolved to handle complex layout scaffolding with zero manual classes.
 */
export function Box({
  children,
  as: Component = 'div',
  variant = 'base',
  padding,
  paddingX,
  paddingY,
  bg,
  bgOpacity = 100,
  opacity,
  overflow,
  overflowX,
  overflowY,
  rounded,
  align,
  justify,
  display,
  direction,
  position,
  width,
  height,
  minHeight,
  shrink,
  flex1,
  fullWidth,
  fullHeight,
  noScrollbar,
  borderR,
  borderColor,
  group,
  transition,
  className,
  id,
  onClick,
  style,
  ...props
}: BoxProps) {
  
  const paddingMapping = {
    0: 'p-0',
    1: 'p-1',
    2.5: 'p-2.5',
    5: 'p-5',
    7.5: 'p-[30px]',
    12.5: 'p-[50px]'
  }

  const paddingXMapping = {
    0: 'px-0',
    1: 'px-1',
    2.5: 'px-2.5',
    5: 'px-5',
    7.5: 'px-[30px]',
    12.5: 'px-[50px]'
  }

  const paddingYMapping = {
    0: 'py-0',
    1: 'py-1',
    2.5: 'py-2.5',
    5: 'py-5',
    7.5: 'py-[30px]',
    12.5: 'py-[50px]'
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]'
  }

  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
    half: 'w-1/2',
    sidebar: 'w-56',
    'anatomy-title': 'w-24',
    px: 'w-px'
  }

  const heightClasses = {
    full: 'h-full',
    auto: 'h-auto',
    screen: 'h-screen',
    px: 'h-px',
    '8': 'h-8',
    '24': 'h-24',
    'anatomy-skeleton': 'h-[700px]',
    'anatomy-header': 'h-24',
    'anatomy-item': 'h-16',
    'anatomy-line': 'h-4'
  }

  const colorMapping: Record<BoxColor, Record<number, string>> = {
    orange: { 100: 'bg-orange-500', 95: 'bg-orange-500/95', 90: 'bg-orange-500/90', 80: 'bg-orange-500/80', 50: 'bg-orange-500/50', 30: 'bg-orange-500/30', 20: 'bg-orange-500/20', 10: 'bg-orange-500/10', 5: 'bg-orange-500/5' },
    emerald: { 100: 'bg-emerald-500', 95: 'bg-emerald-500/95', 90: 'bg-emerald-500/90', 80: 'bg-emerald-500/80', 50: 'bg-emerald-500/50', 30: 'bg-emerald-500/30', 20: 'bg-emerald-500/20', 10: 'bg-emerald-500/10', 5: 'bg-emerald-500/5' },
    amber: { 100: 'bg-amber-500', 95: 'bg-amber-500/95', 90: 'bg-amber-500/90', 80: 'bg-amber-500/80', 50: 'bg-amber-500/50', 30: 'bg-amber-500/30', 20: 'bg-amber-500/20', 10: 'bg-amber-500/10', 5: 'bg-amber-500/5' },
    red: { 100: 'bg-red-500', 95: 'bg-red-500/95', 90: 'bg-red-500/90', 80: 'bg-red-500/80', 50: 'bg-red-500/50', 30: 'bg-red-500/30', 20: 'bg-red-500/20', 10: 'bg-red-500/10', 5: 'bg-red-500/5' },
    blue: { 100: 'bg-blue-500', 95: 'bg-blue-500/95', 90: 'bg-blue-500/90', 80: 'bg-blue-500/80', 50: 'bg-blue-500/50', 30: 'bg-blue-500/30', 20: 'bg-blue-500/20', 10: 'bg-blue-500/10', 5: 'bg-blue-500/5' },
    zinc: { 100: 'bg-zinc-950', 95: 'bg-zinc-900', 90: 'bg-zinc-800', 80: 'bg-zinc-700', 50: 'bg-zinc-900', 30: 'bg-zinc-500/30', 20: 'bg-zinc-500/20', 10: 'bg-zinc-500/10', 5: 'bg-zinc-500/5' },
    white: { 100: 'bg-white', 95: 'bg-white/95', 90: 'bg-white/90', 80: 'bg-white/80', 50: 'bg-white/50', 30: 'bg-white/30', 20: 'bg-white/20', 10: 'bg-white/10', 5: 'bg-white/5' },
    black: { 100: 'bg-black', 95: 'bg-black/95', 90: 'bg-black/90', 80: 'bg-black/80', 50: 'bg-black/50', 30: 'bg-black/30', 20: 'bg-black/20', 10: 'bg-black/10', 5: 'bg-black/5' },
    transparent: { 100: 'bg-transparent', 95: 'bg-transparent', 90: 'bg-transparent', 80: 'bg-transparent', 50: 'bg-transparent', 30: 'bg-transparent', 20: 'bg-transparent', 10: 'bg-transparent', 5: 'bg-transparent' }
  }

  const opacityClasses = {
    0: 'opacity-0',
    10: 'opacity-10',
    20: 'opacity-20',
    30: 'opacity-30',
    40: 'opacity-40',
    50: 'opacity-50',
    60: 'opacity-60',
    70: 'opacity-70',
    80: 'opacity-80',
    90: 'opacity-90',
    100: 'opacity-100'
  }

  const displayClasses = {
    flex: 'flex',
    block: 'block',
    'inline-block': 'inline-block',
    'inline-flex': 'inline-flex',
    none: 'hidden'
  }

  // Handle responsive display
  const isRespDisplay = typeof display === 'object'
  const displayBase = isRespDisplay ? (display as any).base : display
  const displayMd = isRespDisplay ? (display as any).md : undefined

  // Handle responsive width
  const isRespWidth = typeof width === 'object'
  const widthBase = isRespWidth ? (width as any).base : width
  const widthMd = isRespWidth ? (width as any).md : undefined

  // Handle responsive direction
  const isRespDirection = typeof direction === 'object'
  const directionBase = isRespDirection ? (direction as any).base : direction
  const directionMd = isRespDirection ? (direction as any).md : undefined

  const flexNeeded = align || justify || direction || (displayBase?.includes('flex')) || (displayMd?.includes('flex'))

  return (
    <Component
      id={id}
      onClick={onClick}
      style={style}
      className={cn(
        // Display & Flex
        displayBase && displayClasses[displayBase as keyof typeof displayClasses],
        displayMd && `md:${displayClasses[displayMd as keyof typeof displayClasses]}`,
        flexNeeded && !displayBase && !displayMd && 'flex',
        
        directionBase === 'col' ? 'flex-col' : directionBase === 'row' ? 'flex-row' : '',
        directionMd === 'col' ? 'md:flex-col' : directionMd === 'row' ? 'md:flex-row' : '',
        
        // Sizing
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        widthBase && widthClasses[widthBase as keyof typeof widthClasses],
        widthMd && `md:${widthClasses[widthMd as keyof typeof widthClasses]}`,
        height && heightClasses[height as keyof typeof heightClasses],
        minHeight === 'screen' && 'min-h-screen',

        flex1 && 'flex-1',
        shrink !== undefined && `shrink-${shrink}`,
        overflow && `overflow-${overflow}`,
        overflowX && `overflow-x-${overflowX}`,
        overflowY && `overflow-y-${overflowY}`,
        noScrollbar && 'no-scrollbar',
        position,
        
        // Borders & Opacity
        borderR && 'border-r',
        borderColor === 'white/5' && 'border-white/5',
        borderColor === 'white/10' && 'border-white/10',
        borderColor === 'white/20' && 'border-white/20',
        opacity !== undefined && opacityClasses[opacity],
        group && 'group',
        transition && 'transition-all duration-300',

        // Alignment
        align && `items-${align}`,
        justify && `justify-${justify === 'between' ? 'between' : justify}`,

        // Semantic Variants
        variant === 'skeleton' && 'bg-zinc-950 border border-white/10 border-dashed',
        rounded && roundedClasses[rounded],

        // Background Mapping
        bg && colorMapping[bg][bgOpacity],

        // Controlled Padding
        padding !== undefined && paddingMapping[padding as keyof typeof paddingMapping],
        paddingX !== undefined && paddingXMapping[paddingX as keyof typeof paddingXMapping],
        paddingY !== undefined && paddingYMapping[paddingY as keyof typeof paddingYMapping],

        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box, SpacingToken } from './box'

interface LayoutBaseProps {
  children: React.ReactNode
  gap?: SpacingToken | { base: SpacingToken, md?: SpacingToken, lg?: SpacingToken }
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  flex1?: boolean
  fullWidth?: boolean
  wrap?: boolean
  padding?: SpacingToken | { base: SpacingToken, md?: SpacingToken, lg?: SpacingToken }
  position?: 'relative' | 'absolute' | 'fixed' | 'static'
  shrink?: 0 | 1
  opacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 90 | 95 | 100
  minWidth?: number | string | { base: number | string, md?: number | string, lg?: number | string }
  className?: never
  id?: string
}

/**
 * Inline: Horizontal layout for elements that should stay in a single row.
 */
export function Inline({ 
  children, 
  gap = "element", 
  align = 'center', 
  justify = 'start',
  flex1,
  fullWidth,
  wrap = false,
  padding,
  position,
  shrink,
  opacity,
  minWidth,
  className,
  id
}: LayoutBaseProps) {
  
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

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
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
      padding={padding}
      position={position}
      shrink={shrink}
      opacity={opacity}
      minWidth={minWidth}
      className={cn(
        'flex flex-row',
        gapClasses[gapBase as keyof typeof gapClasses],
        gapMd && gapMdClasses[gapMd as keyof typeof gapMdClasses],
        alignClasses[align],
        justifyClasses[justify],
        flex1 && 'flex-1',
        wrap && 'flex-wrap',
        className
      ) as any}
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
  gap = "element", 
  align = 'center', 
  justify = 'start',
  flex1,
  fullWidth,
  padding,
  position,
  shrink,
  opacity,
  minWidth,
  className,
  id
}: LayoutBaseProps) {
  
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
      padding={padding}
      position={position}
      shrink={shrink}
      opacity={opacity}
      className={cn(
        'flex flex-row flex-wrap',
        gapClasses[gapBase as keyof typeof gapClasses],
        gapMd && gapMdClasses[gapMd as keyof typeof gapMdClasses],
        align && `items-${align}`,
        justify && `justify-${justify}`,
        flex1 && 'flex-1',
        className
      ) as any}
    >
      {children}
    </Box>
  )
}

/**
 * Sidebar Primitive: Enforces layout for the fixed desktop sidebar.
 */
export function Sidebar({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <aside
      id={id}
      className="fixed left-0 top-0 h-screen w-80 z-50 hidden lg:flex flex-row gap-0"
    >
      {children}
    </aside>
  )
}

/**
 * MainArea: Standard main container with sidebar offsets.
 */
export function MainArea({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <main
      id={id}
      className="flex-1 p-5 lg:pl-80 transition-all duration-300"
    >
      {children}
    </main>
  )
}

/**
 * MobileNavContainer: The floating bottom navigation for mobile.
 */
export function MobileNavContainer({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <nav
      id={id}
      className="fixed left-0 bottom-0 h-20 w-full bg-gradient-to-t from-black/40 to-black/20 backdrop-blur-md md:hidden z-40 px-5 flex items-center justify-around"
      style={{ borderTop: '1px solid rgba(0,0,0,0.4)' }}
    >
      {children}
    </nav>
  )
}

/**
 * MobileHeaderContainer: The fixed top header for mobile.
 */
export function MobileHeaderContainer({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <header
      id={id}
      className="fixed left-0 top-0 w-full h-20 bg-zinc-950 md:hidden z-40 px-5 flex items-center"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {children}
    </header>
  )
}

import { createPortal } from 'react-dom'

/**
 * ModalOverlay: The fixed backdrop and centering container for modals.
 */
export function ModalOverlay({ 
  children, 
  onClose, 
  id, 
  className, 
  backdropClassName,
  animateState 
}: { 
  children: React.ReactNode
  onClose?: () => void
  id?: string
  className?: never
  backdropClassName?: string
  animateState?: 'closed' | 'open'
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const computedBackdropClassName = cn(
    "absolute inset-0 bg-black/60",
    "transition-all duration-200 ease-out",
    animateState === 'open' ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-none",
    backdropClassName
  )

  return createPortal(
    <div 
      id={id}
      className={cn("fixed inset-0 z-[1000] flex items-center justify-center p-5", className)}
    >
      <div 
        className={computedBackdropClassName} 
        onClick={onClose}
      />
      {children}
    </div>,
    document.body
  )
}

/**
 * ModalContainer: The relative container for modal content.
 */
export function ModalContainer({ 
  children, 
  id, 
  className,
  animateState 
}: { 
  children: React.ReactNode
  id?: string
  className?: never
  animateState?: 'closed' | 'open'
}) {
  const computedContainerClassName = cn(
    "relative w-11/12 md:w-[600px] max-h-[90vh] overflow-hidden flex flex-col",
    "transition-all duration-200 ease-out",
    animateState === 'open' ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
    className
  )

  return (
    <div
      id={id}
      className={computedContainerClassName}
      style={{ maxHeight: '90vh' }}
    >
      {children}
    </div>
  )
}

/**
 * Divider: Official design system separator (Rule 140)
 */
export function Divider({ 
  direction = 'horizontal', 
  color = 'white/10' 
}: { 
  direction?: 'horizontal' | 'vertical' | { base: 'horizontal' | 'vertical', md?: 'horizontal' | 'vertical' }, 
  color?: string 
}) {
  const isRespDirection = typeof direction === 'object'
  const dirBase = isRespDirection ? (direction as any).base : direction
  const dirMd = isRespDirection ? (direction as any).md : undefined

  return (
    <div 
      className={cn(
        'shrink-0',
        dirBase === 'horizontal' ? 'w-full h-[2px]' : 'h-full w-[2px]',
        dirMd === 'horizontal' && 'md:w-full md:h-[2px]',
        dirMd === 'vertical' && 'md:h-full md:w-[2px]',
        color === 'white/50' && 'bg-white/50',
        color === 'white/30' && 'bg-white/30',
        color === 'white/20' && 'bg-white/20',
        color === 'white/10' && 'bg-white/10',
        color === 'white/5' && 'bg-white/5',
        color.startsWith('bg-') ? color : ''
      )} 
    />
  )
}

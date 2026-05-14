'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

type GapToken = 0 | 2.5 | 5 | 10 | 12.5 | 20 | 50 | 100 | 'section' | 'header-gap'

interface LayoutBaseProps {
  children: React.ReactNode
  gap?: GapToken | { base: GapToken, md: GapToken }
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  flex1?: boolean
  fullWidth?: boolean
  wrap?: boolean
  padding?: 0 | 2.5 | 5 | 10 | 12.5 | 20 | 50 | 100
  position?: 'relative' | 'absolute' | 'fixed' | 'static'
  shrink?: 0 | 1
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  className?: string
  id?: string
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
  fullWidth,
  wrap = false,
  padding,
  position,
  shrink,
  opacity,
  className,
  id
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    10: 'gap-10',
    12.5: 'gap-[50px]',
    20: 'gap-20',
    50: 'gap-[200px]',
    100: 'gap-[400px]',
    'section': 'gap-[100px]',
    'header-gap': 'gap-8'
  }

  const gapMdClasses = {
    0: 'md:gap-0',
    2.5: 'md:gap-2.5',
    5: 'md:gap-5',
    10: 'md:gap-10',
    12.5: 'md:gap-[50px]',
    20: 'md:gap-20',
    50: 'md:gap-[200px]',
    100: 'md:gap-[400px]',
    'section': 'md:gap-[100px]',
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
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

  return (
    <Box 
      id={id}
      fullWidth={fullWidth}
      padding={padding}
      position={position}
      shrink={shrink}
      opacity={opacity}
      className={cn(
        'flex flex-row',
        gapClasses[gapBase as keyof typeof gapClasses],
        gapMd && gapMdClasses[gapMd as keyof typeof gapMdClasses],
        alignClasses[align],
        justifyClasses[justify],
        flex1 && 'flex-1',
        wrap && 'flex-wrap',
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
  flex1,
  fullWidth,
  padding,
  position,
  shrink,
  opacity,
  className,
  id
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    10: 'gap-10',
    12.5: 'gap-[50px]',
    20: 'gap-20',
    50: 'gap-[200px]',
    100: 'gap-[400px]',
    'section': 'gap-[100px]',
    'header-gap': 'gap-8'
  }

  const gapMdClasses = {
    0: 'md:gap-0',
    2.5: 'md:gap-2.5',
    5: 'md:gap-5',
    10: 'md:gap-10',
    12.5: 'md:gap-[50px]',
    20: 'md:gap-20',
    50: 'md:gap-[200px]',
    100: 'md:gap-[400px]',
    'section': 'md:gap-[100px]',
    'header-gap': 'md:gap-8'
  }

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

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
      )}
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
      className="fixed left-0 bottom-0 h-20 w-full bg-gradient-to-t from-black/40 to-black/20 border-t border-black/40 backdrop-blur-md md:hidden z-40 px-5 flex items-center justify-around"
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
      className="fixed left-0 top-0 w-full h-20 bg-zinc-950 border-b border-white/5 md:hidden z-40 px-5 flex items-center"
    >
      {children}
    </header>
  )
}

import { createPortal } from 'react-dom'

/**
 * ModalOverlay: The fixed backdrop and centering container for modals.
 */
export function ModalOverlay({ children, onClose, id }: { children: React.ReactNode, onClose?: () => void, id?: string }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <div 
      id={id}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
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
export function ModalContainer({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <div
      id={id}
      className="relative w-11/12 md:w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
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
        dirBase === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
        dirMd === 'horizontal' && 'md:w-full md:h-px',
        dirMd === 'vertical' && 'md:h-full md:w-px',
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

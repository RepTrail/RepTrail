'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

interface LayoutBaseProps {
  children: React.ReactNode
  gap?: 0 | 2.5 | 5 | 12.5 | 'section'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  flex1?: boolean
  fullWidth?: boolean
  wrap?: boolean
  padding?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 12.5
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
  paddingX,
  paddingY,
  className,
  id
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    12.5: 'gap-[50px]',
    'section': 'gap-[100px]'
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
      id={id}
      fullWidth={fullWidth}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      className={cn(
        'flex flex-row',
        gapClasses[gap as keyof typeof gapClasses],
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
  paddingX,
  paddingY,
  className,
  id
}: LayoutBaseProps) {
  
  const gapClasses = {
    0: 'gap-0',
    2.5: 'gap-2.5',
    5: 'gap-5',
    12.5: 'gap-[50px]',
    'section': 'gap-[100px]'
  }

  return (
    <Box 
      id={id}
      fullWidth={fullWidth}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      className={cn(
        'flex flex-row flex-wrap',
        gapClasses[gap as keyof typeof gapClasses],
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
      className="fixed left-0 top-0 h-screen w-72 z-50 hidden lg:flex flex-row gap-0"
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
      className="fixed left-0 bottom-0 h-20 w-full bg-zinc-950 border-t border-white/5 md:hidden z-40 px-5 flex items-center justify-around"
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

/**
 * ModalOverlay: The fixed backdrop and centering container for modals.
 */
export function ModalOverlay({ children, onClose, id }: { children: React.ReactNode, onClose?: () => void, id?: string }) {
  return (
    <div 
      id={id}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      {children}
    </div>
  )
}

/**
 * ModalContainer: The relative container for modal content.
 */
export function ModalContainer({ children, id }: { children: React.ReactNode, id?: string }) {
  return (
    <div
      id={id}
      className="relative w-11/12 md:w-[500px] max-h-[90vh] overflow-hidden flex flex-col"
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
  direction?: 'horizontal' | 'vertical', 
  color?: string 
}) {
  return (
    <div 
      className={cn(
        'shrink-0',
        direction === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
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

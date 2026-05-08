import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

interface SurfaceProps {
  children: React.ReactNode
  variant?: 'base' | 'glass' | 'glass-diagonal' | 'sunken' | 'raised' | 'interactive'
  padding?: 0 | 2.5 | 5
  rounded?: 'none' | 'full' | 'system'
  className?: string
  id?: string
  onClick?: () => void
}

/**
 * Surface Layer: Encapsulates background, borders, and depth.
 */
export function Surface({ 
  children, 
  variant = 'base', 
  padding = 5,
  rounded = 'system',
  className,
  id,
  onClick
}: SurfaceProps) {
  
  const variantClasses = {
    base: 'bg-zinc-900 border border-white/5',
    glass: 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.05] backdrop-blur-md',
    'glass-diagonal': 'bg-gradient-to-br from-white/[0.07] to-white/[0.04] border border-white/[0.05] backdrop-blur-md',
    sunken: 'bg-zinc-950/40 border border-white/5',
    raised: 'bg-zinc-800 border border-white/10 shadow-lg',
    interactive: 'bg-zinc-900 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all cursor-pointer'
  }

  const paddingClasses = {
    0: 'p-0',
    2.5: 'p-2.5',
    5: 'p-5'
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]'
  }

  return (
    <Box
      id={id}
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        className
      )}
    >
      {children}
    </Box>
  )
}

export function GlassPanel(props: Omit<SurfaceProps, 'variant'>) {
  return <Surface variant="glass" {...props} />
}

export function Card(props: Omit<SurfaceProps, 'variant'>) {
  return <Surface variant="base" {...props} />
}

export function ActionSurface(props: Omit<SurfaceProps, 'variant'>) {
  return <Surface variant="interactive" {...props} />
}

/**
 * CardHeader: Sub-component for Surface/Card headers.
 */
export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn('p-5 border-b border-white/5', className)}>
      {children}
    </div>
  )
}

/**
 * CardContent: Sub-component for Surface/Card body content.
 */
export function CardContent({ children, className, padding = 5 }: { children: React.ReactNode, className?: string, padding?: 0 | 2.5 | 5 }) {
  const paddingClasses = {
    0: 'p-0',
    2.5: 'p-2.5',
    5: 'p-5'
  }
  
  return (
    <div className={cn(paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

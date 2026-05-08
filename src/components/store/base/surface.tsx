import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps } from './box'

type SurfaceVariant = 
  | 'base' 
  | 'glass' 
  | 'glass-diagonal' 
  | 'sunken' 
  | 'raised' 
  | 'interactive' 
  | 'showcase' 
  | 'tonal-orange' 
  | 'tonal-emerald' 
  | 'tonal-amber' 
  | 'tonal-red' 
  | 'tonal-blue'

interface SurfaceProps extends Omit<BoxProps, 'variant' | 'padding' | 'minHeight'> {
  children: React.ReactNode
  variant?: SurfaceVariant
  padding?: 0 | 2.5 | 5 | 12
  rounded?: 'none' | 'full' | 'system'
  minHeight?: 'sm' | 'md' | 'lg' | 'xl'
  border?: 'none' | 'subtle' | 'bold' | 'dashed'
}

/**
 * Surface Layer: Encapsulates background, borders, and depth.
 */
export function Surface({ 
  children, 
  variant = 'base', 
  padding = 5,
  rounded = 'system',
  minHeight,
  align,
  justify,
  width,
  height,
  flex1,
  shrink,
  border,
  className,
  id,
  onClick,
  ...props
}: SurfaceProps) {
  
  const variantClasses = {
    base: 'bg-zinc-900 border border-white/5',
    glass: 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.05] backdrop-blur-md',
    'glass-diagonal': 'bg-gradient-to-br from-white/[0.07] to-white/[0.04] border border-white/[0.05] backdrop-blur-md',
    'glass-dark': 'bg-gradient-to-br from-black/40 to-black/20 border border-black/40 backdrop-blur-md',
    sunken: 'bg-zinc-950/40 border border-white/5',
    raised: 'bg-zinc-800 border border-white/10 shadow-lg',
    interactive: 'bg-zinc-900 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all cursor-pointer',
    showcase: 'bg-zinc-950/50 border border-white/5 border-dashed flex items-center justify-center',
    
    // Tonal variants (for EmptyStates, etc.)
    'tonal-orange': 'bg-orange-500/5 border-orange-500/50 hover:bg-orange-500/10 transition-all duration-500',
    'tonal-emerald': 'bg-emerald-500/5 border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-500',
    'tonal-amber': 'bg-amber-500/5 border-amber-500/50 hover:bg-amber-500/10 transition-all duration-500',
    'tonal-red': 'bg-red-500/5 border-red-500/50 hover:bg-red-500/10 transition-all duration-500',
    'tonal-blue': 'bg-blue-500/5 border-blue-500/50 hover:bg-blue-500/10 transition-all duration-500',
  }

  const paddingClasses = {
    0: 'p-0',
    2.5: 'p-2.5',
    5: 'p-5',
    12: 'p-5 md:p-12'
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]'
  }

  const minHeightClasses = {
    sm: 'min-h-[48px]',
    md: 'min-h-[64px]',
    lg: 'min-h-[128px]',
    xl: 'min-h-[192px]'
  }

  const borderClasses = {
    none: 'border-none',
    subtle: 'border border-white/5',
    bold: 'border-2',
    dashed: 'border border-dashed'
  }

  return (
    <Box
      id={id}
      onClick={onClick}
      flex1={flex1}
      shrink={shrink}
      width={width}
      height={height}
      align={align}
      justify={justify}
      className={cn(
        variantClasses[variant],
        paddingClasses[padding as keyof typeof paddingClasses],
        roundedClasses[rounded],
        border && borderClasses[border],
        minHeight && minHeightClasses[minHeight],
        className
      )}
      {...props}
    >
      {children}
    </Box>
  )
}

export function GlassPanel(props: SurfaceProps) {
  return <Surface variant="glass" {...props} />
}

export function Card(props: SurfaceProps) {
  return <Surface variant="base" {...props} />
}

export function ActionSurface(props: SurfaceProps) {
  return <Surface variant="interactive" {...props} />
}

/**
 * CardHeader: Sub-component for Surface/Card headers.
 */
export function CardHeader({ children, className, ...props }: BoxProps) {
  return (
    <Box 
      padding={5} 
      display="flex" 
      align="center" 
      className={cn('border-b border-white/5', className)} 
      {...props}
    >
      {children}
    </Box>
  )
}

/**
 * CardContent: Sub-component for Surface/Card body content.
 */
export function CardContent({ children, className, padding = 5, ...props }: BoxProps) {
  return (
    <Box 
      padding={padding as any} 
      className={className} 
      {...props}
    >
      {children}
    </Box>
  )
}

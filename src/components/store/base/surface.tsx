'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps, SpacingToken } from './box'
import { Separator } from './separator'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export type SurfaceVariant = 
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
  | 'tonal-zinc'
  | 'tonal-primary'

type BoxColor = 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'white' | 'transparent' | 'black' | 'primary' | 'success' | 'warning' | 'neutral'

interface SurfaceProps extends Omit<BoxProps, 'padding' | 'zIndex' | 'border' | 'borderWidth' | 'borderColor' | 'bgOpacity' | 'hoverBgOpacity' | 'opacity' | 'groupHoverOpacity'> {
  children: React.ReactNode
  variant?: SurfaceVariant | 'glass-dark'
  padding?: SpacingToken | { base: SpacingToken, md?: SpacingToken, lg?: SpacingToken }
  rounded?: 'none' | 'full' | 'system'
  minHeight?: 'screen' | 'sm' | 'md' | 'lg' | 'xl' | number
  border?: 'none' | 'subtle' | 'standard' | 'bold' | 'dashed'
  borderWidth?: 2 | 4
  borderColor?: string
  hoverBorder?: string
  bg?: BoxColor
  bgOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  hoverBg?: BoxColor
  hoverBgOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  opacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  groupHoverOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  backdropBlur?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  rotate?: 1 | 2 | 3 | -1 | -2 | -3
  hoverScale?: 110 | 105
  groupHoverScale?: 110 | 105
  activeScale?: 95 | 90
  animation?: 'in-fade-zoom' | 'bounce' | 'pulse'
  group?: boolean
  zIndex?: 10 | 20 | 30 | 40 | 50 | 100
}

/**
 * Surface Layer: Encapsulates background, borders, and depth.
 */
export function Surface({ 
  children, 
  variant = 'base', 
  padding,
  rounded = 'system',
  minHeight,
  border,
  borderWidth,
  borderColor,
  hoverBorder,
  bg,
  bgOpacity = 100,
  hoverBg,
  hoverBgOpacity,
  opacity,
  groupHoverOpacity,
  backdropBlur,
  rotate,
  hoverScale,
  groupHoverScale,
  activeScale,
  animation,
  group,
  zIndex,
  className,
  id,
  onClick,
  ...props
}: SurfaceProps) {
  const { primaryColor } = useRegistry()
  const resolvedVariant = variant === 'tonal-primary' ? `tonal-${primaryColor}` as SurfaceVariant : variant
  
  const colorMapping: Record<BoxColor, Record<number, string>> = {
    orange: { 100: 'bg-orange-500', 95: 'bg-orange-500/95', 90: 'bg-orange-500/90', 80: 'bg-orange-500/80', 50: 'bg-orange-500/50', 30: 'bg-orange-500/30', 20: 'bg-orange-500/20', 10: 'bg-orange-500/10', 5: 'bg-orange-500/5' },
    emerald: { 100: 'bg-emerald-500', 95: 'bg-emerald-500/95', 90: 'bg-emerald-500/90', 80: 'bg-emerald-500/80', 50: 'bg-emerald-500/50', 30: 'bg-emerald-500/30', 20: 'bg-emerald-500/20', 10: 'bg-emerald-500/10', 5: 'bg-emerald-500/5' },
    amber: { 100: 'bg-amber-500', 95: 'bg-amber-500/95', 90: 'bg-amber-500/90', 80: 'bg-amber-500/80', 50: 'bg-amber-500/50', 30: 'bg-amber-500/30', 20: 'bg-amber-500/20', 10: 'bg-amber-500/10', 5: 'bg-amber-500/5' },
    red: { 100: 'bg-red-500', 95: 'bg-red-500/95', 90: 'bg-red-500/90', 80: 'bg-red-500/80', 50: 'bg-red-500/50', 30: 'bg-red-500/30', 20: 'bg-red-500/20', 10: 'bg-red-500/10', 5: 'bg-red-500/5' },
    blue: { 100: 'bg-blue-500', 95: 'bg-blue-500/95', 90: 'bg-blue-500/90', 80: 'bg-blue-500/80', 50: 'bg-blue-500/50', 30: 'bg-blue-500/30', 20: 'bg-blue-500/20', 10: 'bg-blue-500/10', 5: 'bg-blue-500/5' },
    zinc: { 100: 'bg-zinc-950', 95: 'bg-zinc-900', 90: 'bg-zinc-800', 80: 'bg-zinc-700', 50: 'bg-zinc-950/50', 30: 'bg-zinc-500/30', 20: 'bg-zinc-500/20', 10: 'bg-zinc-500/10', 5: 'bg-zinc-500/5' },
    white: { 100: 'bg-white', 95: 'bg-white/95', 90: 'bg-white/90', 80: 'bg-white/80', 50: 'bg-white/50', 30: 'bg-white/30', 20: 'bg-white/20', 10: 'bg-white/10', 5: 'bg-white/5' },
    black: { 100: 'bg-black', 95: 'bg-black/95', 90: 'bg-black/90', 80: 'bg-black/80', 50: 'bg-black/50', 30: 'bg-black/30', 20: 'bg-black/20', 10: 'bg-black/10', 5: 'bg-black/5' },
    transparent: { 100: 'bg-transparent', 95: 'bg-transparent', 90: 'bg-transparent', 80: 'bg-transparent', 50: 'bg-transparent', 30: 'bg-transparent', 20: 'bg-transparent', 10: 'bg-transparent', 5: 'bg-transparent' },
    primary: {
      100: `bg-${primaryColor}-500`,
      95: `bg-${primaryColor}-500/95`,
      90: `bg-${primaryColor}-500/90`,
      80: `bg-${primaryColor}-500/80`,
      50: `bg-${primaryColor}-500/50`,
      30: `bg-${primaryColor}-500/30`,
      20: `bg-${primaryColor}-500/20`,
      10: `bg-${primaryColor}-500/10`,
      5: `bg-${primaryColor}-500/5`
    },
    success: { 100: 'bg-success', 95: 'bg-success/95', 90: 'bg-success/90', 80: 'bg-success/80', 50: 'bg-success/50', 30: 'bg-success/30', 20: 'bg-success/20', 10: 'bg-success/10', 5: 'bg-success/5' },
    warning: { 100: 'bg-warning', 95: 'bg-warning/95', 90: 'bg-warning/90', 80: 'bg-warning/80', 50: 'bg-warning/50', 30: 'bg-warning/30', 20: 'bg-warning/20', 10: 'bg-warning/10', 5: 'bg-warning/5' },
    neutral: { 100: 'bg-neutral', 95: 'bg-neutral/95', 90: 'bg-neutral/90', 80: 'bg-neutral/80', 50: 'bg-neutral/50', 30: 'bg-neutral/30', 20: 'bg-neutral/20', 10: 'bg-neutral/10', 5: 'bg-neutral/5' }
  }

  const primaryTonalClasses: Record<string, string> = {
    orange: 'border-2 bg-orange-500/5 border-orange-500/40 transition-all duration-500 backdrop-blur-xl',
    emerald: 'border-2 bg-emerald-500/5 border-emerald-500/50 transition-all duration-500 backdrop-blur-xl',
    blue: 'border-2 bg-blue-500/5 border-blue-500/50 transition-all duration-500 backdrop-blur-xl',
    amber: 'border-2 bg-amber-500/5 border-amber-500/50 transition-all duration-500 backdrop-blur-xl',
    red: 'border-2 bg-red-500/5 border-red-500/50 transition-all duration-500 backdrop-blur-xl',
    zinc: 'border-2 bg-zinc-500/5 border-zinc-500/50 transition-all duration-500 backdrop-blur-xl',
  }

  const variantClasses: Record<string, string> = {
    base: 'bg-zinc-900 border-2 border-white/5',
    glass: 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-2 border-white/[0.05] backdrop-blur-md',
    'glass-diagonal': 'bg-gradient-to-br from-white/[0.07] to-white/[0.04] border-2 border-white/[0.05] backdrop-blur-md',
    'glass-dark': 'bg-gradient-to-br from-black/80 to-black/60 border-2 border-white/5 backdrop-blur-xl',
    sunken: 'bg-zinc-950/40 border-2 border-white/5',
    raised: 'bg-zinc-800 border-2 border-white/10 shadow-lg',
    interactive: 'bg-zinc-900 border-2 border-white/5 transition-all cursor-pointer',
    showcase: 'bg-zinc-950/50 border-2 border-white/5 border-dashed flex items-center justify-center',
    'tonal-orange': 'border-2 bg-orange-500/5 border-orange-500/40 transition-all duration-500 backdrop-blur-xl',
    'tonal-emerald': 'border-2 bg-emerald-500/5 border-emerald-500/50 transition-all duration-500 backdrop-blur-xl',
    'tonal-amber': 'border-2 bg-amber-500/5 border-amber-500/50 transition-all duration-500 backdrop-blur-xl',
    'tonal-red': 'border-2 bg-red-500/5 border-red-500/50 transition-all duration-500 backdrop-blur-xl',
    'tonal-blue': 'border-2 bg-blue-500/5 border-blue-500/50 transition-all duration-500 backdrop-blur-xl',
    'tonal-zinc': 'border-2 bg-white/5 border-white/10 transition-all duration-500 backdrop-blur-xl',
    'tonal-primary': primaryTonalClasses[primaryColor] || primaryTonalClasses.orange
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]',
  }

  const borderClasses = {
    none: 'border-none',
    subtle: 'border-2 border-white/5',
    standard: 'border-2 border-white/10',
    bold: 'border-2',
    dashed: 'border-2 border-dashed'
  }

  const opacityClasses = {
    0: 'opacity-0',
    5: 'opacity-5',
    10: 'opacity-10',
    20: 'opacity-20',
    30: 'opacity-30',
    40: 'opacity-40',
    50: 'opacity-50',
    60: 'opacity-60',
    70: 'opacity-70',
    80: 'opacity-80',
    90: 'opacity-90',
    95: 'opacity-95',
    100: 'opacity-100'
  }

  const rotateClasses = {
    1: 'rotate-1',
    2: 'rotate-2',
    3: 'rotate-3',
    '-1': '-rotate-1',
    '-2': '-rotate-2',
    '-3': '-rotate-3'
  }

  const zIndexClasses = {
    10: 'z-10',
    20: 'z-20',
    30: 'z-30',
    40: 'z-40',
    50: 'z-50',
    100: 'z-[100]'
  }

  return (
    <Box
      id={id}
      onClick={onClick}
      padding={padding}
      zIndex={zIndex as any}
      minHeight={minHeight}
      // @ts-expect-error - Surface is a foundational component and needs to pass className to Box
      className={cn(
        variantClasses[resolvedVariant as keyof typeof variantClasses],
        rounded && roundedClasses[rounded],
        border && borderClasses[border],
        borderWidth === 4 ? 'border-4' : borderWidth === 2 ? 'border-2' : '',
        borderColor && `border-${borderColor}`,
        hoverBorder && `hover:border-${hoverBorder}`,
        bg && colorMapping[bg][bgOpacity],
        hoverBg && `hover:${colorMapping[hoverBg][hoverBgOpacity || 100]}`,
        opacity !== undefined && opacityClasses[opacity as keyof typeof opacityClasses],
        groupHoverOpacity !== undefined && `group-hover:${opacityClasses[groupHoverOpacity as keyof typeof opacityClasses]}`,
        backdropBlur && `backdrop-blur-${backdropBlur}`,
        rotate !== undefined && rotateClasses[rotate as keyof typeof rotateClasses],
        hoverScale && `hover:scale-${hoverScale}`,
        groupHoverScale && `group-hover:scale-${groupHoverScale}`,
        activeScale && `active:scale-${activeScale}`,
        animation === 'in-fade-zoom' && 'animate-in fade-in zoom-in duration-500',
        animation === 'bounce' && 'animate-bounce',
        animation === 'pulse' && 'animate-pulse',
        group && 'group',
      )}
      style={props.style}
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
    <div className="w-full flex flex-col">
      <Box 
        padding={STORE_TOKENS.PADDING.CONTAINER} 
        display="flex" 
        align="center" 
        className={className} 
        {...props}
      >
        {children}
      </Box>
      <Separator opacity={STORE_TOKENS.OPACITY.LOW} />
    </div>
  );
}

/**
 * CardContent: Sub-component for Surface/Card body content.
 */
export function CardContent({ children, className, padding = STORE_TOKENS.PADDING.CONTAINER, ...props }: BoxProps) {
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

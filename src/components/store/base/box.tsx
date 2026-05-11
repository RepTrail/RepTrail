'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useRegistry } from '../advanced/registry-context'

type BoxColor = 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'white' | 'transparent' | 'black' | 'primary' | 'success' | 'warning' | 'neutral'

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  as?: 'div' | 'aside' | 'nav' | 'main' | 'section' | 'header' | 'footer' | 'button' | 'img' | 'input' | 'label' | 'span'
  variant?: 'base' | 'skeleton' | 'liquid-success' | 'liquid-zinc'
  padding?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  bg?: BoxColor
  bgOpacity?: 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  border?: boolean
  borderWidth?: 1 | 2
  borderColor?: string
  hoverBorder?: string
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  paddingTop?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  paddingBottom?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  paddingLeft?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  paddingRight?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', sm?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'sidebar' | 'sidebar-wide' }
  rotate?: 0 | 1 | 2 | 3 | -1 | -2 | -3
  hoverBg?: BoxColor
  hoverBgOpacity?: 5 | 10 | 20 | 30 | 50 | 80 | 90 | 95 | 100
  opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  groupHoverOpacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  backdropBlur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'
  overflow?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' | { base: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', md?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', lg?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' }
  overflowX?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' | { base: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', md?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', lg?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' }
  overflowY?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' | { base: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', md?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip', lg?: 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip' }
  rounded?: 'none' | 'full' | 'system' | '3xl' | '2xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | { base: 'start' | 'center' | 'end' | 'stretch' | 'baseline', sm?: 'start' | 'center' | 'end' | 'stretch' | 'baseline', md?: 'start' | 'center' | 'end' | 'stretch' | 'baseline', lg?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' }
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | { base: 'start' | 'center' | 'end' | 'between' | 'around', sm?: 'start' | 'center' | 'end' | 'between' | 'around', md?: 'start' | 'center' | 'end' | 'between' | 'around', lg?: 'start' | 'center' | 'end' | 'between' | 'around' }
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex' | 'none' | { base: 'flex' | 'grid' | 'block' | 'none', sm?: 'flex' | 'grid' | 'block' | 'none', md?: 'flex' | 'grid' | 'block' | 'none', lg?: 'flex' | 'grid' | 'block' | 'none' }
  direction?: 'row' | 'col' | { base: 'row' | 'col', sm?: 'row' | 'col', md?: 'row' | 'col', lg?: 'row' | 'col' }
  position?: 'relative' | 'absolute' | 'fixed' | 'static' | { base: 'relative' | 'absolute' | 'fixed' | 'static', sm?: 'relative' | 'absolute' | 'fixed' | 'static', md?: 'relative' | 'absolute' | 'fixed' | 'static', lg?: 'relative' | 'absolute' | 'fixed' | 'static' }
  pin?: 'left' | 'right' | 'top' | 'bottom' | 'inset' | { base: 'left' | 'right' | 'top' | 'bottom' | 'inset', md?: 'left' | 'right' | 'top' | 'bottom' | 'inset', lg?: 'left' | 'right' | 'top' | 'bottom' | 'inset' }
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' | { base: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form', md?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form', lg?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' }
  width?: 'full' | 'auto' | 'sidebar' | 'sidebar-wide' | 'anatomy-sidebar' | 'anatomy-title' | 'px' | 'half' | '10' | '24' | { base: 'full' | 'auto' | '10' | '24', md?: 'half' | 'sidebar' | 'sidebar-wide' | 'anatomy-sidebar' | 'auto' | '10' | '24', lg?: 'full' | 'auto' | 'half' | 'sidebar' | 'sidebar-wide' | 'anatomy-sidebar' | '10' | '24' }
  height?: 'full' | 'auto' | 'screen' | 'px' | 'anatomy-skeleton' | 'anatomy-header' | 'anatomy-item' | 'anatomy-line' | '8' | '24' | '10'
  minHeight?: 'screen' | number
  minWidth?: 0 | 'anatomy-sidebar'
  shrink?: 0 | 1
  flex?: 0 | 1 | 'none' | { base: 0 | 1 | 'none', md?: 0 | 1 | 'none', lg?: 0 | 1 | 'none' }
  flex1?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  noScrollbar?: boolean
  truncate?: boolean
  breakAll?: boolean
  group?: boolean
  transition?: boolean
  translateX?: 'full' | 'none' | { base: 'full' | 'none', lg: 'full' | 'none' }
  groupHoverDisplay?: 'flex' | 'block' | 'none'
  groupHoverTranslateX?: 0 | -180 | -240
  hoverScale?: 110 | 105
  groupHoverScale?: 110 | 105
  activeScale?: 95 | 90
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 100 | 'auto'
  inset?: 0 | 1 | 2.5 | 5
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12
  lgColSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12
  grayscale?: boolean
  cursor?: 'pointer' | 'default' | 'not-allowed'
  textAlign?: 'center' | 'left' | 'right'
  wrap?: 'wrap' | 'nowrap'
  focusWithinZIndex?: 10 | 50 | 100 | 1000
  animation?: 'in-fade-zoom' | 'bounce' | 'pulse'
  gap?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'header-gap' | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'header-gap', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | 30 | 'header-gap' }
  className?: string
  id?: string
  onClick?: () => void
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  src?: string
  alt?: string
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
  groupHoverOpacity,
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
  minWidth,
  shrink,
  flex,
  flex1,
  fullWidth,
  fullHeight,
  noScrollbar,
  border,
  borderWidth,
  borderColor,
  hoverBorder,
  top,
  right,
  bottom,
  left,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  truncate,
  breakAll,
  hoverBg,
  hoverBgOpacity,
  backdropBlur,
  translateX,
  groupHoverDisplay,
  groupHoverTranslateX,
  hoverScale,
  groupHoverScale,
  activeScale,
  colSpan,
  lgColSpan,
  grayscale,
  cursor,
  textAlign,
  wrap,
  focusWithinZIndex,
  animation,
  group,
  transition,
  rotate,
  maxWidth,
  gap,
  pin,
  className,
  id,
  onClick,
  style,
  zIndex,
  inset,
  ...props
}: BoxProps) {
  const { primaryColor } = useRegistry()
  const resolvedBg = bg === 'primary' ? primaryColor : bg

  const paddingMapping = {
    0: 'p-0',
    1: 'p-1',
    2.5: 'p-2.5',
    5: 'p-5',
    7.5: 'p-[30px]',
    10: 'p-10',
    12.5: 'p-[50px]',
    20: 'p-20',
    25: 'p-[100px]',
    30: 'p-[120px]',
    sidebar: 'p-56',
    'sidebar-wide': 'p-80'
  }

  const paddingXMapping = {
    0: 'px-0',
    1: 'px-1',
    2.5: 'px-2.5',
    5: 'px-5',
    7.5: 'px-[30px]',
    10: 'px-10',
    12.5: 'px-[50px]',
    20: 'px-20',
    25: 'px-[100px]',
    30: 'px-[120px]',
    sidebar: 'px-56',
    'sidebar-wide': 'px-80'
  }

  const paddingYMapping = {
    0: 'py-0',
    1: 'py-1',
    2.5: 'py-2.5',
    5: 'py-5',
    7.5: 'py-[30px]',
    10: 'py-10',
    12.5: 'py-[50px]',
    20: 'py-20',
    25: 'py-[100px]',
    30: 'py-[120px]',
    sidebar: 'py-56',
    'sidebar-wide': 'py-80'
  }

  const paddingTopMapping = {
    0: 'pt-0',
    1: 'pt-1',
    2.5: 'pt-2.5',
    5: 'pt-5',
    7.5: 'pt-[30px]',
    10: 'pt-10',
    12.5: 'pt-[50px]',
    20: 'pt-20',
    25: 'pt-[100px]',
    30: 'pt-[120px]',
    sidebar: 'pt-56',
    'sidebar-wide': 'pt-80'
  }

  const paddingBottomMapping = {
    0: 'pb-0',
    1: 'pb-1',
    2.5: 'pb-2.5',
    5: 'pb-5',
    7.5: 'pb-[30px]',
    10: 'pb-10',
    12.5: 'pb-[50px]',
    20: 'pb-20',
    25: 'pb-[100px]',
    30: 'pb-[120px]',
    sidebar: 'pb-56',
    'sidebar-wide': 'pb-80'
  }

  const paddingLeftMapping = {
    0: 'pl-0',
    1: 'pl-1',
    2.5: 'pl-2.5',
    5: 'pl-5',
    7.5: 'pl-[30px]',
    10: 'pl-10',
    12.5: 'pl-[50px]',
    20: 'pl-20',
    25: 'pl-[100px]',
    30: 'pl-[120px]',
    sidebar: 'pl-56',
    'sidebar-wide': 'pl-80'
  }

  const paddingRightMapping = {
    0: 'pr-0',
    1: 'pr-1',
    2.5: 'pr-2.5',
    5: 'pr-5',
    7.5: 'pr-[30px]',
    10: 'pr-10',
    12.5: 'pr-[50px]',
    20: 'pr-20',
    25: 'pr-[100px]',
    30: 'pr-[120px]',
    sidebar: 'pr-56',
    'sidebar-wide': 'pr-80'
  }

  const gapMapping = {
    0: 'gap-0',
    1: 'gap-1',
    2.5: 'gap-2.5',
    5: 'gap-5',
    7.5: 'gap-[30px]',
    12.5: 'gap-[50px]',
    20: 'gap-20',
    25: 'gap-[100px]',
    30: 'gap-[120px]',
    'header-gap': 'gap-8'
  }

  const gapMdMapping = {
    0: 'md:gap-0',
    1: 'md:gap-1',
    2.5: 'md:gap-2.5',
    5: 'md:gap-5',
    7.5: 'md:gap-[30px]',
    12.5: 'md:gap-[50px]',
    20: 'md:gap-20',
    25: 'md:gap-[100px]',
    30: 'md:gap-[120px]'
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }

  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
    half: 'w-1/2',
    sidebar: 'w-56',
    'anatomy-sidebar': 'w-[240px]',
    'anatomy-title': 'w-24',
    px: 'w-px',
    '10': 'w-10',
    '24': 'w-24',
    'sidebar-wide': 'w-80'
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
    zinc: { 100: 'bg-zinc-950', 95: 'bg-zinc-900', 90: 'bg-zinc-800', 80: 'bg-zinc-700', 50: 'bg-zinc-950/50', 40: 'bg-zinc-950/40', 30: 'bg-zinc-500/30', 20: 'bg-zinc-500/20', 10: 'bg-zinc-500/10', 5: 'bg-zinc-500/5' },
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

  const groupHoverOpacityClasses = {
    0: 'group-hover:opacity-0',
    10: 'group-hover:opacity-10',
    20: 'group-hover:opacity-20',
    30: 'group-hover:opacity-30',
    40: 'group-hover:opacity-40',
    50: 'group-hover:opacity-50',
    60: 'group-hover:opacity-60',
    70: 'group-hover:opacity-70',
    80: 'group-hover:opacity-80',
    90: 'group-hover:opacity-90',
    100: 'group-hover:opacity-100'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    none: 'max-w-none',
    'auth-form': 'max-w-[440px]'
  }

  const zIndexClasses = {
    0: 'z-0',
    10: 'z-10',
    20: 'z-20',
    30: 'z-30',
    40: 'z-40',
    50: 'z-50',
    100: 'z-[100]',
    'auto': 'z-auto'
  }

  const insetClasses = {
    0: 'inset-0',
    1: 'inset-1',
    2.5: 'inset-2.5',
    5: 'inset-5'
  }

  const minWidthClasses = {
    0: 'min-w-0',
    'anatomy-sidebar': 'min-w-[240px]'
  }

  const flexClasses = {
    0: 'flex-none',
    1: 'flex-1',
    'none': 'flex-none'
  }

  const isRespFlex = typeof flex === 'object'
  const flexBase = isRespFlex ? (flex as any).base : flex
  const flexMd = isRespFlex ? (flex as any).md : undefined
  const flexLg = isRespFlex ? (flex as any).lg : undefined

  const displayClasses = {
    flex: 'flex',
    block: 'block',
    'inline-block': 'inline-block',
    'inline-flex': 'inline-flex',
    none: 'hidden'
  }

  const rotateClasses = {
    0: 'rotate-0',
    1: 'rotate-1',
    2: 'rotate-2',
    3: 'rotate-3',
    '-1': '-rotate-1',
    '-2': '-rotate-2',
    '-3': '-rotate-3'
  }

  // Handle responsive display
  const isRespDisplay = typeof display === 'object'
  const displayBase = isRespDisplay ? (display as any).base : display
  const displaySm = isRespDisplay ? (display as any).sm : undefined
  const displayMd = isRespDisplay ? (display as any).md : undefined
  const displayLg = isRespDisplay ? (display as any).lg : undefined

  // Handle responsive width
  const isRespWidth = typeof width === 'object'
  const widthBase = isRespWidth ? (width as any).base : width
  const widthSm = isRespWidth ? (width as any).sm : undefined
  const widthMd = isRespWidth ? (width as any).md : undefined
  const widthLg = isRespWidth ? (width as any).lg : undefined

  // Handle responsive padding
  const isRespPadding = typeof padding === 'object'
  const paddingBase = isRespPadding ? (padding as any).base : padding
  const paddingSm = isRespPadding ? (padding as any).sm : undefined
  const paddingMd = isRespPadding ? (padding as any).md : undefined
  const paddingLg = isRespPadding ? (padding as any).lg : undefined

  // Handle responsive paddingX
  const isRespPaddingX = typeof paddingX === 'object'
  const paddingXBase = isRespPaddingX ? (paddingX as any).base : paddingX
  const paddingXSm = isRespPaddingX ? (paddingX as any).sm : undefined
  const paddingXMd = isRespPaddingX ? (paddingX as any).md : undefined
  const paddingXLg = isRespPaddingX ? (paddingX as any).lg : undefined

  // Handle responsive paddingY
  const isRespPaddingY = typeof paddingY === 'object'
  const paddingYBase = isRespPaddingY ? (paddingY as any).base : paddingY
  const paddingYSm = isRespPaddingY ? (paddingY as any).sm : undefined
  const paddingYMd = isRespPaddingY ? (paddingY as any).md : undefined
  const paddingYLg = isRespPaddingY ? (paddingY as any).lg : undefined

  // Handle responsive maxWidth
  const isRespMaxWidth = typeof maxWidth === 'object'
  const maxWidthBase = isRespMaxWidth ? (maxWidth as any).base : maxWidth
  const maxWidthSm = isRespMaxWidth ? (maxWidth as any).sm : undefined
  const maxWidthMd = isRespMaxWidth ? (maxWidth as any).md : undefined
  const maxWidthLg = isRespMaxWidth ? (maxWidth as any).lg : undefined

  // Handle responsive align
  const isRespAlign = typeof align === 'object'
  const alignBase = isRespAlign ? (align as any).base : align
  const alignMd = isRespAlign ? (align as any).md : undefined
  const alignLg = isRespAlign ? (align as any).lg : undefined

  // Handle responsive justify
  const isRespJustify = typeof justify === 'object'
  const justifyBase = isRespJustify ? (justify as any).base : justify
  const justifyMd = isRespJustify ? (justify as any).md : undefined
  const justifyLg = isRespJustify ? (justify as any).lg : undefined

  // Handle responsive direction
  const isRespDirection = typeof direction === 'object'
  const directionBase = isRespDirection ? (direction as any).base : direction
  const directionMd = isRespDirection ? (direction as any).md : undefined
  const directionLg = isRespDirection ? (direction as any).lg : undefined

  // Handle responsive paddingTop
  const isRespPaddingTop = typeof paddingTop === 'object'
  const paddingTopBase = isRespPaddingTop ? (paddingTop as any).base : paddingTop
  const paddingTopSm = isRespPaddingTop ? (paddingTop as any).sm : undefined
  const paddingTopMd = isRespPaddingTop ? (paddingTop as any).md : undefined
  const paddingTopLg = isRespPaddingTop ? (paddingTop as any).lg : undefined

  // Handle responsive paddingBottom
  const isRespPaddingBottom = typeof paddingBottom === 'object'
  const paddingBottomBase = isRespPaddingBottom ? (paddingBottom as any).base : paddingBottom
  const paddingBottomSm = isRespPaddingBottom ? (paddingBottom as any).sm : undefined
  const paddingBottomMd = isRespPaddingBottom ? (paddingBottom as any).md : undefined
  const paddingBottomLg = isRespPaddingBottom ? (paddingBottom as any).lg : undefined

  // Handle responsive paddingLeft
  const isRespPaddingLeft = typeof paddingLeft === 'object'
  const paddingLeftBase = isRespPaddingLeft ? (paddingLeft as any).base : paddingLeft
  const paddingLeftSm = isRespPaddingLeft ? (paddingLeft as any).sm : undefined
  const paddingLeftMd = isRespPaddingLeft ? (paddingLeft as any).md : undefined
  const paddingLeftLg = isRespPaddingLeft ? (paddingLeft as any).lg : undefined

  // Handle responsive paddingRight
  const isRespPaddingRight = typeof paddingRight === 'object'
  const paddingRightBase = isRespPaddingRight ? (paddingRight as any).base : paddingRight
  const paddingRightSm = isRespPaddingRight ? (paddingRight as any).sm : undefined
  const paddingRightMd = isRespPaddingRight ? (paddingRight as any).md : undefined
  const paddingRightLg = isRespPaddingRight ? (paddingRight as any).lg : undefined

  const isRespTranslateX = typeof translateX === 'object'
  const translateXBase = isRespTranslateX ? (translateX as any).base : translateX
  const translateXLg = isRespTranslateX ? (translateX as any).lg : undefined

  // Handle responsive position
  const isRespPosition = typeof position === 'object'
  const positionBase = isRespPosition ? (position as any).base : position
  const positionMd = isRespPosition ? (position as any).md : undefined
  const positionLg = isRespPosition ? (position as any).lg : undefined

  // Handle responsive pin
  const isRespPin = typeof pin === 'object'
  const pinBase = isRespPin ? (pin as any).base : pin
  const pinMd = isRespPin ? (pin as any).md : undefined
  const pinLg = isRespPin ? (pin as any).lg : undefined

  // Handle responsive gap
  const isRespGap = typeof gap === 'object'
  const gapBase = isRespGap ? (gap as any).base : gap
  const gapMd = isRespGap ? (gap as any).md : undefined

  const flexNeeded = align || justify || direction || (displayBase?.includes('flex')) || (displayMd?.includes('flex')) || (displayLg?.includes('flex'))

  return (
    <Component
      id={id}
      onClick={onClick}
      style={{
        ...style,
        top: top !== undefined ? (typeof top === 'number' ? `${top}px` : top) : undefined,
        right: right !== undefined ? (typeof right === 'number' ? `${right}px` : right) : undefined,
        bottom: bottom !== undefined ? (typeof bottom === 'number' ? `${bottom}px` : bottom) : undefined,
        left: left !== undefined ? (typeof left === 'number' ? `${left}px` : left) : undefined,
      }}
      className={cn(
        // Display & Flex
        displayBase && displayClasses[displayBase as keyof typeof displayClasses],
        displaySm && `sm:${displayClasses[displaySm as keyof typeof displayClasses]}`,
        displayMd && `md:${displayClasses[displayMd as keyof typeof displayClasses]}`,
        displayLg && `lg:${displayClasses[displayLg as keyof typeof displayClasses]}`,
        flexNeeded && !displayBase && !displayMd && !displayLg && 'flex',

        directionBase === 'col' ? 'flex-col' : directionBase === 'row' ? 'flex-row' : '',
        directionMd === 'col' ? 'md:flex-col' : directionMd === 'row' ? 'md:flex-row' : '',
        directionLg === 'col' ? 'lg:flex-col' : directionLg === 'row' ? 'lg:flex-row' : '',

        // Sizing
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        widthBase && widthClasses[widthBase as keyof typeof widthClasses],
        widthMd && `md:${widthClasses[widthMd as keyof typeof widthClasses]}`,
        widthLg && `lg:${widthClasses[widthLg as keyof typeof widthClasses]}`,
        height && heightClasses[height as keyof typeof heightClasses],
        minHeight === 'screen' && 'min-h-screen',
        minHeight === 100 && 'min-h-[100px]',

        flexBase !== undefined && flexClasses[flexBase as keyof typeof flexClasses],
        flexMd && `md:${flexClasses[flexMd as keyof typeof flexClasses]}`,
        flexLg && `lg:${flexClasses[flexLg as keyof typeof flexClasses]}`,
        flex1 && 'flex-1',
        shrink !== undefined && `shrink-${shrink}`,
        overflow && (typeof overflow === 'string' ? `overflow-${overflow}` : (overflow.base && `overflow-${overflow.base}`) || (overflow.md && `md:overflow-${overflow.md}`) || (overflow.lg && `lg:overflow-${overflow.lg}`)),
        overflowX && (typeof overflowX === 'string' ? `overflow-x-${overflowX}` : (overflowX.base && `overflow-x-${overflowX.base}`) || (overflowX.md && `md:overflow-x-${overflowX.md}`) || (overflowX.lg && `lg:overflow-x-${overflowX.lg}`)),
        overflowY && (typeof overflowY === 'string' ? `overflow-y-${overflowY}` : (overflowY.base && `overflow-y-${overflowY.base}`) || (overflowY.md && `md:overflow-y-${overflowY.md}`) || (overflowY.lg && `lg:overflow-y-${overflowY.lg}`)),
        noScrollbar && 'no-scrollbar',
        positionBase,
        positionMd && `md:${positionMd}`,
        positionLg && `lg:${positionLg}`,
        pinBase === 'left' ? 'left-0 top-0 bottom-0 right-auto' : pinBase === 'right' ? 'right-0 top-0 bottom-0 left-auto' : pinBase === 'top' ? 'top-0 left-0 right-0 bottom-auto' : pinBase === 'bottom' ? 'bottom-0 left-0 right-0 top-auto' : pinBase === 'inset' ? 'inset-0' : '',
        pinMd === 'left' ? 'md:left-0 md:top-0 md:bottom-0 md:right-auto' : pinMd === 'right' ? 'md:right-0 md:top-0 md:bottom-0 md:left-auto' : pinMd === 'top' ? 'md:top-0 md:left-0 md:right-0 md:bottom-auto' : pinMd === 'bottom' ? 'md:bottom-0 md:left-0 md:right-0 md:top-auto' : pinMd === 'inset' ? 'md:inset-0' : '',
        pinLg === 'left' ? 'lg:left-0 lg:top-0 lg:bottom-0 lg:right-auto' : pinLg === 'right' ? 'lg:right-0 lg:top-0 lg:bottom-0 lg:left-auto' : pinLg === 'top' ? 'lg:top-0 lg:left-0 lg:right-0 lg:bottom-auto' : pinLg === 'bottom' ? 'lg:bottom-0 lg:left-0 lg:right-0 lg:top-auto' : pinLg === 'inset' ? 'lg:inset-0' : '',
        zIndex !== undefined && zIndexClasses[zIndex as keyof typeof zIndexClasses],

        inset !== undefined && insetClasses[inset as keyof typeof insetClasses],

        // Borders & Opacity
        border && (borderWidth === 2 ? 'border-2' : 'border'),
        truncate && 'truncate',
        breakAll && 'break-all',
        borderColor && (
          borderColor.startsWith('#') || borderColor.startsWith('rgb') || borderColor.startsWith('hsl')
            ? `border-[${borderColor}]`
            : `border-${borderColor}`
        ),
        hoverBorder && (
          hoverBorder.startsWith('#') || hoverBorder.startsWith('rgb') || hoverBorder.startsWith('hsl')
            ? `hover:border-[${hoverBorder}]`
            : `hover:border-${hoverBorder}`
        ),
        rotate !== undefined && rotateClasses[rotate as keyof typeof rotateClasses],
        maxWidthBase && maxWidthClasses[maxWidthBase as keyof typeof maxWidthClasses],
        maxWidthSm && `sm:${maxWidthClasses[maxWidthSm as keyof typeof maxWidthClasses]}`,
        maxWidthMd && `md:${maxWidthClasses[maxWidthMd as keyof typeof maxWidthClasses]}`,
        maxWidthLg && `lg:${maxWidthClasses[maxWidthLg as keyof typeof maxWidthClasses]}`,
        minWidth !== undefined && minWidthClasses[minWidth as keyof typeof minWidthClasses],
        opacity !== undefined && opacityClasses[opacity],
        groupHoverOpacity !== undefined && groupHoverOpacityClasses[groupHoverOpacity],
        backdropBlur && `backdrop-blur-${backdropBlur}`,
        group && 'group',
        transition && 'transition-all duration-500 ease-out',

        // Animations/Transforms
        translateXBase === 'full' && 'translate-x-full',
        translateXBase === 'none' && 'translate-x-0',
        translateXLg === 'full' && 'lg:translate-x-full',
        translateXLg === 'none' && 'lg:translate-x-0',
        groupHoverDisplay === 'flex' && 'lg:group-hover:flex',
        groupHoverDisplay === 'block' && 'lg:group-hover:block',
        groupHoverDisplay === 'none' && 'lg:group-hover:hidden',
        groupHoverTranslateX === 0 && 'lg:group-hover:translate-x-0',
        groupHoverTranslateX === -180 && 'lg:group-hover:-translate-x-[180px]',
        groupHoverTranslateX === -240 && 'lg:group-hover:-translate-x-[240px]',
        hoverScale === 105 && 'hover:scale-105',
        groupHoverScale === 110 && 'group-hover:scale-110',
        groupHoverScale === 105 && 'group-hover:scale-105',
        activeScale === 95 && 'active:scale-95',
        activeScale === 90 && 'active:scale-90',
        colSpan === 1 && 'col-span-1',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 4 && 'col-span-4',
        colSpan === 5 && 'col-span-5',
        colSpan === 6 && 'col-span-6',
        colSpan === 7 && 'col-span-7',
        colSpan === 8 && 'col-span-8',
        colSpan === 9 && 'col-span-9',
        colSpan === 10 && 'col-span-10',
        colSpan === 12 && 'col-span-12',
        lgColSpan === 1 && 'lg:col-span-1',
        lgColSpan === 2 && 'lg:col-span-2',
        lgColSpan === 3 && 'lg:col-span-3',
        lgColSpan === 4 && 'lg:col-span-4',
        lgColSpan === 5 && 'lg:col-span-5',
        lgColSpan === 6 && 'lg:col-span-6',
        lgColSpan === 7 && 'lg:col-span-7',
        lgColSpan === 8 && 'lg:col-span-8',
        lgColSpan === 9 && 'lg:col-span-9',
        lgColSpan === 10 && 'lg:col-span-10',
        lgColSpan === 12 && 'lg:col-span-12',
        grayscale && 'grayscale',
        cursor && `cursor-${cursor}`,
        textAlign && `text-${textAlign}`,
        wrap === 'wrap' && 'flex-wrap',
        wrap === 'nowrap' && 'flex-nowrap',
        focusWithinZIndex === 10 && 'focus-within:z-10',
        focusWithinZIndex === 50 && 'focus-within:z-50',
        focusWithinZIndex === 100 && 'focus-within:z-100',
        focusWithinZIndex === 1000 && 'focus-within:z-[1000]',
        animation === 'in-fade-zoom' && 'animate-in fade-in zoom-in duration-500',
        animation === 'bounce' && 'animate-bounce',
        animation === 'pulse' && 'animate-pulse',

        // Alignment
        alignBase && `items-${alignBase}`,
        alignMd && `md:items-${alignMd}`,
        alignLg && `lg:items-${alignLg}`,
        justifyBase && `justify-${justifyBase === 'between' ? 'between' : justifyBase}`,
        justifyMd && `md:justify-${justifyMd === 'between' ? 'between' : justifyMd}`,
        justifyLg && `lg:justify-${justifyLg === 'between' ? 'between' : justifyLg}`,

        // Semantic Variants
        variant === 'skeleton' && 'bg-zinc-950 border border-white/10 border-dashed',
        variant === 'liquid-success' && 'bg-emerald-500/5 border border-[oklch(0.696_0.17_162.48_/_0.8)]',
        variant === 'liquid-zinc' && 'bg-zinc-500/5 border border-zinc-500/20',
        rounded && roundedClasses[rounded],

        // Background Mapping
        bg && colorMapping[bg][bgOpacity],

        // Controlled Padding
        paddingBase !== undefined && paddingMapping[paddingBase as keyof typeof paddingMapping],
        paddingSm !== undefined && `sm:${paddingMapping[paddingSm as keyof typeof paddingMapping]}`,
        paddingMd !== undefined && `md:${paddingMapping[paddingMd as keyof typeof paddingMapping]}`,
        paddingLg !== undefined && `lg:${paddingMapping[paddingLg as keyof typeof paddingMapping]}`,

        paddingXBase !== undefined && paddingXMapping[paddingXBase as keyof typeof paddingXMapping],
        paddingXSm !== undefined && `sm:${paddingXMapping[paddingXSm as keyof typeof paddingXMapping]}`,
        paddingXMd !== undefined && `md:${paddingXMapping[paddingXMd as keyof typeof paddingXMapping]}`,
        paddingXLg !== undefined && `lg:${paddingXMapping[paddingXLg as keyof typeof paddingXMapping]}`,

        paddingYBase !== undefined && paddingYMapping[paddingYBase as keyof typeof paddingYMapping],
        paddingYSm !== undefined && `sm:${paddingYMapping[paddingYSm as keyof typeof paddingYMapping]}`,
        paddingYMd !== undefined && `md:${paddingYMapping[paddingYMd as keyof typeof paddingYMapping]}`,
        paddingYLg !== undefined && `lg:${paddingYMapping[paddingYLg as keyof typeof paddingYMapping]}`,

        paddingTopBase !== undefined && paddingTopMapping[paddingTopBase as keyof typeof paddingTopMapping],
        paddingTopSm !== undefined && `sm:${paddingTopMapping[paddingTopSm as keyof typeof paddingTopMapping]}`,
        paddingTopMd !== undefined && `md:${paddingTopMapping[paddingTopMd as keyof typeof paddingTopMapping]}`,
        paddingTopLg !== undefined && `lg:${paddingTopMapping[paddingTopLg as keyof typeof paddingTopMapping]}`,

        paddingBottomBase !== undefined && paddingBottomMapping[paddingBottomBase as keyof typeof paddingBottomMapping],
        paddingBottomSm !== undefined && `sm:${paddingBottomMapping[paddingBottomSm as keyof typeof paddingBottomMapping]}`,
        paddingBottomMd !== undefined && `md:${paddingBottomMapping[paddingBottomMd as keyof typeof paddingBottomMapping]}`,
        paddingBottomLg !== undefined && `lg:${paddingBottomMapping[paddingBottomLg as keyof typeof paddingBottomMapping]}`,

        paddingLeftBase !== undefined && paddingLeftMapping[paddingLeftBase as keyof typeof paddingLeftMapping],
        paddingLeftSm !== undefined && `sm:${paddingLeftMapping[paddingLeftSm as keyof typeof paddingLeftMapping]}`,
        paddingLeftMd !== undefined && `md:${paddingLeftMapping[paddingLeftMd as keyof typeof paddingLeftMapping]}`,
        paddingLeftLg !== undefined && `lg:${paddingLeftMapping[paddingLeftLg as keyof typeof paddingLeftMapping]}`,

        paddingRightBase !== undefined && paddingRightMapping[paddingRightBase as keyof typeof paddingRightMapping],
        paddingRightSm !== undefined && `sm:${paddingRightMapping[paddingRightSm as keyof typeof paddingRightMapping]}`,
        paddingRightMd !== undefined && `md:${paddingRightMapping[paddingRightMd as keyof typeof paddingRightMapping]}`,
        paddingRightLg !== undefined && `lg:${paddingRightMapping[paddingRightLg as keyof typeof paddingRightMapping]}`,

        // Gap mapping
        gapBase !== undefined && gapMapping[gapBase as keyof typeof gapMapping],
        gapMd !== undefined && gapMdMapping[gapMd as keyof typeof gapMdMapping],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

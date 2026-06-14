'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'

export type SpacingToken = 'container' | 'element' | 'section' | 'empty_state' | 'tiny' | 'none' | 'dashboard_pc' | 'safe_area' | 'title-content' | 'header-gap'

export type BoxColor = 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'white' | 'transparent' | 'black' | 'primary' | 'success' | 'warning' | 'neutral'

export interface BoxProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'color' | 'className' | 'style' | 'as' | 'width' | 'height' | 'type' | 'span' | 'wrap' | 'size' | 'translate'> {
  children?: React.ReactNode
  as?: 'div' | 'aside' | 'nav' | 'main' | 'section' | 'header' | 'footer' | 'button' | 'img' | 'input' | 'label' | 'span' | 'video' | 'form' | 'a'
  padding?: SpacingToken | { base: SpacingToken, md?: SpacingToken, lg?: SpacingToken }
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | { base: 'start' | 'center' | 'end' | 'stretch' | 'baseline', sm?: 'start' | 'center' | 'end' | 'stretch' | 'baseline', md?: 'start' | 'center' | 'end' | 'stretch' | 'baseline', lg?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' }
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | { base: 'start' | 'center' | 'end' | 'between' | 'around', sm?: 'start' | 'center' | 'end' | 'between' | 'around', md?: 'start' | 'center' | 'end' | 'between' | 'around', lg?: 'start' | 'center' | 'end' | 'between' | 'around' }
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex' | 'none' | { base: 'flex' | 'grid' | 'block' | 'none', sm?: 'flex' | 'grid' | 'block' | 'none', md?: 'flex' | 'grid' | 'block' | 'none', lg?: 'flex' | 'grid' | 'block' | 'none' }
  direction?: 'row' | 'col' | { base: 'row' | 'col', sm?: 'row' | 'col', md?: 'row' | 'col', lg?: 'row' | 'col' }
  position?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky' | { base: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky', sm?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky', md?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky', lg?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky' }
  pin?: 'left' | 'right' | 'top' | 'bottom' | 'inset' | { base: 'left' | 'right' | 'top' | 'bottom' | 'inset', md?: 'left' | 'right' | 'top' | 'bottom' | 'inset', lg?: 'left' | 'right' | 'top' | 'bottom' | 'inset' }
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' | 'landing' | { base: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' | 'landing', md?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' | 'landing', lg?: 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'auth-form' | 'landing' }
  width?: 'full' | 'auto' | 'px' | 'half' | '1/3' | '2/3' | 'sidebar' | 'sidebar-wide' | '10' | number | string | { base?: 'full' | 'auto' | '10' | number | string, sm?: 'full' | 'half' | '1/3' | '2/3' | 'auto' | '10' | 'sidebar' | 'sidebar-wide' | number | string, md?: 'full' | 'half' | '1/3' | '2/3' | 'auto' | '10' | 'sidebar' | 'sidebar-wide' | number | string, lg?: 'full' | 'auto' | 'half' | '1/3' | '2/3' | 'sidebar' | 'sidebar-wide' | '10' | number | string }
  height?: 'full' | 'auto' | 'screen' | 'px' | '10' | number | string | { base?: 'full' | 'auto' | 'screen' | 'px' | '10' | number | string, md?: 'full' | 'auto' | 'screen' | 'px' | '10' | number | string }
  minHeight?: 'screen' | 'full' | 'sm' | 'md' | 'lg' | 'xl' | number
  maxHeight?: number | string
  minWidth?: number | string | { base: number | string, sm?: number | string, md?: number | string, lg?: number | string }
  overflow?: 'hidden' | 'auto' | 'scroll' | 'visible' | { base: 'hidden' | 'auto' | 'scroll' | 'visible', md?: 'hidden' | 'auto' | 'scroll' | 'visible' }
  overflowX?: 'hidden' | 'auto' | 'scroll'
  overflowY?: 'hidden' | 'auto' | 'scroll'
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  shrink?: number | { base: number, md?: number, lg?: number }
  grow?: number
  aspectRatio?: 'square' | 'video' | 'portrait' | '3/4' | 'auto'
  alignSelf?: 'start' | 'center' | 'end' | 'stretch'
  flex?: 0 | 1 | 'none' | { base: 0 | 1 | 'none', md?: 0 | 1 | 'none', lg?: 0 | 1 | 'none' }
  flex1?: boolean | { base: boolean, md?: boolean, lg?: boolean }
  fullWidth?: boolean | { base?: boolean, sm?: boolean, md?: boolean, lg?: boolean }
  fullHeight?: boolean
  translateX?: 0 | '-full' | 'full' | { base: 0 | '-full' | 'full', md?: 0 | '-full' | 'full', lg?: 0 | '-full' | 'full' }
  translateY?: 0 | '-full' | 'full'
  noScrollbar?: boolean
  customScrollbar?: boolean
  truncate?: boolean
  breakAll?: boolean
  transition?: boolean
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 100 | 'auto'
  inset?: 0 | 2.5 | 5
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12
  mdColSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12
  lgColSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12
  cursor?: 'pointer' | 'default' | 'not-allowed'
  textAlign?: 'left' | 'center' | 'right' | { base: 'left' | 'center' | 'right', sm?: 'left' | 'center' | 'right', md?: 'left' | 'center' | 'right', lg?: 'left' | 'center' | 'right' }
  wrap?: 'wrap' | 'nowrap'
  gap?: SpacingToken | { base: SpacingToken, sm?: SpacingToken, md?: SpacingToken, lg?: SpacingToken }
  snap?: 'x' | 'y' | 'none'
  snapMandatory?: boolean
  scrollSmooth?: boolean
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 'first' | 'last' | 'none' | { base: 1 | 2 | 3 | 4 | 5 | 6 | 'first' | 'last' | 'none', md?: 1 | 2 | 3 | 4 | 5 | 6 | 'first' | 'last' | 'none', lg?: 1 | 2 | 3 | 4 | 5 | 6 | 'first' | 'last' | 'none' }
  className?: never
  id?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  style?: React.CSSProperties
  ref?: React.Ref<any>
  group?: boolean
  groupHoverDisplay?: 'flex' | 'grid' | 'block' | 'none'
  groupHoverOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  groupHoverScale?: 90 | 95 | 98 | 100 | 105 | 110
  groupHoverTranslateX?: 1 | 2 | 3 | 4 | 'full'
  disabled?: boolean
  bgGradient?: 'bottom-dark' | 'top-dark'
  bg?: BoxColor
  bgOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  borderOpacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  opacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100
  rounded?: 'none' | 'full' | 'system'
  backdropBlur?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  hoverBg?: BoxColor
  hoverBgOpacity?: 5 | 10 | 20 | 30 | 50 | 80 | 90 | 100
  border?: boolean
  borderWidth?: 2
  borderColor?: BoxColor | string
  type?: 'button' | 'submit' | 'reset'
  scale?: 90 | 95 | 100 | 105 | 110
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  pointerEvents?: 'none' | 'auto'
  hoverScale?: 90 | 95 | 98 | 100 | 105 | 110
  groupHoverBorderColor?: BoxColor | string
  animateIn?: 'fade' | 'zoom' | 'slide-right' | 'slide-down' | 'slide-left' | 'slide-up' | 'none'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

/**
 * Box: A minimal semantic wrapper primitive.
 * Now evolved to handle complex layout scaffolding with zero manual classes.
 */
export const Box = React.forwardRef<HTMLElement, BoxProps>(function Box({
  children,
  as: Component = 'div',
  padding,
  overflow,
  overflowX,
  overflowY,
  align,
  justify,
  display,
  direction,
  position,
  width,
  height,
  minHeight,
  shrink,
  grow,
  aspectRatio,
  flex,
  flex1,
  fullWidth,
  fullHeight,
  translateX,
  translateY,
  noScrollbar,
  customScrollbar,
  top,
  right,
  bottom,
  left,
  truncate,
  breakAll,
  colSpan,
  mdColSpan,
  lgColSpan,
  cursor,
  textAlign,
  wrap,
  transition,
  maxWidth,
  gap,
  pin,
  className,
  id,
  onClick,
  style,
  zIndex,
  inset,
  group,
  groupHoverDisplay,
  groupHoverOpacity,
  groupHoverScale,
  groupHoverTranslateX,
  disabled,
  bgGradient,
  bg,
  opacity,
  bgOpacity,
  rounded,
  backdropBlur,
  minWidth,
  alignSelf,
  hoverBg,
  hoverBgOpacity,
  maxHeight,
  border,
  borderWidth = 2,
  borderColor,
  borderOpacity,
  type,
  scale,
  shadow,
  pointerEvents,
  hoverScale,
  groupHoverBorderColor,
  animateIn,
  snap,
  snapMandatory,
  scrollSmooth,
  order,
  objectFit,
  ...props
}: BoxProps, ref) {
  const { primaryColor } = useRegistry()

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

  const bgOpacityClasses = {
    0: 'bg-opacity-0',
    10: 'bg-opacity-10',
    20: 'bg-opacity-20',
    30: 'bg-opacity-30',
    40: 'bg-opacity-40',
    50: 'bg-opacity-50',
    60: 'bg-opacity-60',
    70: 'bg-opacity-70',
    80: 'bg-opacity-80',
    90: 'bg-opacity-90',
    95: 'bg-opacity-95',
    100: 'bg-opacity-100'
  }

  const roundedClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    system: 'rounded-[5px]',
  }

  const borderOpacityClasses = {
    0: 'border-opacity-0',
    5: 'border-opacity-5',
    10: 'border-opacity-10',
    20: 'border-opacity-20',
    30: 'border-opacity-30',
    40: 'border-opacity-40',
    50: 'border-opacity-50',
    60: 'border-opacity-60',
    70: 'border-opacity-70',
    80: 'border-opacity-80',
    90: 'border-opacity-90',
    95: 'border-opacity-95',
    100: 'border-opacity-100'
  }

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
      100: primaryColor === 'orange' ? 'bg-orange-500' : primaryColor === 'emerald' ? 'bg-emerald-500' : primaryColor === 'blue' ? 'bg-blue-500' : primaryColor === 'red' ? 'bg-red-500' : primaryColor === 'amber' ? 'bg-amber-500' : 'bg-blue-500',
      95: primaryColor === 'orange' ? 'bg-orange-500/95' : primaryColor === 'emerald' ? 'bg-emerald-500/95' : primaryColor === 'blue' ? 'bg-blue-500/95' : primaryColor === 'red' ? 'bg-red-500/95' : primaryColor === 'amber' ? 'bg-amber-500/95' : 'bg-blue-500/95',
      90: primaryColor === 'orange' ? 'bg-orange-500/90' : primaryColor === 'emerald' ? 'bg-emerald-500/90' : primaryColor === 'blue' ? 'bg-blue-500/90' : primaryColor === 'red' ? 'bg-red-500/90' : primaryColor === 'amber' ? 'bg-amber-500/90' : 'bg-blue-500/90',
      80: primaryColor === 'orange' ? 'bg-orange-500/80' : primaryColor === 'emerald' ? 'bg-emerald-500/80' : primaryColor === 'blue' ? 'bg-blue-500/80' : primaryColor === 'red' ? 'bg-red-500/80' : primaryColor === 'amber' ? 'bg-amber-500/80' : 'bg-blue-500/80',
      50: primaryColor === 'orange' ? 'bg-orange-500/50' : primaryColor === 'emerald' ? 'bg-emerald-500/50' : primaryColor === 'blue' ? 'bg-blue-500/50' : primaryColor === 'red' ? 'bg-red-500/50' : primaryColor === 'amber' ? 'bg-amber-500/50' : 'bg-blue-500/50',
      30: primaryColor === 'orange' ? 'bg-orange-500/30' : primaryColor === 'emerald' ? 'bg-emerald-500/30' : primaryColor === 'blue' ? 'bg-blue-500/30' : primaryColor === 'red' ? 'bg-red-500/30' : primaryColor === 'amber' ? 'bg-amber-500/30' : 'bg-blue-500/30',
      20: primaryColor === 'orange' ? 'bg-orange-500/20' : primaryColor === 'emerald' ? 'bg-emerald-500/20' : primaryColor === 'blue' ? 'bg-blue-500/20' : primaryColor === 'red' ? 'bg-red-500/20' : primaryColor === 'amber' ? 'bg-amber-500/20' : 'bg-blue-500/20',
      10: primaryColor === 'orange' ? 'bg-orange-500/10' : primaryColor === 'emerald' ? 'bg-emerald-500/10' : primaryColor === 'blue' ? 'bg-blue-500/10' : primaryColor === 'red' ? 'bg-red-500/10' : primaryColor === 'amber' ? 'bg-amber-500/10' : 'bg-blue-500/10',
      5: primaryColor === 'orange' ? 'bg-orange-500/5' : primaryColor === 'emerald' ? 'bg-emerald-500/5' : primaryColor === 'blue' ? 'bg-blue-500/5' : primaryColor === 'red' ? 'bg-red-500/5' : primaryColor === 'amber' ? 'bg-amber-500/5' : 'bg-blue-500/5'
    },
    success: { 100: 'bg-success', 95: 'bg-success/95', 90: 'bg-success/90', 80: 'bg-success/80', 50: 'bg-success/50', 30: 'bg-success/30', 20: 'bg-success/20', 10: 'bg-success/10', 5: 'bg-success/5' },
    warning: { 100: 'bg-warning', 95: 'bg-warning/95', 90: 'bg-warning/90', 80: 'bg-warning/80', 50: 'bg-warning/50', 30: 'bg-warning/30', 20: 'bg-warning/20', 10: 'bg-warning/10', 5: 'bg-warning/5' },
    neutral: { 100: 'bg-neutral', 95: 'bg-neutral/95', 90: 'bg-neutral/90', 80: 'bg-neutral/80', 50: 'bg-neutral/50', 30: 'bg-neutral/30', 20: 'bg-neutral/20', 10: 'bg-neutral/10', 5: 'bg-neutral/5' }
  }

  const borderColorMapping: Record<BoxColor, Record<number, string>> = {
    orange: { 100: 'border-orange-500', 95: 'border-orange-500/95', 90: 'border-orange-500/90', 80: 'border-orange-500/80', 50: 'border-orange-500/50', 30: 'border-orange-500/30', 20: 'border-orange-500/20', 10: 'border-orange-500/10', 5: 'border-orange-500/5' },
    emerald: { 100: 'border-emerald-500', 95: 'border-emerald-500/95', 90: 'border-emerald-500/90', 80: 'border-emerald-500/80', 50: 'border-emerald-500/50', 30: 'border-emerald-500/30', 20: 'border-emerald-500/20', 10: 'border-emerald-500/10', 5: 'border-emerald-500/5' },
    amber: { 100: 'border-amber-500', 95: 'border-amber-500/95', 90: 'border-amber-500/90', 80: 'border-amber-500/80', 50: 'border-amber-500/50', 30: 'border-amber-500/30', 20: 'border-amber-500/20', 10: 'border-amber-500/10', 5: 'border-amber-500/5' },
    red: { 100: 'border-red-500', 95: 'border-red-500/95', 90: 'border-red-500/90', 80: 'border-red-500/80', 50: 'border-red-500/50', 30: 'border-red-500/30', 20: 'border-red-500/20', 10: 'border-red-500/10', 5: 'border-red-500/5' },
    blue: { 100: 'border-blue-500', 95: 'border-blue-500/95', 90: 'border-blue-500/90', 80: 'border-blue-500/80', 50: 'border-blue-500/50', 30: 'border-blue-500/30', 20: 'border-blue-500/20', 10: 'border-blue-500/10', 5: 'border-blue-500/5' },
    zinc: { 100: 'border-zinc-500', 95: 'border-zinc-500/95', 90: 'border-zinc-500/90', 80: 'border-zinc-500/80', 50: 'border-zinc-500/50', 30: 'border-zinc-500/30', 20: 'border-zinc-500/20', 10: 'border-zinc-500/10', 5: 'border-zinc-500/5' },
    white: { 100: 'border-white', 95: 'border-white/95', 90: 'border-white/90', 80: 'border-white/80', 50: 'border-white/50', 30: 'border-white/30', 20: 'border-white/20', 10: 'border-white/10', 5: 'border-white/5' },
    black: { 100: 'border-black', 95: 'border-black/95', 90: 'border-black/90', 80: 'border-black/80', 50: 'border-black/50', 30: 'border-black/30', 20: 'border-black/20', 10: 'border-black/10', 5: 'border-black/5' },
    transparent: { 100: 'border-transparent', 95: 'border-transparent', 90: 'border-transparent', 80: 'border-transparent', 50: 'border-transparent', 30: 'border-transparent', 20: 'border-transparent', 10: 'border-transparent', 5: 'border-transparent' },
    primary: {
      100: primaryColor === 'orange' ? 'border-orange-500' : primaryColor === 'emerald' ? 'border-emerald-500' : primaryColor === 'blue' ? 'border-blue-500' : primaryColor === 'red' ? 'border-red-500' : primaryColor === 'amber' ? 'border-amber-500' : 'border-blue-500',
      95: primaryColor === 'orange' ? 'border-orange-500/95' : primaryColor === 'emerald' ? 'border-emerald-500/95' : primaryColor === 'blue' ? 'border-blue-500/95' : primaryColor === 'red' ? 'border-red-500/95' : primaryColor === 'amber' ? 'border-amber-500/95' : 'border-blue-500/95',
      90: primaryColor === 'orange' ? 'border-orange-500/90' : primaryColor === 'emerald' ? 'border-emerald-500/90' : primaryColor === 'blue' ? 'border-blue-500/90' : primaryColor === 'red' ? 'border-red-500/90' : primaryColor === 'amber' ? 'border-amber-500/90' : 'border-blue-500/90',
      80: primaryColor === 'orange' ? 'border-orange-500/80' : primaryColor === 'emerald' ? 'border-emerald-500/80' : primaryColor === 'blue' ? 'border-blue-500/80' : primaryColor === 'red' ? 'border-red-500/80' : primaryColor === 'amber' ? 'border-amber-500/80' : 'border-blue-500/80',
      50: primaryColor === 'orange' ? 'border-orange-500/50' : primaryColor === 'emerald' ? 'border-emerald-500/50' : primaryColor === 'blue' ? 'border-blue-500/50' : primaryColor === 'red' ? 'border-red-500/50' : primaryColor === 'amber' ? 'border-amber-500/50' : 'border-blue-500/50',
      30: primaryColor === 'orange' ? 'border-orange-500/30' : primaryColor === 'emerald' ? 'border-emerald-500/30' : primaryColor === 'blue' ? 'border-blue-500/30' : primaryColor === 'red' ? 'border-red-500/30' : primaryColor === 'amber' ? 'border-amber-500/30' : 'border-blue-500/30',
      20: primaryColor === 'orange' ? 'border-orange-500/20' : primaryColor === 'emerald' ? 'border-emerald-500/20' : primaryColor === 'blue' ? 'border-blue-500/20' : primaryColor === 'red' ? 'border-red-500/20' : primaryColor === 'amber' ? 'border-amber-500/20' : 'border-blue-500/20',
      10: primaryColor === 'orange' ? 'border-orange-500/10' : primaryColor === 'emerald' ? 'border-emerald-500/10' : primaryColor === 'blue' ? 'border-blue-500/10' : primaryColor === 'red' ? 'border-red-500/10' : primaryColor === 'amber' ? 'border-amber-500/10' : 'border-blue-500/10',
      5: primaryColor === 'orange' ? 'border-orange-500/5' : primaryColor === 'emerald' ? 'border-emerald-500/5' : primaryColor === 'blue' ? 'border-blue-500/5' : primaryColor === 'red' ? 'border-red-500/5' : primaryColor === 'amber' ? 'border-amber-500/5' : 'border-blue-500/5'
    },
    success: { 100: 'border-emerald-500', 95: 'border-emerald-500/95', 90: 'border-emerald-500/90', 80: 'border-emerald-500/80', 50: 'border-emerald-500/50', 30: 'border-emerald-500/30', 20: 'border-emerald-500/20', 10: 'border-emerald-500/10', 5: 'border-emerald-500/5' },
    warning: { 100: 'border-orange-500', 95: 'border-orange-500/95', 90: 'border-orange-500/90', 80: 'border-orange-500/80', 50: 'border-orange-500/50', 30: 'border-orange-500/30', 20: 'border-orange-500/20', 10: 'border-orange-500/10', 5: 'border-orange-500/5' },
    neutral: { 100: 'border-zinc-500', 95: 'border-zinc-500/95', 90: 'border-zinc-500/90', 80: 'border-zinc-500/80', 50: 'border-zinc-500/50', 30: 'border-zinc-500/30', 20: 'border-zinc-500/20', 10: 'border-zinc-500/10', 5: 'border-zinc-500/5' }
  }

  const borderMapping: Record<BoxColor, string> = {
    orange: 'border-orange-500',
    emerald: 'border-emerald-500',
    amber: 'border-amber-500',
    red: 'border-red-500',
    blue: 'border-blue-500',
    zinc: 'border-zinc-500',
    white: 'border-white',
    black: 'border-black',
    transparent: 'border-transparent',
    primary: `border-${primaryColor}-500`,
    success: 'border-success',
    warning: 'border-warning',
    neutral: 'border-neutral'
  }

  const paddingMapping = {
    none: 'p-0',
    tiny: 'p-1',
    element: 'p-2.5',
    container: 'p-5',
    empty_state: 'p-[50px]',
    section: 'p-[100px]',
    dashboard_pc: 'p-20',
    safe_area: 'p-[100px]'
  }

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  }

  const mdColSpanClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
  }

  const lgColSpanClasses = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
  }

  const gapMapping = {
    none: 'gap-0',
    tiny: 'gap-1',
    element: 'gap-2.5',
    container: 'gap-5',
    empty_state: 'gap-[50px]',
    section: 'gap-[50px]',
    'title-content': 'gap-[30px]',
    dashboard_pc: 'gap-20',
    safe_area: 'gap-[100px]'
  }

  const widthClasses = {
    full: 'w-full',
    auto: 'w-auto',
    half: 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    px: 'w-px',
    'sidebar-wide': 'w-72',
    '10': 'w-10',
    'max-content': 'w-max',
    'min-content': 'w-min',
    'fit-content': 'w-fit',
    max: 'w-max',
    min: 'w-min',
    fit: 'w-fit'
  }

  const heightClasses = {
    full: 'h-full',
    auto: 'h-auto',
    screen: 'h-screen',
    px: 'h-px',
    '10': 'h-10'
  }

  const minHeightMapping = {
    screen: 'min-h-screen',
    full: 'min-h-full',
    sm: 'min-h-[200px]',
    md: 'min-h-[400px]',
    lg: 'min-h-[600px]',
    xl: 'min-h-[800px]'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    none: 'max-w-none',
    'auth-form': 'max-w-[440px]',
    'landing': 'max-w-[1300px]',
  }

  const zIndexClasses = {
    0: 'z-0',
    10: 'z-10',
    20: 'z-20',
    30: 'z-30',
    40: 'z-40',
    50: 'z-50',
    100: 'z-[100]',
    auto: 'z-auto'
  }

  const insetClasses = {
    0: 'inset-0',
    1: 'inset-1',
    2.5: 'inset-2.5',
    5: 'inset-5'
  }

  const flexClasses = {
    0: 'flex-none',
    1: 'flex-1',
    'none': 'flex-none'
  }

  const displayClasses = {
    flex: 'flex',
    grid: 'grid',
    block: 'block',
    'inline-block': 'inline-block',
    'inline-flex': 'inline-flex',
    none: 'hidden'
  }

  const translateXClasses = {
    0: 'translate-x-0',
    'full': 'translate-x-full',
    '-full': '-translate-x-full'
  }

  const translateXMdClasses = {
    0: 'md:translate-x-0',
    'full': 'md:translate-x-full',
    '-full': 'md:-translate-x-full'
  }

  const translateXLgClasses = {
    0: 'lg:translate-x-0',
    'full': 'lg:translate-x-full',
    '-full': 'lg:-translate-x-full'
  }

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none'
  }

  const pointerEventsClasses = {
    none: 'pointer-events-none',
    auto: 'pointer-events-auto'
  }

  const hoverScaleClasses = {
    90: 'hover:scale-90',
    95: 'hover:scale-95',
    98: 'hover:scale-[0.98]',
    100: 'hover:scale-100',
    105: 'hover:scale-105',
    110: 'hover:scale-110'
  }

  const groupHoverScaleClasses = {
    90: 'group-hover:scale-90',
    95: 'group-hover:scale-95',
    98: 'group-hover:scale-[0.98]',
    100: 'group-hover:scale-100',
    105: 'group-hover:scale-105',
    110: 'group-hover:scale-110'
  }

  const groupHoverTranslateXClasses = {
    1: 'group-hover:translate-x-1',
    2: 'group-hover:translate-x-2',
    3: 'group-hover:translate-x-3',
    4: 'group-hover:translate-x-4',
    'full': 'group-hover:translate-x-full'
  }

  const bgGradientClasses = {
    'bottom-dark': 'bg-gradient-to-t from-black via-black/60 to-transparent',
    'top-dark': 'bg-gradient-to-b from-black via-black/60 to-transparent'
  }

  const animateInClasses = {
    fade: 'animate-in fade-in duration-300',
    zoom: 'animate-in fade-in zoom-in duration-300',
    'slide-right': 'animate-in fade-in slide-in-from-right-4 duration-300',
    'slide-down': 'animate-in fade-in slide-in-from-top-4 duration-300',
    'slide-left': 'animate-in fade-in slide-in-from-left-4 duration-300',
    'slide-up': 'animate-in fade-in slide-in-from-bottom-4 duration-300',
    none: ''
  }

  const scaleClasses = {
    90: 'scale-90',
    95: 'scale-95',
    100: 'scale-100',
    105: 'scale-105',
    110: 'scale-110'
  }

  const orderClasses = {
    1: 'order-1',
    2: 'order-2',
    3: 'order-3',
    4: 'order-4',
    5: 'order-5',
    6: 'order-6',
    'first': 'order-first',
    'last': 'order-last',
    'none': 'order-none'
  }

  const orderMdClasses = {
    1: 'md:order-1',
    2: 'md:order-2',
    3: 'md:order-3',
    4: 'md:order-4',
    5: 'md:order-5',
    6: 'md:order-6',
    'first': 'md:order-first',
    'last': 'md:order-last',
    'none': 'md:order-none'
  }

  const orderLgClasses = {
    1: 'lg:order-1',
    2: 'lg:order-2',
    3: 'lg:order-3',
    4: 'lg:order-4',
    5: 'lg:order-5',
    6: 'lg:order-6',
    'first': 'lg:order-first',
    'last': 'lg:order-last',
    'none': 'lg:order-none'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  }

  const alignSmClasses = {
    start: 'sm:items-start',
    center: 'sm:items-center',
    end: 'sm:items-end',
    stretch: 'sm:items-stretch',
    baseline: 'sm:items-baseline'
  }

  const alignMdClasses = {
    start: 'md:items-start',
    center: 'md:items-center',
    end: 'md:items-end',
    stretch: 'md:items-stretch',
    baseline: 'md:items-baseline'
  }

  const alignLgClasses = {
    start: 'lg:items-start',
    center: 'lg:items-center',
    end: 'lg:items-end',
    stretch: 'lg:items-stretch',
    baseline: 'lg:items-baseline'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  const justifySmClasses = {
    start: 'sm:justify-start',
    center: 'sm:justify-center',
    end: 'sm:justify-end',
    between: 'sm:justify-between',
    around: 'sm:justify-around'
  }

  const justifyMdClasses = {
    start: 'md:justify-start',
    center: 'md:justify-center',
    end: 'md:justify-end',
    between: 'md:justify-between',
    around: 'md:justify-around'
  }

  const justifyLgClasses = {
    start: 'lg:justify-start',
    center: 'lg:justify-center',
    end: 'lg:justify-end',
    between: 'lg:justify-between',
    around: 'lg:justify-around'
  }

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const textAlignSmClasses = {
    left: 'sm:text-left',
    center: 'sm:text-center',
    right: 'sm:text-right'
  }

  const textAlignMdClasses = {
    left: 'md:text-left',
    center: 'md:text-center',
    right: 'md:text-right'
  }

  const textAlignLgClasses = {
    left: 'lg:text-left',
    center: 'lg:text-center',
    right: 'lg:text-right'
  }

  // Responsive logic
  const isRespFlex = typeof flex === 'object'
  const flexBase = isRespFlex ? (flex as any).base : flex
  const flexMd = isRespFlex ? (flex as any).md : undefined
  const flexLg = isRespFlex ? (flex as any).lg : undefined

  const isRespDisplay = typeof display === 'object'
  const displayBase = isRespDisplay ? (display as any).base : display
  const displayMd = isRespDisplay ? (display as any).md : undefined
  const displayLg = isRespDisplay ? (display as any).lg : undefined

  const isRespWidth = typeof width === 'object'
  const widthBase = isRespWidth ? (width as any).base : width
  const widthMd = isRespWidth ? (width as any).md : undefined
  const widthLg = isRespWidth ? (width as any).lg : undefined

  const isRespPadding = typeof padding === 'object'
  const paddingBase = isRespPadding ? (padding as any).base : padding
  const paddingMd = isRespPadding ? (padding as any).md : undefined
  const paddingLg = isRespPadding ? (padding as any).lg : undefined


  const isRespGap = typeof gap === 'object'
  let gapBase = isRespGap ? (gap as any).base : gap
  let gapMd = isRespGap ? (gap as any).md : undefined

  // Auto-responsive tokens
  if (gap === 'section' || gap === 'title-content') {
    gapBase = gap
    gapMd = gap
  }

  const isRespTranslateX = typeof translateX === 'object'
  const translateXBase = isRespTranslateX ? (translateX as any).base : translateX
  const translateXMd = isRespTranslateX ? (translateX as any).md : undefined
  const translateXLg = isRespTranslateX ? (translateX as any).lg : undefined

  const isRespMinWidth = typeof minWidth === 'object'
  const minWidthBase = isRespMinWidth ? (minWidth as any).base : minWidth
  const minWidthMd = isRespMinWidth ? (minWidth as any).md : undefined

  const isRespShrink = typeof shrink === 'object'
  const shrinkBase = isRespShrink ? (shrink as any).base : shrink
  const shrinkMd = isRespShrink ? (shrink as any).md : undefined
  const shrinkLg = isRespShrink ? (shrink as any).lg : undefined

  const isRespFlex1 = typeof flex1 === 'object'
  const flex1Base = isRespFlex1 ? (flex1 as any).base : flex1
  const flex1Md = isRespFlex1 ? (flex1 as any).md : undefined
  const flex1Lg = isRespFlex1 ? (flex1 as any).lg : undefined

  const flexNeeded = align || justify || direction || (displayBase?.includes('flex')) || (displayMd?.includes('flex')) || (displayLg?.includes('flex'))

  return (
    <Component
      ref={ref}
      id={id}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        top: typeof top === 'number' ? `${top}px` : top,
        right: typeof right === 'number' ? `${right}px` : right,
        bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
        left: typeof left === 'number' ? `${left}px` : left,
        flexGrow: grow,
        flexShrink: shrinkBase !== undefined ? (typeof shrinkBase === 'number' ? shrinkBase : (shrinkBase as any)) : undefined,
        aspectRatio: aspectRatio === 'square' ? '1/1' : aspectRatio === 'video' ? '16/9' : aspectRatio,
        ...(typeof minHeight === 'number' ? { minHeight: `${minHeight}px` } : {}),
        ...(typeof minWidthBase === 'number' ? { minWidth: `${minWidthBase}px` } : {}),
        ...(typeof width === 'number' ? { width: `${width}px` } : {}),
        ...(typeof height === 'number' ? { height: `${height}px` } : {}),
        ...(typeof maxHeight === 'number' ? { maxHeight: `${maxHeight}px` } : {}),
        ...(typeof maxHeight === 'string' ? { maxHeight: maxHeight } : {}),
        ...style
      }}
      className={cn(
        // Display & Flex
        displayBase && displayClasses[displayBase as keyof typeof displayClasses],
        displayMd && (
          displayMd === 'none' ? 'md:hidden' :
            displayMd === 'flex' ? 'md:flex' :
              displayMd === 'grid' ? 'md:grid' :
                displayMd === 'block' ? 'md:block' : ''
        ),
        displayLg && (
          displayLg === 'none' ? 'lg:hidden' :
            displayLg === 'flex' ? 'lg:flex' :
              displayLg === 'grid' ? 'lg:grid' :
                displayLg === 'block' ? 'lg:block' : ''
        ),
        flexNeeded && !displayBase && !displayMd && !displayLg && 'flex',

        direction === 'col' ? 'flex-col' : direction === 'row' ? 'flex-row' :
          typeof direction === 'object' && cn(
            (direction as any).base === 'col' ? 'flex-col' : (direction as any).base === 'row' ? 'flex-row' : '',
            (direction as any).md === 'col' ? 'md:flex-col' : (direction as any).md === 'row' ? 'md:flex-row' : '',
            (direction as any).lg === 'col' ? 'lg:flex-col' : (direction as any).lg === 'row' ? 'lg:flex-row' : ''
          ),

        // Sizing
        typeof fullWidth === 'boolean' ? (fullWidth && 'w-full') : cn(
          (fullWidth as any)?.base && 'w-full',
          (fullWidth as any)?.sm && 'sm:w-full',
          (fullWidth as any)?.md && 'md:w-full',
          (fullWidth as any)?.lg && 'lg:w-full',
          (fullWidth as any)?.sm === false && 'sm:w-auto',
          (fullWidth as any)?.md === false && 'md:w-auto',
          (fullWidth as any)?.lg === false && 'lg:w-auto'
        ),
        fullHeight && 'h-full',
        widthBase !== undefined && (
          typeof widthBase === 'string'
            ? (widthClasses[widthBase as keyof typeof widthClasses] || `w-[${widthBase.replace(/\s+/g, '')}]`)
            : (widthBase === 0 ? 'w-0' : `w-[${widthBase}px]`)
        ),
        widthMd !== undefined && (
          widthMd === 'full' ? 'md:w-full' :
            widthMd === 'half' ? 'md:w-1/2' :
              widthMd === '1/3' ? 'md:w-1/3' :
                widthMd === '2/3' ? 'md:w-2/3' :
                  widthMd === 'sidebar' ? 'md:w-56' :
                    widthMd === 'sidebar-wide' ? 'md:w-72' :
                      widthMd === 'auto' ? 'md:w-auto' :
                        typeof widthMd === 'number' ? (widthMd === 0 ? 'md:w-0' : `md:w-[${widthMd}px]`) : `md:w-[${String(widthMd).replace(/\s+/g, '')}]`
        ),
        widthLg !== undefined && (
          widthLg === 'full' ? 'lg:w-full' :
            widthLg === 'half' ? 'lg:w-1/2' :
              widthLg === '1/3' ? 'lg:w-1/3' :
                widthLg === '2/3' ? 'lg:w-2/3' :
                  widthLg === 'sidebar-wide' ? 'lg:w-72' :
                    widthLg === 'sidebar' ? 'lg:w-56' :
                      widthLg === 'auto' ? 'lg:w-auto' :
                        typeof widthLg === 'number' ? (widthLg === 0 ? 'lg:w-0' : `lg:w-[${widthLg}px]`) : `lg:w-[${String(widthLg).replace(/\s+/g, '')}]`
        ),
        minWidthBase !== undefined && (
          minWidthBase === 'auto' ? 'min-w-auto' :
            typeof minWidthBase === 'number' ? (minWidthBase === 0 ? 'min-w-0' : `min-w-[${minWidthBase}px]`) :
              `min-w-[${String(minWidthBase).replace(/\s+/g, '')}]`
        ),
        minWidthMd !== undefined && (
          minWidthMd === 'auto' ? 'md:min-w-auto' :
            typeof minWidthMd === 'number' ? (minWidthMd === 0 ? 'md:min-w-0' : `md:min-w-[${minWidthMd}px]`) :
              `md:min-w-[${String(minWidthMd).replace(/\s+/g, '')}]`
        ),
        height !== undefined && (
          typeof height === 'string'
            ? (heightClasses[height as keyof typeof heightClasses] || `h-[${height.replace(/\s+/g, '')}]`)
            : (height === 0 ? 'h-0' : `h-[${height}px]`)
        ),
        minHeight && typeof minHeight === 'string' && minHeightMapping[minHeight as keyof typeof minHeightMapping],

        flexBase !== undefined && flexClasses[flexBase as keyof typeof flexClasses],
        flexMd && (
          flexMd === 1 ? 'md:flex-1' :
            flexMd === 0 ? 'md:flex-none' :
              flexMd === 'none' ? 'md:flex-none' : ''
        ),
        flexLg && (
          flexLg === 1 ? 'lg:flex-1' :
            flexLg === 0 ? 'lg:flex-none' :
              flexLg === 'none' ? 'lg:flex-none' : ''
        ),
        flex1Base && 'flex-1',
        flex1Md && 'md:flex-1',
        flex1Md === false && 'md:flex-none',
        flex1Lg && 'lg:flex-1',
        flex1Lg === false && 'lg:flex-none',

        shrinkBase !== undefined && (typeof shrinkBase === 'number' ? `shrink-${shrinkBase}` : ''),
        shrinkMd !== undefined && (typeof shrinkMd === 'number' ? `md:shrink-${shrinkMd}` : ''),
        shrinkLg !== undefined && (typeof shrinkLg === 'number' ? `lg:shrink-${shrinkLg}` : ''),

        overflow && (typeof overflow === 'string' ? `overflow-${overflow}` : cn(
          overflow.base && `overflow-${overflow.base}`,
          overflow.md && `md:overflow-${overflow.md}`
        )),
        overflowX && `overflow-x-${overflowX}`,
        overflowY && `overflow-y-${overflowY}`,
        noScrollbar && 'no-scrollbar',
        snap === 'x' && 'snap-x',
        snap === 'y' && 'snap-y',
        snapMandatory && 'snap-mandatory',
        scrollSmooth && 'scroll-smooth',

        // Spacing (Responsive Support)
        paddingBase !== undefined && paddingMapping[paddingBase as keyof typeof paddingMapping],
        paddingMd && (
          paddingMd === 10 ? 'md:p-10' :
            paddingMd === 5 ? 'md:p-5' :
              paddingMd === 12.5 ? 'md:p-[50px]' :
                paddingMd === 'section' ? 'md:p-[100px]' : ''
        ),
        paddingLg && (
          paddingLg === 'section' ? 'lg:p-[100px]' : ''
        ),

        // Gap mapping
        gapBase !== undefined && gapMapping[gapBase as keyof typeof gapMapping],
        gapMd && (
          gapMd === 1 ? 'md:gap-1' :
            gapMd === 2.5 ? 'md:gap-2.5' :
              gapMd === 5 ? 'md:gap-5' :
                gapMd === 7.5 ? 'md:gap-[30px]' :
                  gapMd === 10 ? 'md:gap-10' :
                    gapMd === 12.5 ? 'md:gap-[50px]' :
                      gapMd === 'title-content' ? 'md:gap-[50px]' :
                        gapMd === 'section' ? 'md:gap-[100px]' : ''
        ),

        // Layout Misc
        position && (typeof position === 'string' ? position : (position as any).base),
        pin && (
          typeof pin === 'string' ? (pin === 'inset' ? 'inset-0' : `${pin}-0`) :
            cn(
              (pin as any).base === 'inset' ? 'inset-0' : (pin as any).base ? `${(pin as any).base}-0` : '',
              (pin as any).md === 'left' ? 'md:left-0' : (pin as any).md === 'right' ? 'md:right-0' : '',
              (pin as any).lg === 'left' ? 'lg:left-0' : (pin as any).lg === 'right' ? 'lg:right-0' : ''
            )
        ),
        zIndex !== undefined && zIndexClasses[zIndex as keyof typeof zIndexClasses],
        inset !== undefined && insetClasses[inset as keyof typeof insetClasses],
        truncate && 'truncate',
        breakAll && 'break-all',
        transition && 'transition-all duration-500 ease-out',
        colSpan && colSpanClasses[colSpan as keyof typeof colSpanClasses],
        mdColSpan && mdColSpanClasses[mdColSpan as keyof typeof mdColSpanClasses],
        lgColSpan && lgColSpanClasses[lgColSpan as keyof typeof lgColSpanClasses],
        cursor && `cursor-${cursor}`,
        textAlign && (typeof textAlign === 'string' ? `text-${textAlign}` : cn(
          textAlign.base && `text-${textAlign.base}`,
          textAlign.md && `md:text-${textAlign.md}`,
          textAlign.lg && `lg:text-${textAlign.lg}`
        )),
        wrap && `flex-${wrap}`,
        maxWidth && (typeof maxWidth === 'string' ? maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] : cn(
          (maxWidth as any).base && maxWidthClasses[(maxWidth as any).base as keyof typeof maxWidthClasses],
          (maxWidth as any).md && `md:${maxWidthClasses[(maxWidth as any).md as keyof typeof maxWidthClasses]}`,
          (maxWidth as any).lg && `lg:${maxWidthClasses[(maxWidth as any).lg as keyof typeof maxWidthClasses]}`
        )),
        group && 'group',
        groupHoverDisplay && (
          groupHoverDisplay === 'flex' ? 'group-hover:flex' :
            groupHoverDisplay === 'grid' ? 'group-hover:grid' :
              groupHoverDisplay === 'block' ? 'group-hover:block' :
                groupHoverDisplay === 'none' ? 'group-hover:hidden' : ''
        ),
        groupHoverOpacity !== undefined && `group-hover:${opacityClasses[groupHoverOpacity as keyof typeof opacityClasses]}`,
        groupHoverScale && groupHoverScaleClasses[groupHoverScale],
        groupHoverTranslateX && groupHoverTranslateXClasses[groupHoverTranslateX],

        bgGradient && bgGradientClasses[bgGradient],
        bg && colorMapping[bg][bgOpacity || 100],
        opacity !== undefined && opacityClasses[opacity as keyof typeof opacityClasses],
        rounded && roundedClasses[rounded],
        backdropBlur && (
          backdropBlur === 'none' ? 'backdrop-blur-none' :
            `backdrop-blur-${backdropBlur}`
        ),
        hoverBg && colorMapping[hoverBg][hoverBgOpacity || 100].replace('bg-', 'hover:bg-'),

        // Alignment
        align && (typeof align === 'string' ? alignClasses[align as keyof typeof alignClasses] : cn(
          align.base && alignClasses[align.base as keyof typeof alignClasses],
          align.sm && alignSmClasses[align.sm as keyof typeof alignSmClasses],
          align.md && alignMdClasses[align.md as keyof typeof alignMdClasses],
          align.lg && alignLgClasses[align.lg as keyof typeof alignLgClasses]
        )),
        alignSelf && `self-${alignSelf}`,
        justify && (typeof justify === 'string' ? justifyClasses[justify as keyof typeof justifyClasses] : cn(
          justify.base && justifyClasses[justify.base as keyof typeof justifyClasses],
          justify.sm && justifySmClasses[justify.sm as keyof typeof justifySmClasses],
          justify.md && justifyMdClasses[justify.md as keyof typeof justifyMdClasses],
          justify.lg && justifyLgClasses[justify.lg as keyof typeof justifyLgClasses]
        )),

        translateXBase !== undefined && translateXClasses[translateXBase as keyof typeof translateXClasses],
        translateXMd !== undefined && translateXMdClasses[translateXMd as keyof typeof translateXMdClasses],
        translateXLg !== undefined && translateXLgClasses[translateXLg as keyof typeof translateXLgClasses],
        
        order !== undefined && (typeof order === 'object' ? cn(
          order.base && orderClasses[order.base as keyof typeof orderClasses],
          order.md && orderMdClasses[order.md as keyof typeof orderMdClasses],
          order.lg && orderLgClasses[order.lg as keyof typeof orderLgClasses]
        ) : orderClasses[order as keyof typeof orderClasses]),

        textAlign && (typeof textAlign === 'string' ? textAlignClasses[textAlign as keyof typeof textAlignClasses] : cn(
          textAlign.base && textAlignClasses[textAlign.base as keyof typeof textAlignClasses],
          textAlign.sm && textAlignSmClasses[textAlign.sm as keyof typeof textAlignSmClasses],
          textAlign.md && textAlignMdClasses[textAlign.md as keyof typeof textAlignMdClasses],
          textAlign.lg && textAlignLgClasses[textAlign.lg as keyof typeof textAlignLgClasses]
        )),

        translateY === 'full' && 'translate-y-full',
        translateY === '-full' && '-translate-y-full',
        translateY === 0 && 'translate-y-0',
        customScrollbar && 'custom-scrollbar',

        border && 'border-2',
        border && !borderColor && 'border-white/5',
        border && borderColor && (
          borderColorMapping[borderColor as BoxColor]?.[borderOpacity || 100] ||
          (() => {
            const opacitySuffix = borderOpacity && borderOpacity !== 100 ? `/${borderOpacity}` : '';
            if (borderColor === 'primary') {
              if (primaryColor === 'orange') return `border-orange-500${opacitySuffix}`;
              if (primaryColor === 'emerald') return `border-emerald-500${opacitySuffix}`;
              if (primaryColor === 'blue') return `border-blue-500${opacitySuffix}`;
              if (primaryColor === 'red') return `border-red-500${opacitySuffix}`;
              if (primaryColor === 'amber') return `border-amber-500${opacitySuffix}`;
              return 'border-brand-primary';
            }
            if (borderColor === 'success') return `border-emerald-500${opacitySuffix}`;
            if (borderColor === 'warning') return `border-orange-500${opacitySuffix}`;
            if (borderColor === 'red') return `border-red-500${opacitySuffix}`;
            if (borderColor === 'blue') return `border-blue-500${opacitySuffix}`;
            if (borderColor === 'emerald') return `border-emerald-500${opacitySuffix}`;
            if (borderColor === 'orange') return `border-orange-500${opacitySuffix}`;
            if (borderColor === 'amber') return `border-amber-500${opacitySuffix}`;
            if (borderColor === 'zinc') return `border-zinc-500${opacitySuffix}`;
            if (borderColor === 'white') return `border-white${opacitySuffix}`;
            if (borderColor === 'black') return `border-black${opacitySuffix}`;
            if (borderColor.includes('/')) return `border-${borderColor}`;
            return `border-${borderColor}-500${opacitySuffix}`;
          })()
        ),

        shadow && shadowClasses[shadow],
        pointerEvents && pointerEventsClasses[pointerEvents],
        hoverScale && hoverScaleClasses[hoverScale],
        groupHoverScale && groupHoverScaleClasses[groupHoverScale],
        groupHoverBorderColor && (
          (() => {
            const opacitySuffix = borderOpacity && borderOpacity !== 100 ? `/${borderOpacity}` : '';
            let borderVal = '';
            if (groupHoverBorderColor === 'primary') {
              if (primaryColor === 'orange') borderVal = `orange-500${opacitySuffix}`;
              else if (primaryColor === 'emerald') borderVal = `emerald-500${opacitySuffix}`;
              else if (primaryColor === 'blue') borderVal = `blue-500${opacitySuffix}`;
              else if (primaryColor === 'red') borderVal = `red-500${opacitySuffix}`;
              else if (primaryColor === 'amber') borderVal = `amber-500${opacitySuffix}`;
              else borderVal = 'brand-primary';
            }
            else if (groupHoverBorderColor === 'success') borderVal = `emerald-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'warning') borderVal = `orange-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'red') borderVal = `red-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'blue') borderVal = `blue-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'emerald') borderVal = `emerald-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'orange') borderVal = `orange-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'amber') borderVal = `amber-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'zinc') borderVal = `zinc-500${opacitySuffix}`;
            else if (groupHoverBorderColor === 'white') borderVal = `white${opacitySuffix}`;
            else if (groupHoverBorderColor === 'black') borderVal = `black${opacitySuffix}`;
            else if (groupHoverBorderColor.includes('/')) borderVal = groupHoverBorderColor;
            else borderVal = `${groupHoverBorderColor}-500${opacitySuffix}`;

            return `group-hover:border-${borderVal}`;
          })()
        ),
        animateIn && animateInClasses[animateIn],
        scale && scaleClasses[scale],
        objectFit && `object-${objectFit}`,

        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})

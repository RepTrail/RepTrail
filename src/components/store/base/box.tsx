import React from 'react'
import { cn } from '@/lib/utils'

export interface BoxProps {
  children?: React.ReactNode
  as?: 'div' | 'aside' | 'nav' | 'main' | 'section' | 'header' | 'footer' | 'button' | 'img' | 'input' | 'label'
  padding?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  paddingX?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  paddingY?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  bg?: 'background' | 'secondary' | 'zinc-400' | 'zinc-500' | 'zinc-600' | 'zinc-700' | 'zinc-800' | 'zinc-850' | 'zinc-900' | 'zinc-950' | 'zinc-950/40' | 'zinc-900/40' | 'zinc-900/20' | 'white' | 'black' | 'brand-accent' | 'white/5' | 'white/10' | 'white/20' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'orange/10' | 'emerald/10' | 'red/10' | 'blue/10' | 'amber/10' | 'orange/20' | 'emerald/20' | 'red/20' | 'blue/20' | 'amber/20' | 'transparent'
  bgOpacity?: 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  group?: boolean
  display?: 'block' | 'flex' | 'grid' | 'none' | 'hidden'
  mdDisplay?: 'block' | 'flex' | 'grid' | 'none' | 'hidden'
  lgDisplay?: 'block' | 'flex' | 'grid' | 'none' | 'hidden'
  mdPaddingTop?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  safeBottom?: boolean
  blur?: 'sm' | 'md' | 'lg'
  transition?: 'all' | 'colors' | 'opacity' | 'transform'
  translateX?: '0' | 'full' | '-full'
  color?: 'foreground' | 'muted' | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'white' | 'black' | 'zinc-500' | 'zinc-600' | 'zinc-400' | 'zinc-700' | 'zinc-800' | 'zinc-700' | 'zinc-950' | 'transparent'
  border?: boolean | 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'white/5' | 'white/10' | 'zinc-900' | 'zinc-800' | 'zinc-700' | 'zinc-950' | 'transparent'
  borderTop?: boolean | 'white/5' | 'white/10' | 'zinc-900' | 'red' | 'emerald' | 'amber' | 'blue' | 'orange'
  borderBottom?: boolean | 'white/5' | 'white/10' | 'zinc-900' | 'red' | 'emerald' | 'amber' | 'blue' | 'orange'
  borderWidth?: 1 | 2
  borderStyle?: 'solid' | 'dashed'
  rounded?: 'none' | 'full' | 'system' | 'sm'
  overflow?: 'hidden' | 'visible' | 'auto'
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky'
  width?: 'full' | 'screen' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | '11/12' | '80' | '72' | '64' | '56' | '48' | '32' | '24' | '16' | '12' | '10' | '8' | '6' | '5' | '4' | '3.5' | '3' | '2.5' | '1' | 'px' | 'fit-content' | 'auto'
  mdWidth?: 'full' | 'screen' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | 'fit-content' | 'auto'
  height?: 'full' | 'screen' | '700' | '100' | '64' | '50' | '40' | '20' | '16' | '14' | '12' | '10' | '8' | '6' | '5' | '4' | '3.5' | '3' | '2.5' | '2' | '1' | 'px'
  shrink0?: boolean
  inset?: '0' | 'left-0-top-0' | 'left-0-bottom-0' | 'right-0-top-0' | 'top-0-right-0' | 'left-5-right-5-bottom-5' | 'left-4-top-1/2'
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 100 | 150 | 999 | 1000
  display?: 'flex' | 'block' | 'hidden' | 'lg-flex' | 'md-hidden' | 'md-flex'
  flexCol?: boolean
  flex1?: boolean
  truncate?: boolean
  gap?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32 | 'section' | 'title-content'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  colSpan?: 1 | 2 | 3 | 'full'
  aspectRatio?: 'square' | 'video'
  top?: 0 | 0.5 | 0.75 | 1 | 2 | 4 | 5
  right?: 0 | 0.5 | 0.75 | 1 | 2 | 4 | 5
  bottom?: 0 | 0.5 | 0.75 | 1 | 2 | 4 | 5
  left?: 0 | 0.5 | 0.75 | 1 | 2 | 4 | 5
  opacity?: 0 | 5 | 10 | 20 | 30 | 40 | 50 | 100
  shadow?: 'sm' | 'md' | 'lg' | 'emerald' | 'orange' | 'red' | 'blue' | 'amber'
  cursor?: 'pointer' | 'default'
  hoverBg?: 'white/5' | 'zinc-800' | 'zinc-900' | 'orange/20'
  paddingTop?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  paddingBottom?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  paddingLeft?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  paddingRight?: 0 | 1 | 1.5 | 2 | 2.5 | 4 | 5 | 10 | 12.5 | 20 | 32
  lgPaddingLeft?: 0 | 72
  lgPaddingTop?: 0 | 20
  lgPaddingBottom?: 0 | 32
  scrollbar?: 'custom' | 'hidden'
  visibility?: 'visible' | 'invisible'
  pointerEvents?: 'none' | 'auto'
  groupHoverTranslateX?: 0 | 10 | -10 | 32 | -32
  groupHoverOpacity?: 0 | 100
  groupHoverVisible?: boolean
  groupHoverPointerEvents?: 'none' | 'auto'
  className?: string // Used internally for custom cases like "custom-scrollbar"
  id?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Box({
  children,
  as: Component = 'div',
  padding,
  paddingX,
  paddingY,
  bg = 'transparent',
  bgOpacity,
  group,
  border,
  borderTop,
  borderBottom,
  borderWidth,
  borderStyle,
  rounded = 'none',
  overflow = 'visible',
  position,
  width,
  mdWidth,
  height,
  shrink0,
  inset,
  zIndex,
  display,
  flexCol,
  flex1,
  truncate,
  gap,
  align,
  justify,
  colSpan,
  aspectRatio,
  top,
  right,
  bottom,
  left,
  opacity,
  shadow,
  cursor,
  hoverBg,
  mdPaddingTop,
  paddingTop,
  paddingBottom,
  lgPaddingLeft,
  lgPaddingTop,
  lgPaddingBottom,
  safeBottom,
  blur,
  transition,
  translateX,
  color,
  scrollbar,
  visibility,
  pointerEvents,
  groupHoverTranslateX,
  groupHoverOpacity,
  groupHoverVisible,
  groupHoverPointerEvents,
  className,
  id,
  onClick,
  style
}: BoxProps) {
  return (
    <Component
      id={id}
      onClick={onClick}
      style={style}
      className={cn(
        // Core Layout
        display === 'flex' && 'flex',
        display === 'block' && 'block',
        display === 'hidden' && 'hidden',
        display === 'lg-flex' && 'hidden lg:flex',
        display === 'md-hidden' && 'flex md:hidden',
        display === 'md-flex' && 'hidden md:flex',
        flexCol && 'flex-col',
        flex1 && 'flex-1',
        shrink0 && 'shrink-0',
        truncate && 'truncate',
        scrollbar === 'custom' && 'custom-scrollbar',
        scrollbar === 'hidden' && 'no-scrollbar',
        group && 'group',

        position === 'fixed' && 'fixed',
        position === 'absolute' && 'absolute',
        position === 'relative' && 'relative',
        position === 'sticky' && 'sticky',

        inset === '0' && 'inset-0',
        inset === 'left-0-top-0' && 'left-0 top-0',
        inset === 'left-0-bottom-0' && 'left-0 bottom-0',
        inset === 'right-0-top-0' && 'right-0 top-0',
        inset === 'top-0-right-0' && 'top-0 right-0',
        inset === 'left-5-right-5-bottom-5' && 'left-5 right-5 bottom-5',
        inset === 'left-4-top-1/2' && 'left-4 top-1/2',

        zIndex === 10 && 'z-10',
        zIndex === 20 && 'z-20',
        zIndex === 30 && 'z-30',
        zIndex === 40 && 'z-40',
        zIndex === 50 && 'z-50',
        zIndex === 60 && 'z-60',
        zIndex === 100 && 'z-[100]',
        zIndex === 150 && 'z-[150]',
        zIndex === 999 && 'z-[999]',
        zIndex === 1000 && 'z-[1000]',

        // Dimensions
        width === 'full' && 'w-full',
        width === 'screen' && 'w-screen',
        width === '2/3' && 'w-2/3',
        width === '1/2' && 'w-1/2',
        width === '1/3' && 'w-1/3',
        width === '1/4' && 'w-1/4',
        width === '3/4' && 'w-3/4',
        width === '11/12' && 'w-11/12',
        width === '80' && 'w-80',
        width === '72' && 'w-72',
        width === '64' && 'w-64',
        width === '56' && 'w-56',
        width === '48' && 'w-48',
        width === '32' && 'w-32',
        width === '24' && 'w-24',
        width === '16' && 'w-16',
        width === '12' && 'w-12',
        width === '10' && 'w-10',
        width === '8' && 'w-8',
        width === '6' && 'w-6',
        width === '5' && 'w-5',
        width === '4' && 'w-4',
        width === '3.5' && 'w-3.5',
        width === '3' && 'w-3',
        width === '2.5' && 'w-2.5',
        width === '1' && 'w-1',
        width === 'fit-content' && 'w-fit',
        width === 'auto' && 'w-auto',

        // Responsive Width
        mdWidth === 'full' && 'md:w-full',
        mdWidth === 'screen' && 'md:w-screen',
        mdWidth === '1/2' && 'md:w-1/2',
        mdWidth === '1/3' && 'md:w-1/3',
        mdWidth === '1/4' && 'md:w-1/4',
        mdWidth === '2/3' && 'md:w-2/3',
        mdWidth === '3/4' && 'md:w-3/4',
        mdWidth === 'fit-content' && 'md:w-fit',
        mdWidth === 'auto' && 'md:w-auto',
        width === 'px' && 'w-px',

        height === 'full' && 'h-full',
        height === 'screen' && 'h-screen',
        height === '700' && 'h-[700px]',
        height === '100' && 'h-[100px]',
        height === '64' && 'h-64',
        height === '50' && 'h-[50px]',
        height === '40' && 'h-40',
        height === '20' && 'h-20',
        height === '16' && 'h-16',
        height === '14' && 'h-14',
        height === '12' && 'h-12',
        height === '10' && 'h-10',
        height === '8' && 'h-8',
        height === '6' && 'h-6',
        height === '5' && 'h-5',
        height === '4' && 'h-4',
        height === '3.5' && 'h-3.5',
        height === '3' && 'h-3',
        height === '2.5' && 'h-2.5',
        height === '2' && 'h-2',
        height === '1' && 'h-1',
        height === 'px' && 'h-[1px]',

        // Align/Justify
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        justify === 'around' && 'justify-around',

        // Backgrounds with Opacity
        bg === 'orange' && (!bgOpacity ? 'bg-orange-500' : `bg-orange-500/${bgOpacity}`),
        bg === 'emerald' && (!bgOpacity ? 'bg-emerald-500' : `bg-emerald-500/${bgOpacity}`),
        bg === 'red' && (!bgOpacity ? 'bg-red-500' : `bg-red-500/${bgOpacity}`),
        bg === 'blue' && (!bgOpacity ? 'bg-blue-500' : `bg-blue-500/${bgOpacity}`),
        bg === 'amber' && (!bgOpacity ? 'bg-amber-500' : `bg-amber-500/${bgOpacity}`),
        bg === 'white' && (!bgOpacity ? 'bg-white' : `bg-white/${bgOpacity}`),
        bg === 'black' && (!bgOpacity ? 'bg-black' : `bg-black/${bgOpacity}`),
        bg === 'brand-accent' && 'bg-orange-600',
        bg === 'zinc-400' && 'bg-zinc-400',
        color === 'zinc-500' && 'text-zinc-500',
        color === 'zinc-400' && 'text-zinc-400',
        color === 'zinc-600' && 'text-zinc-600',
        color === 'zinc-700' && 'text-zinc-700',
        color === 'zinc-800' && 'text-zinc-800',
        color === 'black' && 'text-black',
        color === 'white' && 'text-white',
        bg === 'zinc-600' && 'bg-zinc-600',
        bg === 'zinc-700' && 'bg-zinc-700',
        bg === 'zinc-800' && 'bg-surface-800',
        bg === 'zinc-900' && 'bg-surface-900',
        bg === 'zinc-950' && 'bg-surface-950',
        bg === 'zinc-950/40' && 'bg-zinc-950/40',
        bg === 'zinc-900/40' && 'bg-zinc-900/40',
        bg === 'zinc-900/20' && 'bg-zinc-900/20',
        bg === 'orange/20' && 'bg-orange-500/20',
        bg === 'emerald/20' && 'bg-emerald-500/20',
        bg === 'amber/20' && 'bg-amber-500/20',
        bg === 'red/20' && 'bg-red-500/20',
        bg === 'blue/20' && 'bg-blue-500/20',
        bg === 'white/5' && 'bg-white/5',
        bg === 'white/10' && 'bg-white/10',
        bg === 'background' && 'bg-background',
        bg === 'secondary' && 'bg-secondary',
        bg === 'transparent' && 'bg-transparent',
        bgOpacity === 100 && 'bg-opacity-100',

        // Paddings
        padding === 1 && 'p-1',
        padding === 1.5 && 'p-1.5',
        padding === 2.5 && 'p-2.5',
        padding === 5 && 'p-5',
        padding === 10 && 'p-10',
        padding === 0 && 'p-0',
        paddingX === 1 && 'px-1',
        paddingX === 1.5 && 'px-1.5',
        paddingX === 2.5 && 'px-2.5',
        paddingX === 5 && 'px-5',
        paddingX === 10 && 'px-10',
        paddingX === 0 && 'px-0',
        paddingY === 1 && 'py-1',
        paddingY === 1.5 && 'py-1.5',
        paddingY === 2.5 && 'py-2.5',
        paddingY === 5 && 'py-5',
        paddingY === 10 && 'py-10',
        paddingY === 0 && 'py-0',

        // Gap (only for flex)
        gap === 1 && 'gap-1',
        gap === 1.5 && 'gap-1.5',
        gap === 2.5 && 'gap-2.5',
        gap === 5 && 'gap-5',
        gap === 10 && 'gap-10',
        gap === 12.5 && 'gap-[50px]',
        gap === 0 && 'gap-0',
        gap === 'section' && 'gap-[50px]',
        gap === 'title-content' && 'gap-2.5',

        // Borders
        border === true && 'border border-border',
        border === 'orange' && 'border border-orange-500/30',
        border === 'emerald' && 'border border-emerald-500/30',
        border === 'red' && 'border border-red-500/30',
        border === 'blue' && 'border border-blue-500/30',
        border === 'amber' && 'border border-amber-500/30',
        border === 'white/5' && 'border border-white/5',
        border === 'white/10' && 'border border-white/10',
        border === 'zinc-900' && 'border border-zinc-900',
        border === 'zinc-800' && 'border border-zinc-800',
        border === 'zinc-700' && 'border border-zinc-700',
        border === 'zinc-950' && 'border border-zinc-950',
        borderTop === true && 'border-t border-border',
        borderTop === 'white/5' && 'border-t border-white/5',
        borderTop === 'red' && 'border-t border-red-500/30',
        borderBottom === true && 'border-b border-border',
        borderBottom === 'white/5' && 'border-b border-white/5',
        borderBottom === 'red' && 'border-b border-red-500/30',
        borderStyle === 'dashed' && 'border-dashed',
        borderWidth === 2 && 'border-2',

        // Overflow
        overflow === 'hidden' && 'overflow-hidden',
        overflow === 'auto' && 'overflow-auto',

        // Radius
        (rounded === 'system' || rounded === 'sm') && 'rounded-[5px]',
        rounded === 'full' && 'rounded-full',
        rounded === 'none' && 'rounded-none',

        // Grid
        colSpan === 1 && 'col-span-1',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 'full' && 'col-span-full',
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === 'video' && 'aspect-video',

        // Absolute Pos
        top === 0 && 'top-0',
        top === 0.5 && 'top-0.5',
        top === 0.75 && 'top-[3px]',
        top === 1 && 'top-1',
        top === 2 && 'top-2',
        top === 4 && 'top-4',
        top === 5 && 'top-5',

        right === 0 && 'right-0',
        right === 0.5 && 'right-0.5',
        right === 0.75 && 'right-[3px]',
        right === 1 && 'right-1',
        right === 2 && 'right-2',
        right === 4 && 'right-4',
        right === 5 && 'right-5',

        bottom === 0 && 'bottom-0',
        bottom === 0.5 && 'bottom-0.5',
        bottom === 0.75 && 'bottom-[3px]',
        bottom === 1 && 'bottom-1',
        bottom === 2 && 'bottom-2',
        bottom === 4 && 'bottom-4',
        bottom === 5 && 'bottom-5',

        left === 0 && 'left-0',
        left === 0.5 && 'left-0.5',
        left === 0.75 && 'left-[3px]',
        left === 1 && 'left-1',
        left === 2 && 'left-2',
        left === 4 && 'left-4',
        left === 5 && 'left-5',

        // Opacity
        opacity === 0 && 'opacity-0',
        typeof opacity === 'number' && opacity > 0 && `opacity-${opacity}`,

        // Visual Effects
        blur === 'sm' && 'backdrop-blur-sm',
        blur === 'md' && 'backdrop-blur-md',
        blur === 'lg' && 'backdrop-blur-lg',
        shadow === 'sm' && 'shadow-sm',
        shadow === 'md' && 'shadow-md',
        shadow === 'lg' && 'shadow-lg',
        shadow === 'orange' && 'shadow-lg shadow-orange-500/40',
        shadow === 'red' && 'shadow-lg shadow-red-500/40',
        shadow === 'emerald' && 'shadow-lg shadow-emerald-500/50',
        shadow === 'blue' && 'shadow-lg shadow-blue-500/40',
        shadow === 'amber' && 'shadow-lg shadow-amber-500/40',

        // Interactivity
        cursor === 'pointer' && 'cursor-pointer',
        hoverBg === 'white/5' && 'hover:bg-white/5 transition-colors',
        hoverBg === 'zinc-900' && 'hover:bg-zinc-900 transition-colors',

        // Responsive & Misc
        mdPaddingTop === 5 && 'md:pt-5',
        mdPaddingTop === 12.5 && 'md:pt-[50px]',
        mdPaddingTop === 20 && 'md:pt-20',

        paddingTop === 1.5 && 'pt-1.5',
        paddingTop === 2.5 && 'pt-2.5',
        paddingTop === 5 && 'pt-5',
        paddingTop === 10 && 'pt-10',
        paddingTop === 12.5 && 'pt-[50px]',
        paddingTop === 20 && 'pt-20',
        paddingTop === 0 && 'pt-0',
        paddingBottom === 32 && 'pb-32',
        paddingBottom === 0 && 'pb-0',
        lgPaddingLeft === 72 && 'lg:pl-72',
        lgPaddingLeft === 0 && 'lg:pl-0',
        lgPaddingTop === 20 && 'lg:pt-20',
        lgPaddingTop === 0 && 'lg:pt-0',
        lgPaddingBottom === 32 && 'lg:pb-32',
        lgPaddingBottom === 0 && 'lg:pb-0',

        safeBottom && 'pb-32',

        // Transitions & Transforms
        transition === 'all' && 'transition-all duration-300',
        transition === 'colors' && 'transition-colors duration-300',
        transition === 'transform' && 'transition-transform duration-300 ease-out',
        translateX === '0' && 'translate-x-0',
        translateX === 'full' && 'translate-x-full',
        translateX === '-full' && '-translate-x-full',

        // Visibility & Interactivity
        visibility === 'visible' && 'visible',
        visibility === 'invisible' && 'invisible',
        pointerEvents === 'none' && 'pointer-events-none',
        pointerEvents === 'auto' && 'pointer-events-auto',

        // Group Hover States
        groupHoverTranslateX === 10 && 'group-hover:translate-x-10',
        groupHoverTranslateX === -10 && 'group-hover:translate-x-[-10px]',
        groupHoverTranslateX === 32 && 'group-hover:translate-x-32',
        groupHoverTranslateX === -32 && 'group-hover:-translate-x-32',
        groupHoverTranslateX === 0 && 'group-hover:translate-x-0',
        groupHoverOpacity === 0 && 'group-hover:opacity-0',
        groupHoverOpacity === 100 && 'group-hover:opacity-100',
        groupHoverVisible && 'group-hover:visible',
        groupHoverPointerEvents === 'none' && 'group-hover:pointer-events-none',
        groupHoverPointerEvents === 'auto' && 'group-hover:pointer-events-auto',

        className
      )}
    >
      {children}
    </Component>
  )
}

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps } from './box'

import { SpacingToken } from './box'

interface MainProps extends BoxProps {
  paddingY?: SpacingToken | { base: SpacingToken, md?: SpacingToken }
  paddingX?: SpacingToken | { base: SpacingToken, md?: SpacingToken }
  paddingLeft?: SpacingToken | 'sidebar' | 'sidebar-wide' | { base?: SpacingToken | 'sidebar' | 'sidebar-wide', md?: SpacingToken | 'sidebar' | 'sidebar-wide', lg?: SpacingToken | 'sidebar' | 'sidebar-wide' }
}

const sizeOrder: Record<string, number> = {
  none: 0,
  tiny: 1,
  element: 2,
  container: 3,
  empty_state: 4,
  section: 5,
  safe_area: 6,
  dashboard_pc: 7,
}

const paddingYMapping = {
  none: 'py-0',
  tiny: 'py-1',
  element: 'py-2.5',
  container: 'py-5',
  empty_state: 'py-[50px]',
  section: 'py-[100px]',
  safe_area: 'py-[100px]',
  dashboard_pc: 'py-20',
}

const paddingYMdMapping = {
  none: 'md:py-0',
  tiny: 'md:py-1',
  element: 'md:py-2.5',
  container: 'md:py-5',
  empty_state: 'md:py-[50px]',
  section: 'md:py-[100px]',
  safe_area: 'md:py-[100px]',
  dashboard_pc: 'md:py-20',
}

const paddingYMaxMdMapping = {
  none: 'max-md:py-0',
  tiny: 'max-md:py-1',
  element: 'max-md:py-2.5',
  container: 'max-md:py-5',
  empty_state: 'max-md:py-[50px]',
  section: 'max-md:py-[100px]',
  safe_area: 'max-md:py-[100px]',
  dashboard_pc: 'max-md:py-20',
}

const paddingXMapping = {
  none: 'px-0',
  tiny: 'px-1',
  element: 'px-2.5',
  container: 'px-5',
  empty_state: 'px-[50px]',
  section: 'px-[100px]',
  safe_area: 'px-[100px]',
  dashboard_pc: 'px-20',
}

const paddingLeftMapping = {
  'sidebar': 'pl-56',
  'sidebar-wide': 'pl-72'
}

/**
 * Scaffold: A specialized Box for top-level layout scaffolding.
 * Authorized place to use non-uniform padding (PY, PX, PL) 
 * to compensate for navigation shells.
 */
export function Scaffold({
  paddingY,
  paddingX,
  paddingLeft,
  className,
  as = 'div',
  ...props
}: MainProps) {
  
  const isRespPaddingY = typeof paddingY === 'object'
  const paddingYBase = isRespPaddingY ? (paddingY as any).base : paddingY
  const paddingYMd = isRespPaddingY ? (paddingY as any).md : undefined

  let paddingYClassName = ''
  if (paddingYBase !== undefined) {
    if (!isRespPaddingY || paddingYMd === undefined || paddingYBase === paddingYMd) {
      paddingYClassName = paddingYMapping[paddingYBase as keyof typeof paddingYMapping]
    } else {
      const bOrder = sizeOrder[paddingYBase as string] || 0
      const mOrder = sizeOrder[paddingYMd as string] || 0
      paddingYClassName = bOrder > mOrder
          ? cn(paddingYMdMapping[paddingYMd as keyof typeof paddingYMdMapping], paddingYMaxMdMapping[paddingYBase as keyof typeof paddingYMaxMdMapping])
          : cn(paddingYMapping[paddingYBase as keyof typeof paddingYMapping], paddingYMdMapping[paddingYMd as keyof typeof paddingYMdMapping])
    }
  }

  const isRespPaddingX = typeof paddingX === 'object'
  const paddingXBase = isRespPaddingX ? (paddingX as any).base : paddingX
  const paddingXMd = isRespPaddingX ? (paddingX as any).md : undefined

  const isRespPaddingLeft = typeof paddingLeft === 'object'
  const paddingLeftBase = isRespPaddingLeft ? (paddingLeft as any).base : paddingLeft
  const paddingLeftMd = isRespPaddingLeft ? (paddingLeft as any).md : undefined
  const paddingLeftLg = isRespPaddingLeft ? (paddingLeft as any).lg : undefined

  const paddingLeftMapping = {
    none: 'pl-0',
    tiny: 'pl-1',
    element: 'pl-2.5',
    container: 'pl-5',
    section: 'pl-[50px]',
    empty_state: 'pl-[50px]',
    'sidebar': 'pl-56',
    'sidebar-wide': 'pl-72'
  }

  const paddingLeftMdMapping = {
    none: 'md:pl-0',
    tiny: 'md:pl-1',
    element: 'md:pl-2.5',
    container: 'md:pl-5',
    section: 'md:pl-[50px]',
    empty_state: 'md:pl-[50px]',
    'sidebar': 'md:pl-56',
    'sidebar-wide': 'md:pl-72'
  }

  const paddingLeftLgMapping = {
    none: 'lg:pl-0',
    tiny: 'lg:pl-1',
    element: 'lg:pl-2.5',
    container: 'lg:pl-5',
    section: 'lg:pl-[50px]',
    empty_state: 'lg:pl-[50px]',
    'sidebar': 'lg:pl-56',
    'sidebar-wide': 'lg:pl-72'
  }

  return (
    <Box
      as={as}
      {...{ className: cn(
        paddingYClassName,
        paddingXBase !== undefined && paddingXMapping[paddingXBase as keyof typeof paddingXMapping],
        paddingXMd !== undefined && `md:${paddingXMapping[paddingXMd as keyof typeof paddingXMapping]}`,
        paddingLeftBase !== undefined && paddingLeftMapping[paddingLeftBase as keyof typeof paddingLeftMapping],
        paddingLeftMd !== undefined && paddingLeftMdMapping[paddingLeftMd as keyof typeof paddingLeftMdMapping],
        paddingLeftLg !== undefined && paddingLeftLgMapping[paddingLeftLg as keyof typeof paddingLeftLgMapping],
        className
      ) } as any}
      {...props}
    />
  )
}

/**
 * Main: The official semantic <main> container for the application.
 * Uses the Scaffold primitive but enforces the 'main' tag.
 */
export function Main(props: MainProps) {
  return <Scaffold as="main" {...props} />
}

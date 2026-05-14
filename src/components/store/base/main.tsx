'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box, BoxProps } from './box'

interface MainProps extends BoxProps {
  paddingY?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25, md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 }
  paddingX?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 | { base: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25, md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 20 | 25 }
  paddingLeft?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'sidebar' | 'sidebar-wide' | { base?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'sidebar' | 'sidebar-wide', md?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'sidebar' | 'sidebar-wide', lg?: 0 | 1 | 2.5 | 5 | 7.5 | 10 | 12.5 | 'sidebar' | 'sidebar-wide' }
}

const paddingYMapping = {
  5: 'py-5',
  25: 'py-[100px]',
}

const paddingYMdMapping = {
  0: 'md:py-0',
  1: 'md:py-1',
  2.5: 'md:py-2.5',
  5: 'md:py-5',
  20: 'md:py-20',
}

const paddingYMaxMdMapping = {
  0: 'max-md:py-0',
  1: 'max-md:py-1',
  2.5: 'max-md:py-2.5',
  5: 'max-md:py-5',
  7.5: 'max-md:py-[30px]',
  10: 'max-md:py-10',
  12.5: 'max-md:py-[50px]',
  20: 'max-md:py-20',
  25: 'max-md:py-[100px]',
}

const paddingXMapping = {
  5: 'px-5',
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
      const b = paddingYBase as number
      const m = paddingYMd as number
      paddingYClassName = b > m
          ? cn(paddingYMdMapping[m as keyof typeof paddingYMdMapping], paddingYMaxMdMapping[b as keyof typeof paddingYMaxMdMapping])
          : cn(paddingYMapping[b as keyof typeof paddingYMapping], paddingYMdMapping[m as keyof typeof paddingYMdMapping])
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
    'sidebar': 'pl-56',
    'sidebar-wide': 'pl-72'
  }

  const paddingLeftMdMapping = {
    'sidebar': 'md:pl-56',
    'sidebar-wide': 'md:pl-72'
  }

  const paddingLeftLgMapping = {
    'sidebar': 'lg:pl-56',
    'sidebar-wide': 'lg:pl-72'
  }

  return (
    <Box
      as={as}
      className={cn(
        paddingYClassName,
        paddingXBase !== undefined && paddingXMapping[paddingXBase as keyof typeof paddingXMapping],
        paddingXMd !== undefined && `md:${paddingXMapping[paddingXMd as keyof typeof paddingXMapping]}`,
        paddingLeftBase !== undefined && paddingLeftMapping[paddingLeftBase as keyof typeof paddingLeftMapping],
        paddingLeftMd !== undefined && paddingLeftMdMapping[paddingLeftMd as keyof typeof paddingLeftMdMapping],
        paddingLeftLg !== undefined && paddingLeftLgMapping[paddingLeftLg as keyof typeof paddingLeftLgMapping],
        className
      )}
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

'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface LandingSectionProps {
  children: React.ReactNode
  id?: string
  /** When true, the section fills full width without the 1300px inner constraint */
  fullBleed?: boolean
}

/**
 * LandingSection: The canonical section wrapper for landing pages.
 *
 * Layout contract:
 * - Outer Box: full-width `as="section"` with section-level uniform padding
 *   (100px Desktop / 50px Mobile) for consistent vertical rhythm
 * - Inner Box: 1300px max-width constraint (maxWidth="landing") that centers
 *   the content and provides container-level horizontal padding for breathing room
 *
 * Architecture: Advanced component — no className, pure composition.
 */
export function LandingSection({ children, id, fullBleed = false }: LandingSectionProps) {
  return (
    <Box
      as="section"
      id={id}
      width="full"
      display="flex"
      align="center"
      justify="center"
    >
      {fullBleed ? (
        children
      ) : (
        <Box
          width="full"
          maxWidth="landing"
        >
          {children}
        </Box>
      )}
    </Box>
  )
}

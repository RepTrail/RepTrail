'use client'

import React from 'react'
import { EmptyState404 } from '@/components/store/advanced/empty-state-404'
import { Box } from '@/components/store/base/box'

export default function NotFound() {
  return (
    <Box as="main" minHeight="screen" bg="zinc" overflow="hidden">
      <EmptyState404 />
    </Box>
  )
}

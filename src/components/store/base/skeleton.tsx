'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'full' | 'system'
}

export function Skeleton({ 
  className, 
  width, 
  height,
  rounded = 'system'
}: SkeletonProps) {
  return (
    <Box
      bg="zinc"
      bgOpacity={20}
      className={cn("animate-pulse", className)}
      width={width as any}
      height={height as any}
      rounded={rounded}
    />
  )
}

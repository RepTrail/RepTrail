import React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps {
  opacity?: number
}

export function Separator({ opacity = 20 }: SeparatorProps) {
  return (
    <div
      className="w-full h-px bg-white"
      style={{ opacity: opacity / 100 }}
    />
  )
}

import React from 'react'

interface SeparatorProps {
  opacity?: number
}

export function Separator({ opacity = 20 }: SeparatorProps) {
  return (
    <div
      className="w-full h-[2px] bg-white"
      style={{ opacity: opacity / 100 }}
    />
  )
}

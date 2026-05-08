'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { IconBox } from '../base/icon'
import { Surface } from '../base/surface'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: 'blue' | 'red' | 'amber' | 'emerald' | 'orange' | 'zinc'
}

export function EmptyState({ 
  icon, 
  title, 
  description,
  variant: propVariant
}: EmptyStateProps) {
  const { primaryColor } = useRegistry()
  const variant = propVariant || primaryColor
  
  return (
    <Surface 
        variant={`tonal-${variant}` as any} 
        padding={12} 
        rounded="system" 
        border="bold"
        className="w-full"
    >
      <Stack gap={5} align="center" className="text-center">
        <IconBox 
            icon={icon} 
            variant={variant as any} 
            size="lg" 
            rounded="full" 
            className="animate-pulse"
        />
        
        <Stack gap={2.5} align="center">
            <Font variant="heading" color="white" uppercase italic weight="black" className="leading-tight">
                {title}
            </Font>
            <Font variant="description" color="zinc-400" className="max-w-md mx-auto">
                {description}
            </Font>
        </Stack>
      </Stack>
    </Surface>
  )
}

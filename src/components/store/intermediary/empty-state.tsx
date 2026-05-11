'use client'

import React, { useContext } from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { IconBox } from '../base/icon'
import { GlassPanel, Surface } from '../base/surface'
import { LucideIcon } from 'lucide-react'
import { RegistryContext, RegistryColor } from '../advanced/registry-context'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: RegistryColor
}

export function EmptyState({
  icon,
  title,
  description,
  variant
}: EmptyStateProps) {

  const ctx = useContext(RegistryContext)
  const activeVariant = variant || (ctx?.primaryColor ?? 'zinc')

  return (
    <GlassPanel
      variant="tonal-primary"
      padding={12.5}
      rounded="system"
      border="bold"
      fullWidth
    >
      <Stack gap={5} align="center">
        <IconBox
          icon={icon}
          variant="primary"
          size="lg"
          rounded="full"
        />

        <Stack gap={2.5} align="center">
          <Font variant="heading" color="white" uppercase italic weight="black" align="center">
            {title}
          </Font>
          <Font variant="description" color="zinc-400" maxWidth="md" align="center">
            {description}
          </Font>
        </Stack>
      </Stack>
    </GlassPanel>
  )
}

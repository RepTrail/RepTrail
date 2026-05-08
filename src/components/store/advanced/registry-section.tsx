import React from 'react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from './registry-context'

interface RegistrySectionProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: LucideIcon
  id?: string
}

export function RegistrySection({
  children,
  title,
  subtitle,
  icon,
  id
}: RegistrySectionProps) {
  const { primaryColor } = useRegistry()

  return (
    <Stack gap="title-content" id={id}>
      {/* Section Header */}
      <Stack gap={2.5}>
        <Stack direction="row" align="center" gap={2.5}>
          <Icon icon={icon} color={primaryColor as any} size="lg" />
          <Font variant="heading">{title}</Font>
        </Stack>
        {subtitle && (
          <Font color="zinc-500" variant="body">
            {subtitle}
          </Font>
        )}
      </Stack>

      {/* Section Content */}
      <Box width="full">
        {children}
      </Box>
    </Stack>
  )
}

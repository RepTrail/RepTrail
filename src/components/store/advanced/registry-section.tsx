import React from 'react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Inline } from '../base/layout'
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
    <Stack gap={{ base: 7.5, md: 12.5 }} id={id}>
      {/* Section Header */}
      <Stack gap={2.5}>
        <Inline gap={2.5}>
          <Icon icon={icon} color={primaryColor as any} size="lg" />
          <Font variant="heading">{title}</Font>
        </Inline>
        {subtitle && (
          <Font color="zinc-500" variant="body">
            {subtitle}
          </Font>
        )}
      </Stack>

      {/* Section Content */}
      <Box fullWidth>
        {children}
      </Box>
    </Stack>
  )
}

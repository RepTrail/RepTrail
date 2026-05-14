'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from './registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface RegistrySectionProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: LucideIcon
  id?: string
  rightElement?: React.ReactNode
}

export function RegistrySection({
  children,
  title,
  subtitle,
  icon,
  id,
  rightElement
}: RegistrySectionProps) {
  const { primaryColor } = useRegistry()

  return (
    <Stack gap="title-content" id={id} fullWidth>
      {/* Section Header */}
      <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'start', lg: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
          <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
            <Icon icon={icon} color={primaryColor as any} size="lg" />
            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
              {title}
            </Font>
          </Inline>
          <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
            {subtitle}
          </Font>
        </Stack>
        {rightElement && (
          <Box>
            {rightElement}
          </Box>
        )}
      </Stack>
      {/* Section Content */}
      <Box fullWidth>
        {children}
      </Box>
    </Stack>
  );
}

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
  title?: string
  subtitle?: string
  icon?: LucideIcon
  id?: string
  rightElement?: React.ReactNode
  flex1?: boolean
}

export function RegistrySection({
  children,
  title,
  subtitle,
  icon,
  id,
  rightElement,
  flex1 = false
}: RegistrySectionProps) {
  const { primaryColor } = useRegistry()

  return (
    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} id={id} fullWidth>
      {/* Section Header */}
      {(title || subtitle || rightElement) && (
        <Stack
          direction={{ base: 'col', lg: 'row' }}
          justify={(title || subtitle) ? "between" : "end"}
          align={{ base: 'stretch', lg: 'end' }}
          gap={STORE_TOKENS.SPACING.CONTAINER}
        >
          {(title || subtitle) && (
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
              {title && (
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                  {icon && <Icon icon={icon} color={primaryColor as any} size="lg" />}
                  <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                    {title}
                  </Font>
                </Inline>
              )}
              {subtitle && (
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                  {subtitle}
                </Font>
              )}
            </Stack>
          )}
          {rightElement && (
            <Box display="flex" align="end" fullWidth={{ base: true, lg: false }}>
              {rightElement}
            </Box>
          )}
        </Stack>
      )}
      {/* Section Content */}
      <Box fullWidth flex1={flex1} display="flex" direction="col">
        {children}
      </Box>
    </Stack>
  );
}

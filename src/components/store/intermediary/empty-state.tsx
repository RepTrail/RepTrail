'use client'

import React, { useContext } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { IconBox } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { LucideIcon } from 'lucide-react'
import { RegistryContext, RegistryColor } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
  const _activeVariant = variant || (ctx?.primaryColor ?? 'zinc')

  return (
    <GlassPanel
      variant="tonal-primary"
      padding={STORE_TOKENS.PADDING.EMPTY_STATE}
      rounded={STORE_TOKENS.RADIUS.SYSTEM}
      border="bold"
      fullWidth
    >
      <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
        <IconBox
          icon={icon}
          variant="primary"
          size="lg"
          rounded={STORE_TOKENS.RADIUS.FULL}
        />

        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
          <Font
            {...STORE_TOKENS.TYPOGRAPHY.HEADING}
            variant="heading"
            align="center"
            {...{
              color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
            }}>
            {title}
          </Font>
          <Font
            {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
            align="center"
            uppercase={false}
            {...{
              color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
            }}>
            {description}
          </Font>
        </Stack>
      </Stack>
    </GlassPanel>
  );
}

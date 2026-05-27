'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CalloutProps {
  children: React.ReactNode
  variant?: 'danger' | 'warning' | 'info' | 'success'
  title?: string
}

/**
 * Callout: A specialized container for warnings, info notices, or alerts.
 */
export function Callout({
  children,
  variant = 'info',
  title
}: CalloutProps) {
  const config = {
    danger: { color: STORE_TOKENS.COLORS.ERROR, bg: STORE_TOKENS.COLORS.ERROR, border: 'red-500/20' },
    warning: { color: STORE_TOKENS.COLORS.WARNING, bg: STORE_TOKENS.COLORS.WARNING, border: 'amber-500/20' },
    info: { color: STORE_TOKENS.COLORS.INFO, bg: STORE_TOKENS.COLORS.INFO, border: 'blue-500/20' },
    success: { color: STORE_TOKENS.COLORS.SUCCESS, bg: STORE_TOKENS.COLORS.SUCCESS, border: 'emerald-500/20' }
  }

  const { color, bg, border } = config[variant as keyof typeof config]

  return (
    <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={bg as any} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} border borderColor={border as any}>
      <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
        {title && (
          <Font
            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
            {...{
              color: color as any,
            }}>
            {title}
          </Font>
        )}
        <Font
          variant="body-sm"
          {...{
            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
          }}>
          {children}
        </Font>
      </Stack>
    </Box>
  );
}

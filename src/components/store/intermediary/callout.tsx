'use client'

import React from 'react'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Stack } from '../base/stack'

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
    danger: { color: 'red', bg: 'red', border: 'red-500/20' },
    warning: { color: 'amber', bg: 'amber', border: 'amber-500/20' },
    info: { color: 'blue', bg: 'blue', border: 'blue-500/20' },
    success: { color: 'emerald', bg: 'emerald', border: 'emerald-500/20' }
  }

  const { color, bg, border } = config[variant as keyof typeof config]

  return (
    <Box padding={2.5} rounded="system" bg={bg as any} bgOpacity={10} border borderColor={border as any}>
      <Stack gap={1}>
        {title && (
          <Font variant="sub-tiny" color={color as any} weight="black" uppercase italic>
            {title}
          </Font>
        )}
        <Font variant="body-sm" color="zinc-400">
          {children}
        </Font>
      </Stack>
    </Box>
  )
}

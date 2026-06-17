'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { LucideIcon, BarChart3 } from 'lucide-react'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { iconMap } from '@/components/store/constants/icon-map'

interface BaseRegistrySectionProps {
  children: React.ReactNode
  id?: string
  rightElement?: React.ReactNode
  flex1?: boolean
}

type RegistrySectionProps = BaseRegistrySectionProps & (
  | {
      title?: never
      subtitle?: never
      icon?: never
    }
  | {
      title: string
      subtitle: string
      icon: LucideIcon | string
    }
)

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

  const IconComp = typeof icon === 'string' ? (iconMap[icon] || BarChart3) : icon

  return (
    <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} id={id} fullWidth>
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
                  {IconComp && <Icon icon={IconComp} color={primaryColor as any} size="lg" />}
                  <Font
                    variant="heading"
                    weight="black"
                    uppercase
                    italic
                    {...{
                      color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                    }}>
                    {title}
                  </Font>
                </Inline>
              )}
              {subtitle && (
                <Font
                  variant="description"
                  {...{
                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                  }}>
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

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Inline } from '../base/layout'
import { GlassPanel } from '../base/surface'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from './registry-context'
import { SegmentedSwitch } from '../intermediary/segmented-switch'

interface DashboardMainProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  icon?: LucideIcon
  auxiliaryText?: string
  /** Optional tabs to show a SegmentedSwitch navigation */
  tabs?: {
    id: string
    label: string
    icon?: LucideIcon
    activeVariant?: 'outline-red' | 'outline-blue' | 'outline-amber' | 'outline-emerald' | 'outline-orange' | 'outline-indigo'
  }[]
  activeTabId?: string
  onTabSelect?: (id: string) => void
  showFooter?: boolean
}

/**
 * DashboardMain: O container mestre de conteúdo para todas as telas do Dashboard.
 * Padroniza o espaçamento responsivo (80px PC / 20px Mobile) e a hierarquia visual.
 */
export function DashboardMain({
  children,
  title,
  subtitle,
  icon,
  auxiliaryText,
  tabs,
  activeTabId,
  onTabSelect,
  showFooter = true
}: DashboardMainProps) {
  const { primaryColor } = useRegistry()
  const words = (title || '').trim().split(' ')
  const first = words[0] || ''
  const rest = words.slice(1).join(' ')

  return (
    <Box fullWidth paddingX={5} paddingY={{ base: 25, sm: 5, md: 20 }}>
      <Stack gap={{ base: 12.5, md: 'section' }}>

        {/* Header Section */}
        <Stack gap={2.5}>
          <Inline gap={2.5}>
            {icon && <Icon icon={icon} color={primaryColor as any} size="lg" />}
            {auxiliaryText && (
              <Font variant="auxiliary" color={primaryColor as any}>
                {auxiliaryText}
              </Font>
            )}
          </Inline>

          <Stack gap={1}>
            <Font variant="h1" nowrap>
              {first} {rest && <Font variant="h1" color={primaryColor} nowrap>{rest}</Font>}
            </Font>
            {subtitle && <Font variant="description">{subtitle}</Font>}
          </Stack>
        </Stack>

        {/* Optional Tabs Navigation */}
        {tabs && activeTabId && onTabSelect && (
          <SegmentedSwitch
            options={tabs}
            activeId={activeTabId}
            onSelect={onTabSelect}
          />
        )}

        {/* Content Sections */}
        <Stack gap={{ base: 12.5, md: 'section' }}>
          {children}
        </Stack>

        {/* Standardized Footer */}
        {showFooter && (
          <GlassPanel padding={5}>
            <Inline justify="between">
              <Font variant="sub-tiny" color="zinc-500">RepTrail Dashboard v2.0 - 2026</Font>
            </Inline>
          </GlassPanel>
        )}
      </Stack>
    </Box>
  )
}

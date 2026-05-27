import { Box } from '@/components/store/base/box'
import { Main } from '@/components/store/base/main'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { GlassPanel } from '@/components/store/base/surface'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from './registry-context'
import { SegmentedSwitch } from '../intermediary/segmented-switch'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
    <Main
      fullWidth
      display="flex"
      direction="col"
      {...{
        paddingX: STORE_TOKENS.PADDING.CONTAINER,
        paddingY: { base: 'section', md: 'dashboard_pc' },
        minHeight: "screen",
      }}>
      <Stack flex1 gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>

        {/* Header Section */}
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
          <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
            {icon && <Icon icon={icon} color={primaryColor as any} size="lg" />}
            {auxiliaryText && (
              <Font
                variant="auxiliary"
                {...{
                  color: primaryColor as any,
                }}>
                {auxiliaryText}
              </Font>
            )}
          </Inline>

          <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Font variant="h1" nowrap>
              {first} {rest && <Font
              variant="h1"
              nowrap
              {...{
                color: primaryColor,
              }}>{rest}</Font>}
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
        <Stack flex1 gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
          {children}
        </Stack>

        {/* Standardized Footer */}
        {showFooter && (
          <Box shrink={0}>
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
              <Inline justify="between">
                <Font
                  variant="sub-tiny"
                  {...{
                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                  }}>RepTrail Dashboard v2.0 - 2026</Font>
              </Inline>
            </GlassPanel>
          </Box>
        )}
      </Stack>
    </Main>
  );
}

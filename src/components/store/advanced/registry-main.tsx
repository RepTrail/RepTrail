'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Scaffold } from '@/components/store/base/main'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { GlassPanel } from '@/components/store/base/surface'
import { EmptyState } from '../intermediary/empty-state'
import {
  BarChart3,
  Users2,
  HeartHandshake,
  Zap,
  Users,
  ClipboardList,
  Activity,
  TrendingUp,
  Sparkles,
  Utensils,
  Dumbbell,
  FlaskConical,
  FileUp,
  Flame,
  CreditCard,
  UserCheck,
  LayoutDashboard,
  LucideIcon
} from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AdminSectionContent } from '../sections/admin-section-content'
import { StudentRegistryContent } from '../sections/student-registry-content'

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Users2,
  HeartHandshake,
  Zap,
  Users,
  ClipboardList,
  Activity,
  TrendingUp,
  Sparkles,
  Utensils,
  Dumbbell,
  FlaskConical,
  FileUp,
  Flame,
  CreditCard,
  UserCheck,
  LayoutDashboard,
}

interface RegistryMainProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: LucideIcon | string
  contextLabel?: string
  showTabs?: boolean
  showHeader?: boolean
  rightElement?: React.ReactNode
  backPath?: string
  hideFooter?: boolean
  noPadding?: boolean
  noMinHeight?: boolean
}

export function RegistryMain({
  children,
  title,
  subtitle,
  icon,
  contextLabel,
  showTabs = false,
  showHeader = true,
  rightElement,
  backPath,
  hideFooter = false,
  noPadding = false,
  noMinHeight = false
}: RegistryMainProps) {
  const { activeTab, setActiveTab, primaryColor } = useRegistry()
  const words = title.trim().split(' ')
  const lastWord = words.pop() || ''
  const firstPart = words.join(' ')

  const IconComp = typeof icon === 'string' ? (iconMap[icon] || BarChart3) : icon

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, activeVariant: 'outline-blue' as const },
    { id: 'admin', label: 'Admin', icon: Users2, activeVariant: 'outline-red' as const },
    { id: 'afiliado', label: 'Afiliado', icon: HeartHandshake, activeVariant: 'outline-amber' as const },
    { id: 'personal', label: 'Personal', icon: Zap, activeVariant: 'outline-emerald' as const },
    { id: 'aluno', label: 'Aluno', icon: Users, activeVariant: 'outline-orange' as const },
  ]

  const renderContent = () => {
    if (!showTabs) return children

    switch (activeTab) {
      case 'overview':
        return children
      case 'admin':
        return <AdminSectionContent />
      case 'afiliado':
        return null // AffiliateSectionContent was removed
      case 'aluno':
        return <StudentRegistryContent id="aluno-content" />
      default:
        return (
          <EmptyState
            variant={primaryColor as any}
            icon={IconComp}
            title="Em Breve"
            description={`A seção ${activeTab.toUpperCase()} está sendo preparada para o sistema RepTrail.`}          />
        )
    }
  }

  return (
    <Scaffold
      fullWidth
      display="flex"
      direction="col"
      flex1
      {...{
        paddingX: noPadding ? undefined : STORE_TOKENS.PADDING.CONTAINER,

        paddingY: noPadding ? undefined : {
          base: STORE_TOKENS.PADDING.SAFE_AREA_INSET,
          md: STORE_TOKENS.PADDING.CONTAINER,
        },

        minHeight: noMinHeight ? undefined : "screen",
      }}>
      <Stack flex1 gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE as any, md: STORE_TOKENS.SPACING.SECTION as any }}>
        {/* Header Section title*/}
        {showHeader && (
          <Stack direction={{ base: 'col', md: 'row' }} justify="between" align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
              <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Icon icon={IconComp} color={primaryColor as any} size="lg" />
                <Font
                  variant="auxiliary"
                  {...{
                    color: primaryColor as any,
                  }}>{contextLabel || 'Brand Guidelines'}</Font>
              </Inline>

              <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font variant="h1">
                  {firstPart ? (
                    <>
                      {firstPart} <Font variant="h1" {...{ color: primaryColor }}>{lastWord}</Font>
                    </>
                  ) : (
                    lastWord
                  )}
                </Font>
                <Font variant="description">{subtitle}</Font>
              </Stack>
            </Stack>
            
            {rightElement && (
              <Box display="flex" fullWidth={{ base: true, md: false }}>
                {rightElement}
              </Box>
            )}
          </Stack>
        )}

        {/* Tab Navigation System (Pill Style with Contextual Colors) */}
        {showTabs && (
          <SegmentedSwitch
            options={tabs}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
        )}

        {/* Content Sections */}
        <Stack flex1 gap={noPadding ? undefined : { base: STORE_TOKENS.SPACING.EMPTY_STATE as any, md: STORE_TOKENS.SPACING.SECTION as any }} fullWidth>
          {renderContent()}
        </Stack>

        {/* Footer Area - Upgraded to Liquid Glass */}
        {!hideFooter && (
          <Box shrink={0}>
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
              <Inline justify="between">
                <Font
                  variant="sub-tiny"
                  {...{
                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                  }}>RepTrail Design System v2.0 - 2026</Font>
              </Inline>
            </GlassPanel>
          </Box>
        )}
      </Stack>
    </Scaffold>
  );
}

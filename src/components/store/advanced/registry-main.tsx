'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Scaffold } from '@/components/store/base/main'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Surface, GlassPanel } from '@/components/store/base/surface'
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
  LucideIcon
} from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AdminSectionContent } from '../sections/admin-section-content'
import { AffiliateSectionContent } from '../sections/affiliate-section-content'
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
}

interface RegistryMainProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: LucideIcon | string
  contextLabel?: string
  showTabs?: boolean
}

export function RegistryMain({
  children,
  title,
  subtitle,
  icon,
  contextLabel,
  showTabs = true
}: RegistryMainProps) {
  const { activeTab, setActiveTab, primaryColor } = useRegistry()
  const [first, ...rest] = title.split(' ')

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
        return <AffiliateSectionContent />
      case 'aluno':
        return <StudentRegistryContent id="aluno-content" />
      default:
        return (
          <EmptyState
            variant={primaryColor as any}
            icon={IconComp}
            title="Em Breve"
            description={`A seção ${activeTab.toUpperCase()} está sendo preparada para o sistema RepTrail.`}
          />
        )
    }
  }

  return (
    <Scaffold
      fullWidth
      paddingX={STORE_TOKENS.PADDING.CONTAINER}
      paddingY={{
        base: STORE_TOKENS.PADDING.SAFE_AREA_INSET,
        md: STORE_TOKENS.PADDING.CONTAINER,
      }}
    >
      <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
        {/* Header Section title*/}
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
          <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Icon icon={IconComp} color={primaryColor as any} size="lg" />
            <Font variant="auxiliary" color={primaryColor as any}>{contextLabel || 'Brand Guidelines'}</Font>
          </Inline>

          <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Font variant="h1" nowrap>
              {first} <Font variant="h1" color={primaryColor} nowrap>{rest.join(' ')}</Font>
            </Font>
            <Font variant="description">{subtitle}</Font>
          </Stack>
        </Stack>

        {/* Tab Navigation System (Pill Style with Contextual Colors) */}
        {showTabs && (
          <SegmentedSwitch
            options={tabs}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
        )}

        {/* Content Sections */}
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }} fullWidth>
          {renderContent()}
        </Stack>

        {/* Footer Area - Upgraded to Liquid Glass */}
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
          <Inline justify="between">
            <Font variant="sub-tiny">RepTrail Design System v2.0 - 2026</Font>
          </Inline>
        </GlassPanel>
      </Stack>
    </Scaffold>
  );
}

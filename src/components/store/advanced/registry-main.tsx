import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Inline } from '../base/layout'
import { Surface } from '../base/surface'
import { EmptyState } from '../intermediary/empty-state'
import {
  BarChart3,
  Users2,
  HeartHandshake,
  Zap,
  Users,
  LucideIcon
} from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { cn } from '@/lib/utils'

interface RegistryMainProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: LucideIcon
}

export function RegistryMain({
  children,
  title,
  subtitle,
  icon
}: RegistryMainProps) {
  const { activeTab, setActiveTab, primaryColor } = useRegistry()
  const [first, ...rest] = title.split(' ')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, activeVariant: 'outline-blue' as const },
    { id: 'admin', label: 'Admin', icon: Users2, activeVariant: 'outline-red' as const },
    { id: 'afiliado', label: 'Afiliado', icon: HeartHandshake, activeVariant: 'outline-amber' as const },
    { id: 'personal', label: 'Personal', icon: Zap, activeVariant: 'outline-emerald' as const },
    { id: 'aluno', label: 'Aluno', icon: Users, activeVariant: 'outline-orange' as const },
  ]

  return (
    <Box className="bg-background">
      <Stack gap="section">
        {/* Header Section */}
        <Stack gap={5}>
          <Inline gap={2.5}>
            <Icon icon={icon} color={primaryColor as any} size="lg" />
            <Font variant="auxiliary" color={primaryColor as any}>Brand Guidelines</Font>
          </Inline>

          <Stack gap={2.5}>
            <Font variant="h1" nowrap>
              {first} <Font variant="h1" color={primaryColor} nowrap>{rest.join(' ')}</Font>
            </Font>
            <Font variant="description">{subtitle}</Font>
          </Stack>
        </Stack>

        {/* Tab Navigation System (Pill Style with Contextual Colors) */}
        <SegmentedSwitch
          options={tabs}
          activeId={activeTab}
          onSelect={setActiveTab}
        />

        {/* Content Sections */}
        <Stack gap="section">
          {activeTab === 'overview' ? (
            children
          ) : (
            <EmptyState 
              variant={primaryColor as any}
              icon={icon}
              title="Em Breve"
              description={`A seção ${activeTab.toUpperCase()} está sendo preparada para o sistema RepTrail.`}
            />
          )}
        </Stack>

        {/* Footer Area */}
        <Surface variant="base" className="border-t border-white/5 py-5 px-5">
          <Inline justify="between">
            <Font variant="sub-tiny">RepTrail Design System v2.0 - 2026</Font>
          </Inline>
        </Surface>
      </Stack>
    </Box>
  )
}

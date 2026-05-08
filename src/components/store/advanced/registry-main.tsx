import React from 'react'
import { Box, BoxProps } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Separator } from '../base/separator'
import {
  BarChart3,
  Users2,
  HeartHandshake,
  Zap,
  Users,
  LucideIcon
} from 'lucide-react'
import { useRegistry } from './registry-context'
import { AdminRegistryContent } from '../sections/admin-registry-content'
import { AffiliateRegistryContent } from '../sections/affiliate-registry-content'
import { ComponentsRegistryContent } from '../sections/components-registry-content'
import { SegmentedSwitch } from '../intermediary/segmented-switch'

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
    { id: 'components', label: 'Components', icon: Zap, activeVariant: 'outline-blue' as const },
    { id: 'personal', label: 'Personal', icon: Zap, activeVariant: 'outline-emerald' as const },
    { id: 'aluno', label: 'Aluno', icon: Users, activeVariant: 'outline-orange' as const },
  ]

  return (
    <Box
      padding={5}
      mdPaddingTop={20}
      bg="background"
    >
      <Stack gap="section">
        {/* Header Section */}
        <Stack gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={icon} color={primaryColor} size="lg" />
            <Font variant="auxiliary" color={primaryColor}>Brand Guidelines</Font>
          </Stack>

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

        <Separator opacity={20} />

        {/* Content Sections */}
        <Stack gap="section">
          {activeTab === 'overview' ? (
            children
          ) : activeTab === 'admin' ? (
            <AdminRegistryContent />
          ) : activeTab === 'components' ? (
            <ComponentsRegistryContent />
          ) : activeTab === 'afiliado' ? (
            <AffiliateRegistryContent />
          ) : (
            <Box paddingY={5} display="flex" align="center" justify="center">
              <Stack align="center" gap={5}>
                <Box bg={`${primaryColor}/20` as BoxProps['bg']} padding={5} rounded="full">
                  <Icon icon={icon} color={primaryColor} size="lg" />
                </Box>
                <Stack align="center" gap={2.5}>
                  <Font variant="heading" color="white">Em Breve</Font>
                  <Font variant="description" align="center">
                    A seção {activeTab.toUpperCase()} está sendo preparada para o sistema RepTrail.
                  </Font>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>

        {/* Footer Area */}
        <Box padding={5} border="white/5">
          <Stack direction="row" justify="between" align="center">
            <Font variant="sub-tiny">RepTrail Design System v2.0 - 2026</Font>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

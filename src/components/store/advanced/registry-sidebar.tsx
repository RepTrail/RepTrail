import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Zap, Activity, Shield, Users, Dumbbell, Trophy } from 'lucide-react'
import { useRegistry } from './registry-context'

export function RegistrySidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { primaryColor } = useRegistry()
  const sections = [
    { id: 'branding', label: 'Branding', icon: Zap },
    { id: 'colors', label: 'Colors & Identity', icon: Activity },
    { id: 'admin', label: 'Admin Identity', icon: Shield },
    { id: 'typography', label: 'Typography', icon: Users },
    { id: 'components', label: 'Real Components', icon: Dumbbell },
    { id: 'layout', label: 'Layout & Spacing', icon: Trophy },
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Stack
      direction="row"
      gap={0}
      position="fixed"
      inset="left-0-top-0"
      height="screen"
      width="72"
      zIndex={50}
      display="lg-flex"
    >
      <Box flex1 bg="zinc-850" padding={5} display="flex" flexCol height="full">
        {/* Brand Logo Area + Navigation Area (Gap 50px) */}
        <Stack gap={12.5} flex1 overflow="hidden">
          <Box padding={0} shrink0>
            <Logo size="md" color={primaryColor as any} />
          </Box>

          <Box as="nav" flex1 overflow="auto" scrollbar="custom">
            <Stack gap={2.5}>
              {sections.map((section, idx) => (
                <SidebarItem
                  key={section.id}
                  label={section.label}
                  icon={section.icon}
                  active={idx === 0}
                  variant={primaryColor as any}
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Bottom Profile Area (Gap 20px) */}
        <Stack gap={5}>
          {/* Divider */}
          <Box bg="white" bgOpacity={10} width="full" height="px" />
          <SidebarProfile onOpenSettings={onOpenSettings} />
        </Stack>
      </Box>

      {/* Physical Border Right */}
      <Box bg="zinc-800" width="px" height="full" bgOpacity={50} />
    </Stack>
  )
}

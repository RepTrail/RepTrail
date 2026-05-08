'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Zap, Activity, Shield, Users, Dumbbell, Trophy } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Sidebar, Divider } from '../base/layout'

export function RegistrySidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { primaryColor, activeSection, setActiveSection } = useRegistry()

  const sections = [
    { id: 'branding', label: 'Branding', icon: Zap },
    { id: 'colors', label: 'Colors & Identity', icon: Activity },
    { id: 'typography', label: 'Typography', icon: Users },
    { id: 'components', label: 'Real Components', icon: Dumbbell },
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Sidebar>
      <Box
        flex1
        bg="zinc"
        bgOpacity={95}
        display="flex"
        direction="col"
        fullHeight
        borderR
        borderColor="white/5"
      >
        {/* Top Content (Padded) */}
        <Box flex1 padding={5} display="flex" direction="col" overflow="hidden">
          <Stack gap={12.5} flex1 overflow="hidden">
            <Box>
              <Logo size="md" color={primaryColor as any} />
            </Box>

            <Box as="nav" flex1 overflow="auto" noScrollbar>
              <Stack gap={2.5}>
                {sections.map((section) => (
                  <SidebarItem
                    key={section.id}
                    label={section.label}
                    icon={section.icon}
                    active={activeSection === section.id}
                    variant={primaryColor as any}
                    onClick={() => scrollToSection(section.id)}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Divider (Full Width - Balanced Opacity) */}
        <Divider color="white/5" />

        {/* Bottom Profile (Padded) */}
        <Box padding={5}>
          <SidebarProfile onOpenSettings={onOpenSettings} />
        </Box>
      </Box>

      <Divider direction="vertical" color="white/5" />
    </Sidebar>
  )
}

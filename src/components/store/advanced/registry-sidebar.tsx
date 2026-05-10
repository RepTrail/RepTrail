'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Zap, Activity, Shield, Users, Dumbbell, Trophy, X } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Sidebar, Divider } from '../base/layout'
import { Button } from '../base/button'

interface SidebarSection {
  id: string
  label: string
  icon: any
}

export function RegistrySidebar({ 
  onOpenSettings,
  sections: externalSections
}: { 
  onOpenSettings?: () => void,
  sections?: SidebarSection[]
}) {
  const { primaryColor, activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen } = useRegistry()

  const defaultSections = [
    { id: 'branding', label: 'Branding', icon: Zap },
    { id: 'colors', label: 'Colors & Identity', icon: Activity },
    { id: 'typography', label: 'Typography', icon: Users },
    { id: 'components', label: 'Real Components', icon: Dumbbell },
  ]

  const sections = externalSections || defaultSections

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    setIsSidebarOpen(false) // Close on click for mobile
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <Box 
            position="fixed"
            pin="inset"
            bg="black"
            bgOpacity={60}
            backdropBlur="sm"
            zIndex={100}
            display={{ base: 'block', lg: 'none' }}
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Box
        as="aside"
        position="fixed"
        pin={{ base: 'right', lg: 'left' }}
        top={0}
        height="screen"
        width="sidebar-wide"
        zIndex={100}
        transition
        translateX={{
            base: isSidebarOpen ? 'none' : 'full',
            lg: 'none'
        }}
      >
        <Box
          fullWidth
          flex1
          display="flex"
          direction="col"
          fullHeight
          bg="zinc"
          bgOpacity={40}
          backdropBlur="md"
        >
          {/* Left border for mobile drawer */}
          <Box display={{ base: 'block', lg: 'none' }} position="absolute" pin="left" top={0} fullHeight width="px" bg="white" bgOpacity={5} />
          {/* Right border for desktop static */}
          <Box display={{ base: 'none', lg: 'block' }} position="absolute" pin="right" top={0} fullHeight width="px" bg="white" bgOpacity={5} />
          {/* Top Content (Padded) */}
          <Box flex1 padding={5} display="flex" direction="col" overflow="hidden" position="relative">

            <Stack gap={12.5} flex1 overflow="hidden">
              <Box>
                <Logo size="md" color={primaryColor as any} />
              </Box>

              <Box as="nav" flex1 fullWidth overflow="auto" noScrollbar>
                <Stack gap={2.5} fullWidth>
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
            <SidebarProfile 
              onOpenSettings={onOpenSettings} 
              user={{
                name: 'Usuário',
                email: 'suporte@reptrail.com'
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

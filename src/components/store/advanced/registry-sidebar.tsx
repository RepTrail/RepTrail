'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Logo } from '@/components/store/base/logo'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { cn } from '@/lib/utils'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Zap, Activity, Shield, Users, Dumbbell, Trophy, X } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Sidebar, Divider } from '@/components/store/base/layout'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
        <Surface
            position="fixed"
            pin="inset"
            variant="glass-dark"
            bg={STORE_TOKENS.COLORS.BLACK}
            bgOpacity={STORE_TOKENS.OPACITY.MODAL}
            zIndex={100}
            display={{ base: 'block', lg: 'none' }}
            onClick={() => setIsSidebarOpen(false)}
        >
          <></>
        </Surface>
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
        translateX={{ base: isSidebarOpen ? 0 : 'full', lg: 0 }}
      >
        <GlassPanel
          fullWidth
          fullHeight
          variant="glass"
          border="none"
          rounded="none"
          display="flex"
          direction="col"
        >
          {/* Left border for mobile drawer */}
          <Surface 
              display={{ base: 'block', lg: 'none' }} 
              position="absolute" 
              pin="left" 
              top={0} 
              fullHeight 
              width="px" 
              bg="white" 
              bgOpacity={5}
          >
            <></>
          </Surface>
          {/* Right border for desktop static */}
          <Surface 
              display={{ base: 'none', lg: 'block' }} 
              position="absolute" 
              pin="right" 
              top={0} 
              fullHeight 
              width="px" 
              bg="white" 
              bgOpacity={5}
          >
            <></>
          </Surface>
          {/* Top Content (Padded) */}
          <Box flex1 padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" direction="col" overflow="hidden" position="relative">

            <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE} flex1 overflow="hidden">
              <Box>
                <Logo size="md" color={primaryColor as any} />
              </Box>

              <Box as="nav" flex1 fullWidth overflow="auto" noScrollbar>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
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
          <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

          {/* Bottom Profile (Padded) */}
          <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
            <SidebarProfile 
              onOpenSettings={onOpenSettings} 
              user={{
                name: 'Usuário',
                email: 'suporte@reptrail.com'
              }}
            />
          </Box>
        </GlassPanel>
      </Box>
    </>
  )
}

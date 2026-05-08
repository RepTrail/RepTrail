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
import { cn } from '@/lib/utils'

export function RegistrySidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { primaryColor, activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen } = useRegistry()

  const sections = [
    { id: 'branding', label: 'Branding', icon: Zap },
    { id: 'colors', label: 'Colors & Identity', icon: Activity },
    { id: 'typography', label: 'Typography', icon: Users },
    { id: 'components', label: 'Real Components', icon: Dumbbell },
  ]

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
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed right-0 top-0 h-screen w-72 z-[101] transition-transform duration-500",
        "lg:translate-x-0 lg:left-0 lg:right-auto", // Static on left for desktop
        isSidebarOpen ? "translate-x-0" : "translate-x-full" // Drawer on mobile from right
      )}>
        <Box
          flex1
          display="flex"
          direction="col"
          fullHeight
          className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-md border-l border-white/5"
        >
          {/* Top Content (Padded) */}
          <Box flex1 padding={5} display="flex" direction="col" overflow="hidden" position="relative">
            {/* Mobile Close Button */}
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute left-5 top-5 lg:hidden text-white/40 hover:text-white active:scale-90 transition-all"
            >
                <X size={20} />
            </button>

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
      </aside>
    </>
  )
}

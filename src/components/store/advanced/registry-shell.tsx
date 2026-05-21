'use client'

import React, { useEffect } from 'react'
import { RegistrySidebar } from './registry-sidebar'
import { RegistryMobileNavigation } from '@/components/store/advanced/registry-mobile-navigation'
import { RegistryBottomNav } from '@/components/store/advanced/registry-bottom-nav'
import { SettingsModal } from '@/components/store/advanced/student-settings-modal'
import { RegistryColor, RegistryProvider } from '@/components/store/advanced/registry-context'
import { Surface } from '@/components/store/base/surface'
import { Main } from '@/components/store/base/main'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface RegistryShellProps {
  children: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function RegistryShell({ children, activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }: RegistryShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [internalActiveTab, setInternalActiveTab] = React.useState('overview')
  const [activeSection, setActiveSection] = React.useState('branding')
  const [primaryColor, setPrimaryColor] = React.useState<RegistryColor>('blue')

  const activeTab = externalActiveTab || internalActiveTab
  const setActiveTab = externalSetActiveTab || setInternalActiveTab

  const tabs = [
    { id: 'overview', color: 'blue' as RegistryColor },
    { id: 'admin', color: 'red' as RegistryColor },
    { id: 'afiliado', color: 'amber' as RegistryColor },
    { id: 'personal', color: 'emerald' as RegistryColor },
    { id: 'aluno', color: 'orange' as RegistryColor },
  ]

  useEffect(() => {
    const currentTab = tabs.find(t => t.id === activeTab)
    if (currentTab) setPrimaryColor(currentTab.color)
  }, [activeTab])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    const sections = ['branding', 'colors', 'admin', 'typography', 'components', 'layout']
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [activeTab])

  return (
    <RegistryProvider
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      primaryColor={primaryColor}
      setPrimaryColor={setPrimaryColor}
    >
      <Surface
        minHeight="screen"
        bg="zinc"
        bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
        overflowX="hidden"
        display="flex"
        direction="col"
        position="relative"
      >

        {/* Background Effects (Grid & Orbs) — Unified Base Component */}
        <BackgroundEffects variant="all" />

        {/* Desktop Sidebar */}
        <RegistrySidebar onOpenSettings={() => window.dispatchEvent(new CustomEvent('open-settings'))} />

        {/* Mobile Navigation */}
        <RegistryMobileNavigation />
        <RegistryBottomNav />

        {/* Main Content Area */}
        <Main
          flex1
          fullWidth
          paddingLeft={{ base: "none", lg: 'sidebar-wide' }}
          transition
          position="relative"
          zIndex={10}
        >
          {children}
        </Main>

        {/* Premium Settings Modal (Functional Version) */}
        <SettingsModal 
          hasTrainer={false}
        />
      </Surface>
    </RegistryProvider>
  )
}

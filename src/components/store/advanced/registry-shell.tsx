'use client'

import React, { useEffect } from 'react'
import { RegistrySidebar } from './registry-sidebar'
import { RegistryMobileNavigation } from '@/components/store/advanced/registry-mobile-navigation'
import { RegistryBottomNav } from '@/components/store/advanced/registry-bottom-nav'
import { Modal } from './modal'
import { Settings } from 'lucide-react'
import { RegistryContext, RegistryColor } from '@/components/store/advanced/registry-context'
import { Box } from '../base/box'
import { cn } from '@/lib/utils'

interface RegistryShellProps {
  children: React.ReactNode
}

export function RegistryShell({ children }: RegistryShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('overview')
  const [activeSection, setActiveSection] = React.useState('branding')
  const [primaryColor, setPrimaryColor] = React.useState<RegistryColor>('blue')

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

  const lightColorMap: Record<RegistryColor, string> = {
    blue: 'from-blue-500/20',
    red: 'from-red-500/20',
    amber: 'from-amber-500/20',
    emerald: 'from-emerald-500/20',
    orange: 'from-orange-500/20',
    zinc: 'from-zinc-500/20'
  }

  const orbColorMap: Record<RegistryColor, string> = {
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
    amber: 'bg-amber-500/10',
    emerald: 'bg-emerald-500/10',
    orange: 'bg-orange-500/10',
    zinc: 'bg-zinc-500/10'
  }

  return (
    <RegistryContext.Provider value={{
      primaryColor,
      activeTab,
      setActiveTab,
      activeSection,
      setActiveSection,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      <Box minHeight="screen" bg="zinc" bgOpacity={100} overflowX="hidden" display="flex" direction="col" position="relative">
        
        {/* FIXED GLOBAL BACKGROUND EFFECTS */}
        <div 
          className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.22] pointer-events-none z-0" 
        />

        <div 
          className={cn(
            "fixed -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 z-0",
            lightColorMap[primaryColor] ? `bg-gradient-to-br ${lightColorMap[primaryColor]} to-transparent` : ""
          )} 
        />

        <div 
          className={cn(
            "fixed bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse pointer-events-none transition-colors duration-1000 z-0",
            orbColorMap[primaryColor]
          )} 
        />

        {/* Desktop Sidebar */}
        <RegistrySidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Mobile Navigation */}
        <RegistryMobileNavigation />
        <RegistryBottomNav />

        {/* Main Content Area */}
        <main className="flex-1 w-full lg:pl-72 transition-all duration-300 relative z-10">
          <div className="p-5">
            {children}
          </div>
        </main>

        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="Configurações"
          subtitle="Ajustes de Perfil e Sistema"
          icon={Settings}
          variant="orange"
          confirmLabel="Salvar"
          cancelLabel="Cancelar"
        />
      </Box>
    </RegistryContext.Provider>
  )
}

import React from 'react'
import { RegistrySidebar } from './registry-sidebar'
import { RegistryMobileNavigation } from '@/components/store/advanced/registry-mobile-navigation'
import { RegistryBottomNav } from '@/components/store/advanced/registry-bottom-nav'
import { Modal } from './modal'
import { Settings } from 'lucide-react'
import { RegistryContext, RegistryColor } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'

interface RegistryShellProps {
  children: React.ReactNode
}

export function RegistryShell({ children }: RegistryShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('overview')

  const tabs = [
    { id: 'overview', color: 'blue' as RegistryColor },
    { id: 'admin', color: 'red' as RegistryColor },
    { id: 'afiliado', color: 'amber' as RegistryColor },
    { id: 'personal', color: 'emerald' as RegistryColor },
    { id: 'aluno', color: 'orange' as RegistryColor },
  ]

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  return (
    <RegistryContext.Provider value={{
      primaryColor: currentTab.color,
      activeTab,
      setActiveTab
    }}>
      <div className="h-screen bg-zinc-950 overflow-hidden flex flex-col">
        {/* Desktop Sidebar */}
        <RegistrySidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Mobile Navigation */}
        <RegistryMobileNavigation />
        <RegistryBottomNav />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 overflow-auto p-5 lg:pl-[308px] transition-all duration-300"
          )}
        >
          {children}
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
      </div>
    </RegistryContext.Provider>
  )
}

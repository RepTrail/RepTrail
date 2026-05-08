import React from 'react'
import { RegistrySidebar } from './registry-sidebar'
import { RegistryMobileNavigation } from './registry-mobile-navigation'
import { RegistryBottomNav } from './registry-bottom-nav'
import { Box } from '../base/box'
import { Modal } from './modal'
import { Settings } from 'lucide-react'
import { RegistryContext, RegistryColor } from './registry-context'

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
      <Box height="screen" bg="background" overflow="hidden" display="flex" flexCol>
        {/* Desktop Sidebar */}
        <RegistrySidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Mobile Navigation */}
        <RegistryMobileNavigation />
        <RegistryBottomNav />

        {/* Main Content Area */}
        <Box
          as="main"
          flex1
          overflow="auto"
          lgPaddingLeft={72}
          paddingTop={20}
          lgPaddingTop={0}
          paddingBottom={32}
          lgPaddingBottom={0}
        >
          {children}
        </Box>

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

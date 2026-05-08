'use client'

import React from 'react'
import { RegistrySidebar } from './registry-sidebar'
import { RegistryMobileNavigation } from './registry-mobile-navigation'
import { RegistryBottomNav } from './registry-bottom-nav'
import { Box } from '../base/box'
import { Modal } from './modal'
import { Settings } from 'lucide-react'
import { RegistryProvider } from './registry-context'

interface RegistryShellProps {
  children: React.ReactNode
}

export function RegistryShell({ children }: RegistryShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  return (
    <RegistryProvider>
      <Box height="screen" bg="background" overflow="hidden" display="flex" flexCol>
        {/* Desktop Sidebar */}
        <RegistrySidebar />

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
        />
      </Box>
    </RegistryProvider>
  )
}

'use client'

import React, { createContext, useContext } from 'react'

export type RegistryColor = 'blue' | 'red' | 'amber' | 'emerald' | 'orange' | 'zinc'

interface RegistryContextProps {
  primaryColor: RegistryColor
  setPrimaryColor: (color: RegistryColor) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  activeSection: string
  setActiveSection: (section: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export const RegistryContext = createContext<RegistryContextProps | undefined>(undefined)

export function RegistryProvider({ 
  children, 
  defaultColor = 'blue',
  primaryColor: externalPrimaryColor,
  setPrimaryColor: externalSetPrimaryColor,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}: { 
  children: React.ReactNode, 
  defaultColor?: RegistryColor,
  primaryColor?: RegistryColor,
  setPrimaryColor?: (color: RegistryColor) => void,
  activeTab?: string,
  setActiveTab?: (tab: string) => void
}) {
  const [internalActiveTab, setInternalActiveTab] = React.useState('overview')
  const [activeSection, setActiveSection] = React.useState('branding')
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [internalPrimaryColor, setInternalPrimaryColor] = React.useState<RegistryColor>(defaultColor)

  const activeTab = externalActiveTab || internalActiveTab
  const setActiveTab = externalSetActiveTab || setInternalActiveTab
  const primaryColor = externalPrimaryColor || internalPrimaryColor
  const setPrimaryColor = externalSetPrimaryColor || setInternalPrimaryColor

  return (
    <RegistryContext.Provider value={{
      primaryColor,
      setPrimaryColor,
      activeTab,
      setActiveTab,
      activeSection,
      setActiveSection,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      {children}
    </RegistryContext.Provider>
  )
}

export function useRegistry() {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistry must be used within a RegistryProvider')
  }
  return context
}

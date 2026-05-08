'use client'

import React, { createContext, useContext, useState } from 'react'

export type RegistryColor = 'orange' | 'emerald' | 'red' | 'blue' | 'amber'

interface RegistryContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  primaryColor: RegistryColor
}

export const RegistryContext = createContext<RegistryContextType | undefined>(undefined)

export function RegistryProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('overview')

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
      activeTab, 
      setActiveTab, 
      primaryColor: currentTab.color 
    }}>
      {children}
    </RegistryContext.Provider>
  )
}

export function useRegistry() {
  const context = useContext(RegistryContext)
  if (!context) throw new Error('useRegistry must be used within a RegistryProvider')
  return context
}

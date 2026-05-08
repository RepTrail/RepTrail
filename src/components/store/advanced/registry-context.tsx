import React, { createContext, useContext } from 'react'

export type RegistryColor = 'blue' | 'red' | 'amber' | 'emerald' | 'orange' | 'zinc'

interface RegistryContextProps {
  primaryColor: RegistryColor
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const RegistryContext = createContext<RegistryContextProps | undefined>(undefined)

export function useRegistry() {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistry must be used within a RegistryProvider')
  }
  return context
}

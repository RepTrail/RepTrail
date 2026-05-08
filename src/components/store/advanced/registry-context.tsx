'use client'

import React, { createContext, useContext, useState } from 'react'

interface RegistryContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  primaryColor: 'orange' | 'emerald' | 'red' | 'blue' | 'amber'
}

const RegistryContext = createContext<RegistryContextType | undefined>(undefined)

export function RegistryProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('overview')

  const primaryColor = 
    activeTab === 'admin' ? 'red' : 
    activeTab === 'afiliado' ? 'amber' : 
    activeTab === 'personal' ? 'emerald' : 
    activeTab === 'aluno' ? 'orange' : 'blue'

  return (
    <RegistryContext.Provider value={{ activeTab, setActiveTab, primaryColor }}>
      {children}
    </RegistryContext.Provider>
  )
}

export function useRegistry() {
  const context = useContext(RegistryContext)
  if (!context) throw new Error('useRegistry must be used within a RegistryProvider')
  return context
}

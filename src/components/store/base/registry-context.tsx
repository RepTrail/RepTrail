'use client'

import React, { createContext, useContext, useEffect } from 'react'

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

  useEffect(() => {
    const colors: Record<string, string> = {
      blue: '#3b82f6',
      red: '#ef4444',
      amber: '#f59e0b',
      emerald: '#10b981',
      orange: '#f97316',
      zinc: '#71717a'
    }

    const hex = colors[primaryColor] || colors.blue
    const root = document.documentElement
    
    root.style.setProperty('--primary-dynamic', hex)
    root.style.setProperty('--primary-dynamic-rgb', hexToRgb(hex))

    const styleId = 'dynamic-theme-overrides'
    let styleTag = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleId
      document.head.appendChild(styleTag)
    }
    
    styleTag.innerHTML = `
      #nprogress .bar {
        background: ${hex} !important;
        box-shadow: 0 0 10px ${hex}, 0 0 5px ${hex} !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px ${hex}, 0 0 5px ${hex} !important;
      }
      #nprogress .spinner-icon {
        border-top-color: ${hex} !important;
        border-left-color: ${hex} !important;
      }
    `
  }, [primaryColor])

  console.log('RegistryProvider render, primaryColor:', primaryColor)

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

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export function useRegistry() {
  const context = useContext(RegistryContext)
  if (!context) {
    console.warn('useRegistry called without RegistryProvider!')
    return {
      primaryColor: 'zinc' as RegistryColor,
      setPrimaryColor: () => {},
      activeTab: 'overview',
      setActiveTab: () => {},
      activeSection: '',
      setActiveSection: () => {},
      isSidebarOpen: false,
      setIsSidebarOpen: () => {}
    }
  }
  return context
}

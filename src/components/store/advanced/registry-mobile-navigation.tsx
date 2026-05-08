'use client'

import React from 'react'
import { Logo } from '../base/logo'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Menu } from 'lucide-react'
import { useRegistry } from './registry-context'
import { MobileHeaderContainer, Inline } from '../base/layout'

import { GlassPanel } from '../base/surface'

export function RegistryMobileNavigation() {
  const { primaryColor, setIsSidebarOpen, isSidebarOpen } = useRegistry()

  return (
    <MobileHeaderContainer>
      <Inline justify="between" fullWidth align="center">
        <Logo size="sm" color={primaryColor as any} />
        
        <GlassPanel padding={0} rounded="system" className="p-1">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center justify-center w-10 h-10 active:scale-90 transition-transform"
            >
                <Icon icon={Menu} color={primaryColor as any} size="sm" />
            </button>
        </GlassPanel>
      </Inline>
    </MobileHeaderContainer>
  )
}

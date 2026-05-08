'use client'

import React from 'react'
import { Logo } from '../base/logo'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LayoutDashboard } from 'lucide-react'
import { useRegistry } from './registry-context'
import { MobileHeaderContainer, Inline } from '../base/layout'

export function RegistryMobileNavigation() {
  const { primaryColor } = useRegistry()

  return (
    <MobileHeaderContainer>
      <Inline justify="between" fullWidth>
        <Logo size="sm" color={primaryColor as any} />
        
        <Inline gap={2.5}>
            <Icon icon={LayoutDashboard} color={primaryColor as any} size="sm" />
            <Font variant="auxiliary" weight="black" uppercase italic color={primaryColor as any}>
                REGISTRY
            </Font>
        </Inline>
      </Inline>
    </MobileHeaderContainer>
  )
}

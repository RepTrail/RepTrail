'use client'

import React from 'react'
import { Logo } from '@/components/store/base/logo'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Menu } from 'lucide-react'
import { useRegistry } from './registry-context'
import { MobileHeaderContainer, Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens';

export function RegistryMobileNavigation() {
  const { primaryColor, setIsSidebarOpen, isSidebarOpen } = useRegistry()

  return (
    <MobileHeaderContainer>
      <Inline justify="between" fullWidth align="center">
        <Logo size="sm" color={primaryColor as any} />

        <Box 
          as="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          width="10"
          height="10"
          display="flex"
          align="center"
          justify="center"
          bg="primary"
          bgOpacity={20}
          border
          borderColor="primary"
          borderOpacity={80}
          rounded={STORE_TOKENS.RADIUS.SYSTEM}
        >
          <Icon icon={Menu} color={primaryColor as any} size="sm" />
        </Box>
      </Inline>
    </MobileHeaderContainer>
  )
}

'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React from 'react'
import { Icon } from '@/components/store/base/icon'
import { 
  BarChart3, 
  Users2, 
  HeartHandshake, 
  Zap, 
  Users,
  Dumbbell
} from 'lucide-react'
import { useRegistry } from './registry-context'
import { MobileNavContainer } from '@/components/store/base/layout'
import { Button } from '@/components/store/base/button'

export function RegistryBottomNav() {
  const { activeTab, setActiveTab, primaryColor } = useRegistry()

  const items = [
    { id: 'overview', label: 'Over', icon: BarChart3 },
    { id: 'components', label: 'Comp', icon: Dumbbell },
    { id: 'admin', label: 'Admin', icon: Users2 },
    { id: 'afiliado', label: 'Afil', icon: HeartHandshake },
    { id: 'personal', label: 'Pers', icon: Zap },
    { id: 'aluno', label: 'Aluno', icon: Users },
  ]

  return (
    <MobileNavContainer>
      {items.map((item) => {
        const isActive = activeTab === item.id
        const variant = `outline-${primaryColor}` as any

        return (
          <Button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            variant={isActive ? variant : 'ghost'}
            size="md"
            rounded={isActive ? STORE_TOKENS.RADIUS.SYSTEM : STORE_TOKENS.RADIUS.FULL}
            isIconOnly
            activeScale={90}
            transition
          >
            <Icon 
              icon={item.icon} 
              size="sm" 
              color={(isActive ? primaryColor : STORE_TOKENS.COLORS.WHITE) as any} 
              opacity={isActive ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.SIDEBAR}
            />
          </Button>
        );
      })}
    </MobileNavContainer>
  );
}

'use client'

import React from 'react'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { 
  BarChart3, 
  Users2, 
  HeartHandshake, 
  Zap, 
  Users,
  Dumbbell
} from 'lucide-react'
import { useRegistry } from './registry-context'
import { MobileNavContainer } from '../base/layout'
import { Button } from '../base/button'

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
            rounded={isActive ? 'system' : 'full'}
            isIconOnly
            className="transition-transform active:scale-90"
          >
            <Icon 
              icon={item.icon} 
              size="sm" 
              color={(isActive ? primaryColor : 'white') as any} 
              className={isActive ? 'opacity-100' : 'opacity-40'}
            />
          </Button>
        )
      })}
    </MobileNavContainer>
  )
}

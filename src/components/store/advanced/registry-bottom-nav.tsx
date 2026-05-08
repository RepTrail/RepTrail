import React from 'react'
import { Stack } from '../base/stack'
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
import { cn } from '@/lib/utils'

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
    <div
      className={cn(
        "fixed left-0 bottom-0 h-20 w-full bg-zinc-950 border-t border-white/5 md:hidden z-40 px-5 flex items-center"
      )}
    >
      <div className="flex flex-row justify-around items-center w-full">
        {items.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-2 rounded-[5px] transition-all",
                isActive && {
                  'bg-blue-500/10': primaryColor === 'blue',
                  'bg-red-500/10': primaryColor === 'red',
                  'bg-amber-500/10': primaryColor === 'amber',
                  'bg-emerald-500/10': primaryColor === 'emerald',
                  'bg-orange-500/10': primaryColor === 'orange',
                }
              )}
            >
              <Icon 
                icon={item.icon} 
                size="sm" 
                color={(isActive ? primaryColor : 'zinc-500') as any} 
              />
              <Font 
                variant="sub-tiny" 
                color={(isActive ? primaryColor : 'zinc-600') as any}
                weight={isActive ? 'black' : 'medium'}
                uppercase
                scale={75}
              >
                {item.label}
              </Font>
            </button>
          )
        })}
      </div>
    </div>
  )
}

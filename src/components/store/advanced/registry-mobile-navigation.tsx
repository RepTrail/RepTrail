import React from 'react'
import { Logo } from '../base/logo'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LayoutDashboard } from 'lucide-react'
import { useRegistry } from './registry-context'
import { cn } from '@/lib/utils'

export function RegistryMobileNavigation() {
  const { primaryColor } = useRegistry()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 w-full h-20 bg-zinc-950 border-b border-white/5 md:hidden z-40 px-5 flex items-center"
      )}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <Logo size="sm" color={primaryColor as any} />
        
        <div className="flex flex-row items-center gap-2.5">
            <Icon icon={LayoutDashboard} color={primaryColor as any} size="sm" />
            <Font variant="auxiliary" weight="black" uppercase italic color={primaryColor as any}>
                REGISTRY
            </Font>
        </div>
      </div>
    </div>
  )
}

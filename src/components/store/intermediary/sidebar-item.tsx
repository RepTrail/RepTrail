import React from 'react'
import { BaseSidebarLink } from '@/components/store/base/sidebar-link'
import { LucideIcon } from 'lucide-react'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  href?: string
  variant?: 'orange' | 'emerald' | 'red' | 'amber' | 'blue'
}

export function SidebarItem(props: SidebarItemProps) {
  return <BaseSidebarLink {...props} />
}

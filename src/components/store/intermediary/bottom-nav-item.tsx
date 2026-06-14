'use client'

import { LucideIcon } from 'lucide-react'
import { RegistryColor } from '@/components/store/base/registry-context'
import { BaseBottomNavLink } from '@/components/store/base/bottom-nav-link'

interface BottomNavItemProps {
  icon: LucideIcon
  active?: boolean
  onClick?: () => void
  href?: string
  variant?: RegistryColor
}

export function BottomNavItem({
  icon,
  active,
  onClick,
  href,
  variant = 'orange'
}: BottomNavItemProps) {
  return (
    <BaseBottomNavLink
      icon={icon}
      active={active}
      onClick={onClick}
      href={href}
      variant={variant}
    />
  )
}

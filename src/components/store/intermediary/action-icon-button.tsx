'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button, ButtonVariant } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ActionIconButtonProps {
  icon: LucideIcon
  variant: ButtonVariant
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

/**
 * ActionIconButton: Standardized icon button for list actions and quick interactions.
 */
export function ActionIconButton({ 
  icon: IconComp, 
  variant, 
  onClick,
  disabled,
  loading
}: ActionIconButtonProps) {
  return (
    <Button 
      variant={variant} 
      size="sm" 
      rounded={STORE_TOKENS.RADIUS.FULL} 
      isIconOnly 
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      hoverScale={110}
      activeScale={95}
      transition
    >
      <Icon icon={IconComp} size="xs" />
    </Button>
  )
}

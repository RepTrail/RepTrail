'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CircleIconProps {
  icon: LucideIcon
  color?: 'blue' | 'orange' | 'emerald' | 'red' | 'zinc'
  size?: 'xs' | 'sm' | 'md'
}

/**
 * CircleIcon: A circular container for icons with themed borders and backgrounds.
 */
export function CircleIcon({ 
  icon: IconComp, 
  color = 'zinc',
  size = 'sm'
}: CircleIconProps) {
  const sizePx = {
    xs: 32,
    sm: 40,
    md: 48
  }

  return (
    <Box 
      shrink={0}
      width={sizePx[size]}
      height={sizePx[size]}
      display="flex"
      align="center"
      justify="center"
      border
      rounded={STORE_TOKENS.RADIUS.FULL}
      bg={color}
      bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
      borderColor={color}
      transition
    >
      <Icon icon={IconComp} size="xs" color={color === STORE_TOKENS.COLORS.BACKGROUND ? STORE_TOKENS.COLORS.TEXT.SECONDARY : color} />
    </Box>
  );
}

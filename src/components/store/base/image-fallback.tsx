'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon, Image as ImageIcon } from 'lucide-react'
import { Icon } from './icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ImageFallbackProps {
  icon?: LucideIcon
  className?: never
}

/**
 * ImageFallback: Standard placeholder for missing or broken images.
 * Adheres to Liquid Glass aesthetics with subtle dark tones.
 */
export function ImageFallback({ 
  icon: IconComp = ImageIcon, 
  className 
}: ImageFallbackProps) {
  return (
    <div className={cn(
      "w-full h-full flex items-center justify-center bg-zinc-950/80 border border-white/5 overflow-hidden",
      STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
      className
    )}>
      <div className="opacity-10 scale-150">
        <Icon icon={IconComp} size="xl" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'
import { GlassPanel } from '../base/surface'
import { cn } from '@/lib/utils'

interface Option {
  id: string
  label: string
  icon?: LucideIcon
  activeVariant?: 'outline-red' | 'outline-blue' | 'outline-amber' | 'outline-emerald' | 'outline-orange' | 'outline-indigo'
}

interface SegmentedSwitchProps {
  options: Option[]
  activeId: string
  onSelect: (id: string) => void
  fullWidth?: boolean
  defaultActiveVariant?: Option['activeVariant']
}

export function SegmentedSwitch({ 
  options, 
  activeId, 
  onSelect, 
  fullWidth = true,
  defaultActiveVariant = 'outline-red'
}: SegmentedSwitchProps) {
  return (
    <GlassPanel 
      padding={2.5} 
      rounded="full" 
      className={cn(
        "no-scrollbar overflow-x-auto",
        fullWidth ? "w-full" : "w-auto"
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <Stack direction="row" gap={2.5} wrap={false}>
        {options.map((option) => {
          const isActive = activeId === option.id
          const variant = option.activeVariant || defaultActiveVariant
          const colorToken = variant.split('-')[1]

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group flex-shrink-0 transition-all duration-300",
                "px-5 py-2.5 rounded-full flex items-center justify-center gap-2.5 border-2",
                fullWidth && "flex-1",
                isActive ? (
                  cn(
                    "shadow-lg",
                    colorToken === 'blue' && "bg-blue-500/20 border-blue-500/50 text-blue-500 shadow-blue-500/10",
                    colorToken === 'red' && "bg-red-500/20 border-red-500/50 text-red-500 shadow-red-500/10",
                    colorToken === 'amber' && "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-amber-500/10",
                    colorToken === 'emerald' && "bg-emerald-500/20 border-emerald-500/50 text-emerald-500 shadow-emerald-500/10",
                    colorToken === 'orange' && "bg-orange-500/20 border-orange-500/50 text-orange-500 shadow-orange-500/10"
                  )
                ) : (
                  "bg-transparent border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                )
              )}
            >
              {option.icon && (
                <Icon 
                  icon={option.icon} 
                  size="xs" 
                  color={(isActive ? colorToken : 'zinc-500') as any} 
                />
              )}
              <Font 
                variant="sub-tiny" 
                weight="black" 
                uppercase 
                italic 
                color={(isActive ? colorToken : 'zinc-500') as any}
                nowrap
                className="leading-none"
              >
                {option.label}
              </Font>
            </button>
          )
        })}
      </Stack>
    </GlassPanel>
  )
}

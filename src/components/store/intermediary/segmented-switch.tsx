'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'
import { GlassPanel } from '../base/surface'
import { Button } from '../base/button'
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
      padding={0} 
      rounded="full" 
      overflow="hidden"
      fullWidth={fullWidth}
    >
      <Box 
        overflowX="auto" 
        noScrollbar 
        fullWidth
      >
        <Stack 
          direction="row" 
          gap={1} 
          wrap={false} 
          padding={1}
          align="stretch"
        >
          {options.map((option) => {
            const isActive = activeId === option.id
            const variant = option.activeVariant || defaultActiveVariant
            const colorToken = variant.split('-')[1]

            return (
              <Button
                key={option.id}
                onClick={() => onSelect(option.id)}
                variant={isActive ? variant : 'ghost'}
                rounded="full"
                size="sm"
                className={cn(
                  'shrink-0 min-w-fit px-5 transition-all duration-300',
                  fullWidth && 'md:flex-1'
                )}
              >
                <Stack direction="row" align="center" gap={2.5} wrap={false}>
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
                  >
                    {option.label}
                  </Font>
                </Stack>
              </Button>
            )
          })}
        </Stack>
      </Box>
    </GlassPanel>
  )
}

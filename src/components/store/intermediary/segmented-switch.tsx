'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { LucideIcon } from 'lucide-react'
import { GlassPanel } from '@/components/store/base/surface'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface Option {
  id: string
  label: string
  icon?: LucideIcon
  activeVariant?: 'outline-red' | 'outline-blue' | 'outline-amber' | 'outline-emerald' | 'outline-orange' | 'outline-indigo' | 'outline-primary'
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
      padding="none"
      rounded={STORE_TOKENS.RADIUS.FULL}
      overflow="hidden"
      fullWidth={fullWidth}
    >
      <Box
        overflowX="auto"
        noScrollbar
        fullWidth
        className="snap-x snap-mandatory scroll-smooth"
      >
        <Stack
          direction="row"
          gap={STORE_TOKENS.SPACING.ELEMENT}
          wrap="nowrap"
          padding="element"
          align="stretch"
          fullWidth
        >
          {options.map((option) => {
            const isActive = activeId === option.id
            const variant = option.activeVariant || defaultActiveVariant
            const colorToken = variant.split('-')[1]
            const isFewOptions = options.length <= 2

            return (
              <Button
                key={option.id}
                onClick={() => onSelect(option.id)}
                variant={isActive ? variant : 'ghost'}
                rounded={STORE_TOKENS.RADIUS.FULL}
                size="sm"
                flex1={{ base: isFewOptions, md: true }}
                shrink={{ base: isFewOptions ? 1 : 0, md: 1 }}
                minWidth={{ base: isFewOptions ? '0' : 'calc(50% - 15px)', md: '0' }}
                transition
                className="snap-center"
              >
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="nowrap">
                  {option.icon && (
                    <Icon
                      icon={option.icon}
                      size="xs"
                      color={(isActive ? colorToken : 'zinc-500') as any}
                    />
                  )}
                  <Font
                    {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                    color={(isActive ? colorToken : 'zinc-500') as any}
                  >
                    {option.label}
                  </Font>
                </Stack>
              </Button>
            )
          })}
          {/* Spacer to ensure right padding on horizontal scroll */}
          <Box flex="none" width={STORE_TOKENS.SPACING.ELEMENT} height={1} />
        </Stack>
      </Box>
    </GlassPanel>
  )
}

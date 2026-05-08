'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    id: string
    label: string
    icon?: LucideIcon
    activeVariant?: 'outline-blue' | 'outline-red' | 'outline-amber' | 'outline-emerald' | 'outline-orange'
}

interface SegmentedSwitchProps {
    options: Option[]
    activeId?: string
    onSelect?: (id: string) => void
    defaultActiveVariant?: Option['activeVariant']
}

export function SegmentedSwitch({ 
    options, 
    activeId, 
    onSelect,
    defaultActiveVariant = 'outline-blue'
}: SegmentedSwitchProps) {
    return (
        <Box bg="zinc-950/40" padding={1.5} rounded="full" border="white/5" display="flex" width="fit-content">
            <Stack direction="row" gap={1.5} align="center">
                {options.map((option) => {
                    const isActive = activeId === option.id
                    const variant = option.activeVariant || defaultActiveVariant
                    
                    return (
                        <Box
                            key={option.id}
                            paddingX={5}
                            paddingY={2.5}
                            rounded="full"
                            cursor="pointer"
                            transition="all"
                            bg={isActive ? 'white/5' : 'transparent'}
                            border={isActive ? (variant.replace('outline-', '') as any) : 'transparent'}
                            onClick={() => onSelect?.(option.id)}
                            display="flex"
                            align="center"
                            gap={2.5}
                        >
                            {option.icon && (
                                <Icon 
                                    icon={option.icon} 
                                    size="xs" 
                                    color={isActive ? (variant.replace('outline-', '') as any) : 'zinc-600'} 
                                />
                            )}
                            <Font 
                                variant="label-caps" 
                                weight={isActive ? "black" : "bold"}
                                color={isActive ? "white" : "zinc-600"}
                                italic={isActive}
                            >
                                {option.label}
                            </Font>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    )
}

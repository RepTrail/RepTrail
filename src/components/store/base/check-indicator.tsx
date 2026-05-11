'use client'

import React from 'react'
import { Box, BoxProps } from './box'
import { Icon } from './icon'
import { Circle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckIndicatorProps extends Omit<BoxProps, 'children'> {
    checked?: boolean
    color?: 'emerald' | 'zinc'
    size?: 'sm' | 'md' | 'lg'
}

/**
 * CheckIndicator: Standardized circular indicator for list items.
 * Guarantees perfect 1:1 aspect ratio and consistent aesthetics.
 */
export function CheckIndicator({ 
    checked, 
    color = 'zinc', 
    size = 'md',
    className,
    ...props 
}: CheckIndicatorProps) {
    const sizeMap = {
        sm: '8',
        md: '10',
        lg: '12'
    }

    const resolvedSize = sizeMap[size] as any

    return (
        <Box
            width={resolvedSize}
            height={resolvedSize}
            rounded="full"
            bg={checked ? 'emerald' : 'zinc'}
            bgOpacity={checked ? 100 : 100}
            display="flex"
            align="center"
            justify="center"
            shrink={0}
            transition
            className={cn(
                "aspect-square shadow-lg",
                checked ? "bg-emerald-500 shadow-emerald-500/20" : "bg-zinc-950 shadow-black/40",
                className
            )}
            {...props}
        >
            <Icon 
                icon={checked ? Check : Circle} 
                size={size === 'lg' ? 'md' : 'sm'} 
                color={checked ? 'black' : 'zinc-600'} 
                className={cn("transition-all", checked ? "scale-110" : "opacity-40")}
            />
        </Box>
    )
}

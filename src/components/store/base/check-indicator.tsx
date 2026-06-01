'use client'

import React from 'react'
import { Box, BoxProps } from './box'
import { Icon } from './icon'
import { Circle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CheckIndicatorProps extends Omit<BoxProps, 'children' | 'className'> {
    checked?: boolean
    color?: 'emerald' | 'zinc'
    size?: 'sm' | 'md' | 'lg'
    className?: string
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
        <div
            className={cn(
                "flex items-center justify-center shrink-0 transition-all duration-500 ease-out",
                size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12',
                STORE_TOKENS.RADIUS.FULL === 'full' ? 'rounded-full' : 'rounded-[5px]',
                "aspect-square shadow-lg",
                checked ? "bg-emerald-500 shadow-emerald-500/20" : "bg-zinc-950 shadow-black/40",
                className
            )}
            {...(props as any)}
        >
            <Icon 
                icon={checked ? Check : Circle} 
                size={size === 'lg' ? 'md' : 'sm'} 
                color={checked ? STORE_TOKENS.COLORS.BLACK : STORE_TOKENS.COLORS.TEXT.DIM} 
            />
        </div>
    );
}

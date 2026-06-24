'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'
import { STORE_TOKENS } from '../constants/tokens'

interface LinearProgressProps {
    value: number
    color?: 'success' | 'warning' | 'error' | 'brand' | 'info'
    height?: number
    className?: never
}

/**
 * LinearProgress: High-fidelity linear progress bar for the design system.
 * Built to encapsulate the percentage width calculation without leaking styles.
 */
export function LinearProgress({
    value,
    color = 'success',
    height = 6,
    className
}: LinearProgressProps) {
    const clampedValue = Math.min(100, Math.max(0, value))

    const colorMap = {
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
        brand: 'bg-primary',
        info: 'bg-blue-500'
    }

    return (
        <Box 
            width="full" 
            height={height} 
            bg={STORE_TOKENS.COLORS.BACKGROUND} 
            bgOpacity={STORE_TOKENS.OPACITY.MODAL} 
            rounded={STORE_TOKENS.RADIUS.FULL} 
            overflow="hidden"
            className={className}
        >
            <div 
                className={cn(
                    "h-full transition-all duration-700 ease-in-out",
                    colorMap[color]
                )}
                style={{ width: `${clampedValue}%` }}
            />
        </Box>
    )
}

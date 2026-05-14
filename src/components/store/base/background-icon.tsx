'use client'

import React from 'react'
import { Box } from './box'
import { Icon } from './icon'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens';

interface BackgroundIconProps {
    icon: LucideIcon
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '100'
    color?: 'white' | 'primary' | 'zinc' | 'black' | 'emerald' | 'orange' | 'amber' | 'red' | 'blue' | 'indigo' | 'success' | 'warning' | 'neutral'
    opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
    groupHoverOpacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
    width?: '10' | '24' | 'auto' | 'full' | 'px' | 'half' | 'sidebar'
    height?: '10' | '24' | 'auto' | 'full' | 'px' | 'screen' | '8'
    transition?: boolean
    zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 100 | 'auto'
}

/**
 * BackgroundIcon: A semantic primitive for placing subtle, decorative icons 
 * in the background of cards, panels, or sections. 
 * Replaces inline absolute Box wrappers.
 */
export function BackgroundIcon({
    icon,
    size = '3xl',
    color = 'white',
    opacity = 10,
    groupHoverOpacity,
    top,
    right,
    bottom,
    left,
    width = '24',
    height = '24',
    transition = true,
    zIndex = 0
}: BackgroundIconProps) {
    return (
        <Box
            position="absolute"
            top={top}
            right={right}
            bottom={bottom}
            left={left}
            width={width as any}
            height={height as any}
            opacity={opacity}
            groupHoverOpacity={groupHoverOpacity}
            transition={transition}
            zIndex={zIndex}
            display="flex"
            align="center"
            justify="center"
            style={{ pointerEvents: 'none' }}
        >
            <Icon icon={icon} size={size} color={STORE_TOKENS.COLORS.BRAND} />
        </Box>
    )
}

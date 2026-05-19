'use client'

import React from 'react'
import { Box } from './box'
import { Icon } from './icon'
import { LucideIcon } from 'lucide-react'

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
 * Standardized to always sit at top-right, size 100, and opacity 10%.
 */
export function BackgroundIcon({
    icon,
    zIndex = 0
}: BackgroundIconProps) {
    return (
        <Box
            position="absolute"
            top={0}
            right={0}
            width="auto"
            height="auto"
            opacity={10}
            zIndex={zIndex}
            display="flex"
            align="center"
            justify="center"
            style={{ pointerEvents: 'none' }}
        >
            <Icon icon={icon} size="100" color="primary" />
        </Box>
    )
}

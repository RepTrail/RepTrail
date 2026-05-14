'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { RegistryColor, useRegistry } from './registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { BackgroundEffects } from '@/components/store/base/background-effects'

interface AuthShellProps {
    children: React.ReactNode
}

const lightColorMap: Record<RegistryColor, string> = {
    blue:    '#3b82f633',
    red:     '#ef444433',
    amber:   '#f59e0b33',
    emerald: '#10b98133',
    orange:  '#f9731633',
    zinc:    '#71717a33',
}

const orbColorMap: Record<RegistryColor, string> = {
    blue:    '#3b82f61a',
    red:     '#ef44441a',
    amber:   '#f59e0b1a',
    emerald: '#10b9811a',
    orange:  '#f973161a',
    zinc:    '#71717a1a',
}   

export function AuthShell({ children }: AuthShellProps) {
    const { primaryColor } = useRegistry()

    return (
        <Box
            minHeight="screen"
            bg={STORE_TOKENS.COLORS.BACKGROUND}
            bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
            overflow="hidden"
            display="flex"
            align="center"
            justify="center"
            position="relative"
            padding={STORE_TOKENS.PADDING.CONTAINER}
        >
            {/* Background Effects (Grid & Orbs) — Unified Base Component */}
            <BackgroundEffects variant="all" />

            <Box position="relative" zIndex={10} fullWidth display="flex" align="center" justify="center">
                {children}
            </Box>
        </Box>
    )
}

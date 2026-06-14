import React from 'react'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryProvider } from '@/components/store/base/registry-context'

interface PublicProfileShellProps {
    children: React.ReactNode
    color?: 'emerald' | 'orange' | 'blue' | 'red'
}

export function PublicProfileShell({ children, color = 'emerald' }: PublicProfileShellProps) {
    return (
        <Surface
            minHeight="screen"
            bg={STORE_TOKENS.COLORS.BACKGROUND}
            bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
            overflowX="hidden"
            display="flex"
            direction="col"
            position="relative"
        >
            <BackgroundEffects variant="all" />
            <Box position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT} flex1>
                <RegistryProvider defaultColor={color}>
                    {children}
                </RegistryProvider>
            </Box>
        </Surface>
    )
}

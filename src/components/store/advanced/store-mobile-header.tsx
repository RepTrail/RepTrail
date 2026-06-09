'use client'

import React from 'react'
import { Logo } from '@/components/store/base/logo'
import { Icon } from '@/components/store/base/icon'
import { Menu } from 'lucide-react'
import { MobileHeaderContainer, Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useRegistry } from './registry-context'

interface StoreMobileHeaderProps {
    onMenuClick?: () => void
}

/**
 * StoreMobileHeader: Canonical mobile header for all dashboards and registry pages.
 * Enforces Design System governance and visual parity across the entire RepTrail Store.
 */
export function StoreMobileHeader({ onMenuClick }: StoreMobileHeaderProps) {
    const { primaryColor, setIsSidebarOpen, isSidebarOpen } = useRegistry()

    const handleToggle = () => {
        if (onMenuClick) {
            onMenuClick()
        } else {
            setIsSidebarOpen(!isSidebarOpen)
        }
    }

    return (
        <MobileHeaderContainer>
            <Inline justify="between" fullWidth align="center">
                <Logo size="sm" color={primaryColor as any} />

                <Box
                    as="button"
                    id="tour-mobile-hamburger"
                    onClick={handleToggle}
                    padding={STORE_TOKENS.PADDING.ELEMENT}
                    display="flex"
                    align="center"
                    justify="center"
                    bg={STORE_TOKENS.COLORS.BRAND}
                    bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                    border
                    borderColor={STORE_TOKENS.COLORS.BRAND}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    transition
                    hoverBgOpacity={STORE_TOKENS.OPACITY.HIGH}
                    cursor="pointer"
                >
                    <Icon icon={Menu} color={primaryColor as any} size="sm" />
                </Box>
            </Inline>
        </MobileHeaderContainer>
    );
}

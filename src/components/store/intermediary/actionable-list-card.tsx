'use client'

import React from 'react'
import { GlassPanel } from '../base/surface'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { cn } from '@/lib/utils'

export interface ActionableListCardProps {
    children: React.ReactNode // Main content (Identity block)
    badges?: React.ReactNode  // Badges block
    actions?: React.ReactNode // Action buttons block
    isLogItem?: boolean // Toggle for log item specific overlay styles
    isStrictHorizontal?: boolean // Toggle to keep it horizontal on mobile
    footer?: React.ReactNode // Optional footer area (e.g. for log details)
}

export function ActionableListCard({ children, badges, actions, isLogItem, isStrictHorizontal, footer }: ActionableListCardProps) {
    const hasActions = !!actions

    return (
        <GlassPanel
            padding={0}
            transition
            group
            hoverBorder="white/20"
            overflow="hidden"
            fullWidth
        >
            <Stack gap={0} fullWidth>
                <Box
                    fullWidth
                    position="relative"
                    display="flex"
                    direction="row"
                    align="stretch"
                >
                    {/* Main Content Area */}
                    <Stack
                        direction={isStrictHorizontal ? 'row' : { base: 'col', lg: 'row' }}
                        align={isStrictHorizontal ? 'center' : { base: 'stretch', lg: 'center' }}
                        justify="between"
                        padding={5}
                        gap={5}
                        flex1
                        minWidth={0}
                    >
                        {/* Identity Block */}
                        <Box flex1 minWidth={0} fullWidth>
                            {children}
                        </Box>

                        {/* Badges Block */}
                        {badges && (
                            <Box transition wrap="wrap" display="flex" align="center" gap={2.5} shrink={0}>
                                {badges}
                            </Box>
                        )}
                    </Stack>

                    {/* Actions Sidebar */}
                    {hasActions && (
                        <Box
                            display={{ base: 'flex', lg: 'none' }} // Hide on PC by default
                            groupHoverDisplay="flex" // Show on PC hover
                            direction="row"
                            align="stretch"
                            transition
                            shrink={0}
                        >
                            {/* Container-based Separator (Rule 140) */}
                            <Box width="px" bg="white" bgOpacity={10} shrink={0} />

                            {/* Actions Stack (Vertical on Mobile, Horizontal on PC) */}
                            <Stack
                                direction={{ base: 'col', lg: 'row' }}
                                padding={5}
                                gap={2.5}
                                align="center"
                                justify="center"
                                bg="transparent"
                                shrink={0}
                            >
                                {actions}
                            </Stack>
                        </Box>
                    )}
                </Box>

                {footer && (
                    <>
                        <Box width="full" height="px" bg="white" bgOpacity={10} />
                        <Box padding={5} fullWidth>
                            {footer}
                        </Box>
                    </>
                )}
            </Stack>
        </GlassPanel>
    )
}

'use client'

import React from 'react'
import { GlassPanel } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export interface ActionableListCardProps {
    children: React.ReactNode // Main content (Identity block)
    badges?: React.ReactNode  // Badges block
    actions?: React.ReactNode // Action buttons block
    isLogItem?: boolean // Toggle for log item specific overlay styles
    isStrictHorizontal?: boolean // Toggle to keep it horizontal on mobile
    footer?: React.ReactNode // Optional footer area (e.g. for log details)
}

export function ActionableListCard({ children, badges, actions, isStrictHorizontal, footer }: ActionableListCardProps) {
    const hasActions = !!actions

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.NONE}
            transition
            group
            hoverBorder="white/20"
            overflow="hidden"
            fullWidth
        >
            <Stack gap={STORE_TOKENS.SPACING.NONE} fullWidth>
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
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                        flex1
                        minWidth={0}
                    >
                        {/* Identity Block */}
                        <Box flex1 minWidth={0} fullWidth>
                            {children}
                        </Box>

                        {/* Badges Block */}
                        {badges && (
                            <Box transition wrap="wrap" display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                                {badges}
                            </Box>
                        )}
                    </Stack>

                    {/* Actions Sidebar */}
                    {hasActions && (
                        <Box
                            display="flex"
                            direction="row"
                            align="stretch"
                            shrink={0}
                        >
                            {/* Container-based Separator (Rule 140) */}
                            <Box width="px" bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} shrink={0} />

                            {/* Actions Stack (Vertical on Mobile, Horizontal on PC) */}
                            <Stack
                                direction={{ base: 'col', lg: 'row' }}
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                align="center"
                                justify="center"
                                bg={STORE_TOKENS.COLORS.TRANSPARENT}
                                shrink={0}
                            >
                                {actions}
                            </Stack>
                        </Box>
                    )}
                </Box>

                {footer && (
                    <>
                        <Box width="full" height="px" bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                            {footer}
                        </Box>
                    </>
                )}
            </Stack>
        </GlassPanel >
    );
}

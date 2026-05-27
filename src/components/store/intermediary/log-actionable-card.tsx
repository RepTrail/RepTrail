'use client'

import React from 'react'
import { GlassPanel } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Divider } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export interface ActionableListCardProps {
    children: React.ReactNode // Main content (Identity block)
    badges?: React.ReactNode  // Badges block
    actions?: React.ReactNode // Action buttons block
    isLogItem?: boolean // Toggle for log item specific overlay styles
    isStrictHorizontal?: boolean // Toggle to keep it horizontal on mobile
    actionWidth?: 'sidebar' | 'sidebar-wide' | 'auto'
}

export function ActionableListCard({ children, badges, actions, isLogItem, isStrictHorizontal, actionWidth }: ActionableListCardProps) {
    const hasActions = !!actions

    return (
        <GlassPanel
            padding="none"
            transition
            group
            hoverBorder="white/20"
            overflow="hidden"
            fullWidth
        >
            <Box
                fullWidth
                position="relative"
                display="flex"
                direction={isLogItem ? 'col' : { base: 'col', md: 'row' }}
                align="stretch"
            >
                {/* Main Content Area */}
                <Stack
                    direction={isStrictHorizontal ? 'row' : { base: 'col', md: 'row' }}
                    align={isStrictHorizontal ? 'center' : { base: 'stretch', md: 'center' }}
                    justify="between"
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    gap={STORE_TOKENS.SPACING.CONTAINER}
                    flex1
                    minWidth={0}
                >
                    {/* Identity Block */}
                    <Box flex1 minWidth={0}>
                        {children}
                    </Box>

                    {/* Badges Block */}
                    {badges && (
                        <Box transition wrap="wrap" display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                            {badges}
                        </Box>
                    )}
                </Stack>

                {/* Actions Sidebar / Bottom Block */}
                {hasActions && (
                    <Box
                        display={isLogItem ? 'flex' : { base: 'flex', md: 'none' }} 
                        groupHoverDisplay={isLogItem ? undefined : 'flex'}
                        direction={isLogItem ? 'col' : { base: 'col', md: 'row' }}
                        align="stretch"
                        transition
                        shrink={0}
                        width={isLogItem ? 'full' : { base: 'full', md: actionWidth || 'sidebar' }}
                        overflow="hidden"
                    >
                        {/* Container-based Separator (Rule 140) */}
                        <Divider
                            direction={{ 
                                base: 'horizontal', 
                                md: isLogItem ? 'horizontal' : 'vertical' 
                            }}
                            {...{
                                color: isLogItem ? 'white/5' : 'white/10',
                            }} />

                        {/* Actions Stack (Vertical on Mobile/Log, Horizontal on PC) */}
                        <Stack
                            direction={isLogItem ? 'col' : { base: 'col', md: 'row' }}
                            padding={STORE_TOKENS.PADDING.CONTAINER}
                            gap={STORE_TOKENS.SPACING.CONTAINER}
                            align={isLogItem ? 'stretch' : 'center'}
                            justify="center"
                            bg="transparent"
                            shrink={0}
                            flex="none"
                        >
                            {actions}
                        </Stack>
                    </Box>
                )}
            </Box>
        </GlassPanel>
    );
}

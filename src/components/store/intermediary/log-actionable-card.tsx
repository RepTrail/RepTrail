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
    actionWidth?: 'sidebar' | 'sidebar-wide' | 'auto'
}

export function ActionableListCard({ children, badges, actions, isLogItem, isStrictHorizontal, actionWidth }: ActionableListCardProps) {
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
                    padding={5}
                    gap={5}
                    flex1
                    minWidth={0}
                >
                    {/* Identity Block */}
                    <Box flex1 minWidth={0}>
                        {children}
                    </Box>

                    {/* Badges Block */}
                    {badges && (
                        <Box transition wrap="wrap" display="flex" align="center" gap={2.5} shrink={0}>
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
                        fullWidth={isLogItem ? true : { base: true, md: false }}
                        width={isLogItem ? 'full' : { base: 'full', md: actionWidth || 'sidebar' }}
                        overflow="hidden"
                    >
                        {/* Container-based Separator (Rule 140) */}
                        <Box 
                            display="block"
                            width={isLogItem ? 'full' : { base: 'full', md: 'px' }} 
                            height={isLogItem ? 'px' : { base: 'px', md: 'full' }} 
                            bg="white" 
                            bgOpacity={20} 
                            shrink={0} 
                        />

                        {/* Actions Stack (Vertical on Mobile/Log, Horizontal on PC) */}
                        <Stack
                            direction={isLogItem ? 'col' : { base: 'col', md: 'row' }}
                            padding={5}
                            gap={5}
                            align={isLogItem ? 'stretch' : 'center'}
                            justify="center"
                            bg="transparent"
                            shrink={0}
                            flex1={isLogItem ? 0 : { base: 1, md: 0 }}
                        >
                            {actions}
                        </Stack>
                    </Box>
                )}
            </Box>
        </GlassPanel>
    )
}

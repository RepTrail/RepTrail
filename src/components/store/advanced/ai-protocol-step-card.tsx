'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AIProtocolStepCardProps {
    index: number
    title: string
    description: string
    icon: LucideIcon
    children: React.ReactNode
}

/**
 * AIProtocolStepCard: Advanced component for AI Protocol steps.
 * Extracted from AIProtocolSectionContent to maintain architectural hierarchy.
 * ALL wrappers, paddings, and styles preserved.
 */
export function AIProtocolStepCard({ index, title, description, icon, children }: AIProtocolStepCardProps) {
    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {/* Mobile Only Badge */}
                    <Box display={{ base: 'block', md: 'none' }}>
                        <Badge label={`ETAPA 0${index}`} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                    </Box>

                    <Stack direction="row" align="center" justify="between">
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Surface padding={STORE_TOKENS.PADDING.ELEMENT} variant="tonal-primary" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                <Icon icon={icon} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                            </Surface>
                            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                <Font
                                    variant="h4"
                                    weight="black"
                                    uppercase
                                    italic
                                    {...{
                                        color: "white",
                                    }}>{title}</Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-500",
                                    }}>{description}</Font>
                            </Stack>
                        </Stack>
                        
                        {/* Desktop Only Badge */}
                        <Box display={{ base: 'none', md: 'block' }}>
                            <Badge label={`ETAPA 0${index}`} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                        </Box>
                    </Stack>
                </Stack>
                {children}
            </Stack>
        </GlassPanel>
    );
}

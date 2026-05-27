'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel, Surface } from '@/components/store/base/surface'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface DomainStepCardProps {
    index: number
    title: string
    description: string
    icon: LucideIcon
    children: React.ReactNode
    accentColor?: 'primary' | 'zinc' | 'orange' | 'emerald'
}

/**
 * DomainStepCard: Intermediary component to standardize multi-step domain blocks.
 * - Used by Onboarding, AI Protocols, and other stepper-like flows.
 * - Encapsulates the responsive header with index badges and domain icons.
 * - Responsibility: Visual consistency for sequential domain steps.
 */
export function DomainStepCard({ 
    index, 
    title, 
    description, 
    icon, 
    children,
    accentColor = 'primary'
}: DomainStepCardProps) {
    const formattedIndex = index < 10 ? `0${index}` : index

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {/* Mobile Only Badge */}
                    <Box display={{ base: 'block', md: 'none' }}>
                        <Badge label={`ETAPA ${formattedIndex}`} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                    </Box>

                    <Stack 
                        direction="row" 
                        align="center" 
                        justify="between"
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Surface 
                                padding={STORE_TOKENS.PADDING.ELEMENT} 
                                variant={`tonal-${accentColor}` as any} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                <Icon icon={icon} size="sm" color={accentColor as any} />
                            </Surface>
                            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                <Font
                                    variant="h4"
                                    weight="black"
                                    uppercase
                                    italic
                                    {...{
                                        color: "white",
                                    }}>
                                    {title}
                                </Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-500",
                                    }}>
                                    {description}
                                </Font>
                            </Stack>
                        </Stack>

                        {/* Desktop Only Badge */}
                        <Box display={{ base: 'none', md: 'block' }}>
                            <Badge label={`ETAPA ${formattedIndex}`} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                        </Box>
                    </Stack>
                </Stack>
                
                {children}
            </Stack>
        </GlassPanel>
    );
}

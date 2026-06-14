'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliatePerformanceInsights: Encapsulates secondary traffic metrics and visual insights.
 * - Handles rendering of progress bars for traffic sources.
 * - Manages the layout for insight cards.
 * - Responsibility: Visual orchestration of secondary performance data.
 */
export function AffiliatePerformanceInsights() {
    // Mock data for sources - in a real scenario, this would come from props or a query
    const trafficSources = [
        { label: 'Instagram', value: '45%', color: 'blue', width: '45%' },
        { label: 'WhatsApp', value: '30%', color: 'emerald', width: '30%' },
        { label: 'Outros', value: '25%', color: 'zinc', width: '25%' }
    ]

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="subtle">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        Melhor dia da semana
                    </Font>
                    <Font
                        variant="body"
                        weight="black"
                        italic
                        uppercase
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        Segunda-feira
                    </Font>
                </Stack>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        Origem do tráfego
                    </Font>

                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {trafficSources.map((source) => (
                            <Stack key={source.label} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Box display="flex" justify="between">
                                    <Font
                                        variant="sub-tiny"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                        }}>{source.label}</Font>
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                        }}>{source.value}</Font>
                                </Box>
                                <Box 
                                    height="px" 
                                    fullWidth 
                                    bg={STORE_TOKENS.COLORS.SHELF} 
                                    bgOpacity={STORE_TOKENS.OPACITY.SHELF} 
                                    rounded={STORE_TOKENS.RADIUS.FULL} 
                                    overflow="hidden"
                                >
                                    <Box 
                                        height="full" 
                                        bg={source.color as any} 
                                        width={source.width} 
                                    />
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>

                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Font
                        variant="sub-tiny"
                        italic
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.DIM,
                        }}>
                        * Dados estimados com base em referer_url.
                    </Font>
                </Box>
            </Stack>
        </Surface>
    );
}

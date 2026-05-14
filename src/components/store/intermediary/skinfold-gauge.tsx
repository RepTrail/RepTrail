'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { CircularProgress } from '@/components/store/base/circular-progress'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface SkinfoldGaugeProps {
    label: string
    value: number
    unit?: string
    color?: 'emerald' | 'amber' | 'red'
}

/**
 * SkinfoldGauge: A circular metric for physical assessment.
 * Faithful to Image 27's right card.
 */
export function SkinfoldGauge({
    label,
    value,
    unit = 'MM',
    color = 'emerald'
}: SkinfoldGaugeProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
            <Box position="relative" display="flex" align="center" justify="center">
                <CircularProgress 
                    value={Math.min((value / 40) * 100, 100)} // Mocking 40mm as 100%
                    size="md" 
                    color={color} 
                    thickness={6}
                />
                <Box position="absolute" display="flex" direction="col" align="center">
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="heading" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} scale={75}>
                        {value}
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM} scale={75}>
                        {unit}
                    </Font>
                </Box>
            </Box>
            
            <Font 
                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                color={STORE_TOKENS.COLORS.TEXT.MUTED} 
                align="center"
            >
                {label}
            </Font>
        </Stack>
    )
}

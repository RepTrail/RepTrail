'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { CircularProgress } from '../base/circular-progress'

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
        <Stack gap={2.5} align="center">
            <Box position="relative" display="flex" align="center" justify="center">
                <CircularProgress 
                    value={Math.min((value / 40) * 100, 100)} // Mocking 40mm as 100%
                    size="md" 
                    color={color} 
                    thickness={6}
                />
                <Box position="absolute" display="flex" direction="col" align="center">
                    <Font variant="heading" weight="black" italic scale={75}>
                        {value}
                    </Font>
                    <Font variant="tiny" weight="black" color="zinc-600" scale={75}>
                        {unit}
                    </Font>
                </Box>
            </Box>
            
            <Font 
                variant="sub-tiny" 
                weight="black" 
                uppercase 
                color="zinc-500" 
                tracking="widest"
                align="center"
            >
                {label}
            </Font>
        </Stack>
    )
}

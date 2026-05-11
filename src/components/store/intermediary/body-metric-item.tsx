'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'

interface BodyMetricItemProps {
    label: string
    value: string
    unit?: string
    color?: 'amber' | 'emerald' | 'white'
}

/**
 * BodyMetricItem: A row for displaying physical metrics in a list.
 * Faithful to Image 27's left card.
 */
export function BodyMetricItem({ 
    label, 
    value, 
    unit,
    color = 'amber'
}: BodyMetricItemProps) {
    return (
        <Stack direction="row" align="baseline" justify="between" fullWidth>
            <Font variant="sub-tiny" weight="black" uppercase color="zinc-500" tracking="widest">
                {label}
            </Font>
            
            <Stack direction="row" align="baseline" gap={1}>
                <Font variant="heading" weight="black" italic color={color}>
                    {value}
                </Font>
                {unit && (
                    <Font variant="sub-tiny" weight="black" uppercase color="zinc-600">
                        {unit}
                    </Font>
                )}
            </Stack>
        </Stack>
    )
}

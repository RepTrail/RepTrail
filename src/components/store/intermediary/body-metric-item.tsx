'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                {label}
            </Font>

            <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} color={color} variant="heading">
                    {value}
                </Font>
                {unit && (
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM}>
                        {unit}
                    </Font>
                )}
            </Stack>
        </Stack>
    )
}

'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PriceDisplayProps {
    label: string
    value: number
    subtitle: string
}

/**
 * PriceDisplay: Intermediary molecule for financial highlighting.
 * Encapsulates the specific typography and layout for prices.
 */
export function PriceDisplay({ label, value, subtitle }: PriceDisplayProps) {
    return (
        <Box 
            padding={STORE_TOKENS.PADDING.CONTAINER} 
            bg={STORE_TOKENS.COLORS.BACKGROUND} 
            bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
            border 
            borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} 
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
        >
            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    {...{
                        color: "zinc-500",
                    }}>
                    {label}
                </Font>
                <Font
                    variant="h1"
                    {...{
                        color: "white",
                    }}>
                    R$ {value.toFixed(2).replace('.', ',')}
                </Font>
                <Font
                    variant="tiny"
                    weight="black"
                    uppercase
                    italic
                    {...{
                        color: "emerald",
                    }}>
                    {subtitle}
                </Font>
            </Stack>
        </Box>
    );
}

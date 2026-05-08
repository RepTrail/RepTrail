import React from 'react'
import { Box } from './box'
import { Font } from './font'
import { Stack } from './stack'

interface BadgeProps {
    label: string
    variant?: 'dot' | 'outline' | 'solid'
    color?: 'emerald' | 'orange' | 'red' | 'blue' | 'amber' | 'zinc'
    size?: 'sm' | 'md'
}

export function Badge({
    label,
    variant = 'outline',
    color = 'zinc',
    size = 'md'
}: BadgeProps) {
    // Map simplified color names to design system tokens
    const colorToken = color === 'zinc' ? 'zinc-500' : color
    const bgToken = color === 'zinc' ? 'white/5' : `${color}/20` as any
    const borderToken = color === 'zinc' ? 'white/10' : color as any

    if (variant === 'dot') {
        return (
            <Stack direction="row" align="center" gap={2.5}>
                <Box bg={colorToken as any} rounded="full" shadow={color === 'zinc' ? undefined : color as any} className="w-2 h-2" />
                <Font variant="auxiliary" weight="bold" color="white" uppercase tracking="wide">{label}</Font>
            </Stack>
        )
    }

    if (variant === 'solid') {
        return (
            <Box
                bg={colorToken as any}
                paddingX={2.5}
                paddingY={2.5}
                rounded="sm"
                display="flex"
                align="center"
                justify="center"
                height="6"
                width="fit-content"
            >
                <Font variant="sub-tiny" color="black" weight="black" uppercase italic nowrap>{label}</Font>
            </Box>
        )
    }

    // Default: Outline
    return (
        <Box
            bg={bgToken}
            border={borderToken}
            paddingX={2.5}
            paddingY={2.5}
            rounded="sm"
            display="flex"
            align="center"
            justify="center"
            height="6"
            width="fit-content"
        >
            <Font variant="sub-tiny" color={colorToken as any} weight="black" uppercase italic nowrap>{label}</Font>
        </Box>
    )
}

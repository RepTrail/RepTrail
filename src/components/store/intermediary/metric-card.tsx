'use client'

import React from 'react'
import { Box, BoxProps } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
    label: string
    value: string
    sub: string
    icon: LucideIcon
    variant?: 'orange' | 'emerald' | 'amber' | 'red' | 'blue'
}

export function MetricCard({ label, value, sub, icon, variant = 'orange' }: MetricCardProps) {
    return (
        <Box 
            padding={5} 
            bg="zinc-950/40" 
            border="white/5" 
            rounded="system" 
            hoverBg="white/5" 
            transition="all"
        >
            <Stack gap={5}>
                <Stack direction="row" align="center" justify="between">
                    <Box bg={`${variant}/20` as BoxProps['bg']} padding={2.5} rounded="system">
                        <Icon icon={icon} color={variant as any} size="sm" />
                    </Box>
                    <Font variant="sub-tiny" color="zinc-600" uppercase weight="black" tracking="widest">RepTrail Core</Font>
                </Stack>
                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-500" uppercase weight="black">{label}</Font>
                    <Font variant="h2" weight="black" italic>{value}</Font>
                    <Font variant="sub-tiny" color="zinc-600">{sub}</Font>
                </Stack>
            </Stack>
        </Box>
    )
}

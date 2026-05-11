'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import {
    Trash2,
    Edit3,
    Copy,
    Calendar,
    Syringe
} from 'lucide-react'

interface ErgogenicCardPremiumProps {
    title: string
    days: string[]
    dosage: string
    frequency: string
    mode?: 'auto' | 'personal'
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
}

/**
 * ErgogenicCardPremium: High-fidelity card for ergogenic substance management.
 * Faithful to Image 31 (Scale 1:1).
 * - Removed 'Visualizar' for Personal mode as requested.
 */
export function ErgogenicCardPremium({
    title,
    days,
    dosage,
    frequency,
    mode = 'auto',
    color = 'primary'
}: ErgogenicCardPremiumProps) {
    const isAuto = mode === 'auto'

    return (
        <GlassPanel
            padding={5}
            rounded="system"
            variant="glass"
            transition
            group
        >
            <Stack gap={5}>
                {/* Header Actions */}
                <Stack direction="row" align="center" justify="between">
                    <Box
                        padding={2.5}
                        rounded="system"
                        bg="primary"
                        bgOpacity={10}
                        cursor="pointer"
                    >
                        <Icon icon={Syringe} size="md" color="primary" />
                    </Box>
                    {isAuto && (
                        <Stack direction="row" gap={2.5}>
                            <Box cursor="pointer" bg='blue' bgOpacity={10} padding={2.5} rounded='system'>
                                <Icon icon={Copy} size="md" color="blue" />
                            </Box>
                            <Box cursor="pointer" bg='red' bgOpacity={10} padding={2.5} rounded='system'>
                                <Icon icon={Trash2} size="md" color="red" />
                            </Box>
                        </Stack>
                    )}
                </Stack>

                {/* Body Content */}
                <Stack gap={2.5}>
                    <Font variant="h3" color="white" uppercase italic>
                        {title}
                    </Font>

                    <Stack direction="row" gap={1} wrap="wrap">
                        {days.map((day) => (
                            <Badge
                                key={day}
                                label={day}
                                variant="glass"
                                color={color}
                                size="xs"
                            />
                        ))}
                    </Stack>
                </Stack>

                {/* Info Rows */}
                <Stack gap={2.5}>
                    <Stack direction="row" align="center" justify="between">
                        <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase tracking="widest">
                            DOSAGEM
                        </Font>
                        <Font variant="sub-tiny" weight="black" color={color} uppercase tracking="widest">
                            {dosage}
                        </Font>
                    </Stack>
                    <Stack direction="row" align="center" justify="between">
                        <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase tracking="widest">
                            FREQUÊNCIA
                        </Font>
                        <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">
                            {frequency}
                        </Font>
                    </Stack>
                </Stack>

                {/* Footer Buttons - Hidden in Personal Mode */}
                {isAuto && (
                    <Stack direction="row" align="center" gap={2.5}>
                        <Button variant={color as any} flex1>
                            <Stack direction="row" align="center" justify="center" gap={2.5}>
                                <Icon icon={Calendar} size="xs" color="black" />
                                <Font variant="sub-tiny" weight="black" color="black">AGENDAR</Font>
                            </Stack>
                        </Button>
                        <Button variant="outline-zinc" flex1>
                            <Stack direction="row" align="center" justify="center" gap={2.5}>
                                <Icon icon={Edit3} size="xs" color="white" />
                                <Font variant="sub-tiny" weight="black" color="white">EDITAR</Font>
                            </Stack>
                        </Button>
                    </Stack>
                )}
            </Stack>
        </GlassPanel>
    )
}

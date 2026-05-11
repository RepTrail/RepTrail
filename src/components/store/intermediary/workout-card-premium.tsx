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
    Maximize2,
    Eye,
    Calendar
} from 'lucide-react'

interface WorkoutCardPremiumProps {
    title: string
    description: string
    day: string
    exercisesCount: number
    date: string
    mode?: 'auto' | 'personal'
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
}

/**
 * WorkoutCardPremium: High-fidelity card for training management.
 * Supports 'Auto Treino' (Full Actions) and 'Personal' (View Only) modes.
 * - Restored 'Agendar' for Auto mode as per latest feedback.
 * - Removed CSS darkening hovers in favor of JS glow.
 */
export function WorkoutCardPremium({
    title,
    description,
    day,
    exercisesCount,
    date,
    mode = 'auto',
    color = 'primary'
}: WorkoutCardPremiumProps) {
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
                {/* Header Actions - Hidden in Personal Mode */}
                <Stack direction="row" align="center" justify="between">
                    <Box
                        padding={2.5}
                        rounded="system"
                        bg="white"
                        bgOpacity={5}
                        cursor="pointer"
                        transition
                    >
                        <Icon icon={Maximize2} size="xs" color="zinc-400" />
                    </Box>
                    {isAuto && (
                        <Box
                            padding={2.5}
                            rounded="system"
                            cursor="pointer"
                            transition
                        >
                            <Icon icon={Trash2} size="xs" color="zinc-600" />
                        </Box>
                    )}
                </Stack>

                {/* Body Content */}
                <Stack gap={2.5}>
                    <Stack gap={1}>
                        <Font variant="h3" color="white">
                            {title}
                        </Font>
                        <Font variant="sub-tiny" color="zinc-600">
                            {description}
                        </Font>
                    </Stack>

                    <Box>
                        <Badge
                            label={day}
                            variant="glass"
                            color={color}
                            size="xs"
                        />
                    </Box>
                </Stack>

                {/* Meta Info */}
                <Stack direction="row" align="center" justify="between">
                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                        {exercisesCount} EXERCÍCIOS
                    </Font>
                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                        {date}
                    </Font>
                </Stack>

                {/* Footer Buttons & Actions */}
                <Stack direction="row" align="center" gap={2.5}>
                    {isAuto ? (
                        <>
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
                            <Button variant="outline-zinc" isIconOnly size="sm">
                                <Icon icon={Copy} size="xs" color="zinc-400" />
                            </Button>
                        </>
                    ) : (
                        <Button variant={color as any} flex1>
                            <Stack direction="row" align="center" justify="center" gap={2.5}>
                                <Icon icon={Eye} size="xs" color="black" />
                                <Font variant="sub-tiny" weight="black" color="black">VISUALIZAR TREINO</Font>
                            </Stack>
                        </Button>
                    )}
                </Stack>
            </Stack>
        </GlassPanel>
    )
}

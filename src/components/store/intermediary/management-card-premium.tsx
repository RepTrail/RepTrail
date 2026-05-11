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
    Eye,
    LucideIcon
} from 'lucide-react'

interface ManagementCardPremiumProps {
    title: string
    description?: string
    days: string[]
    mainStat: {
        label: string
        value: number
    }
    date: string
    icon: LucideIcon
    mode?: 'auto' | 'personal'
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
}

/**
 * ManagementCardPremium: A unified high-fidelity card for Training or Diet management.
 * Faithful to Image 27 and Image 30 (Scale 1:1).
 */
export function ManagementCardPremium({
    title,
    description,
    days,
    mainStat,
    date,
    icon,
    mode = 'auto',
    color = 'primary'
}: ManagementCardPremiumProps) {
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
                        transition
                    >
                        <Icon icon={icon} size="md" color="primary" />
                    </Box>
                    {isAuto && (
                        <Box
                            padding={2.5}
                            rounded="system"
                            bg="red"
                            bgOpacity={10}
                            cursor="pointer"
                            transition
                        >
                            <Icon icon={Trash2} size="md" color="red" />
                        </Box>
                    )}
                </Stack>

                {/* Body Content */}
                <Stack gap={2.5}>
                    <Stack gap={1}>
                        <Font variant="h3" color="white" uppercase italic>
                            {title}
                        </Font>
                        {description && (
                            <Font variant="sub-tiny" color="zinc-600">
                                {description}
                            </Font>
                        )}
                    </Stack>

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

                {/* Meta Info */}
                <Stack direction="row" align="center" justify="between">
                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                        {mainStat.value} {mainStat.label}
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
                                <Font variant="sub-tiny" weight="black" color="black">VISUALIZAR</Font>
                            </Stack>
                        </Button>
                    )}
                </Stack>
            </Stack>
        </GlassPanel>
    )
}

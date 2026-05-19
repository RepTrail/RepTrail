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
    Play,
    LucideIcon
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
    registryType?: 'training' | 'diet'
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onSchedule?: () => void
    onPlay?: () => void
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
    color = 'primary',
    registryType = 'training',
    onView,
    onEdit,
    onDelete,
    onDuplicate,
    onSchedule,
    onPlay
}: ManagementCardPremiumProps) {
    const isAuto = mode === 'auto'

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            group
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Header Actions */}
                <Stack direction="row" align="center" justify="between">
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.BRAND}
                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                        cursor="pointer"
                        transition
                    >
                        <Icon icon={icon} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                    </Box>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {isAuto && registryType === 'training' && onPlay && (
                            <Button
                                variant="outline-emerald"
                                isIconOnly
                                shine
                                onClick={onPlay}
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                <Icon icon={Play} size="md" color="emerald" />
                            </Button>
                        )}
                        {isAuto && (
                            <Button 
                                variant="outline-red"
                                isIconOnly
                                shine
                                onClick={onDelete}
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                <Icon icon={Trash2} size="md" color={STORE_TOKENS.COLORS.ERROR} />
                            </Button>
                        )}
                    </Stack>
                </Stack>

                {/* Body Content */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                            {title}
                        </Font>
                        {description && (
                            <Font {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION} color={STORE_TOKENS.COLORS.TEXT.DIM}>
                                {description}
                            </Font>
                        )}
                    </Stack>

                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
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
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {mainStat.value} {mainStat.label}
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {date}
                    </Font>
                </Stack>

                {/* Footer Buttons & Actions */}
                {(isAuto || onView) && (
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {isAuto ? (
                            <>
                                <Button variant={`outline-${color}`} flex1 onClick={onSchedule}>
                                    <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Icon icon={Calendar} size="xs" />
                                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>AGENDAR</Font>
                                    </Stack>
                                </Button>
                                <Button 
                                    variant="outline-zinc" 
                                    flex1 
                                    onClick={onEdit}
                                >
                                    <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Icon icon={Edit3} size="xs" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} />
                                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>EDITAR</Font>
                                    </Stack>
                                </Button>
                                <Button 
                                    variant="outline-zinc" 
                                    isIconOnly 
                                    size="sm" 
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    onClick={onDuplicate}
                                >
                                    <Icon icon={Copy} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                                </Button>
                            </>
                        ) : (
                            <Button variant={`outline-${color}`} flex1 onClick={onView}>
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Eye} size="xs" />
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>VISUALIZAR</Font>
                                </Stack>
                            </Button>
                        )}
                    </Stack>
                )}
            </Stack>
        </GlassPanel>
    )
}

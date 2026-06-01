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
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ErgogenicCardPremiumProps {
    id: string
    title: string
    days: string[]
    dosage: string
    frequency: string
    notes?: string
    mode?: 'auto' | 'personal' | 'trainer'
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
    onEdit?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onSchedule?: () => void
}

/**
 * ErgogenicCardPremium: High-fidelity card for ergogenic substance management.
 * Faithful to Image 31 (Scale 1:1).
 */
export function ErgogenicCardPremium({
    id,
    title,
    days,
    dosage,
    frequency,
    notes,
    mode = 'auto',
    color = 'primary',
    onEdit,
    onDelete,
    onDuplicate,
    onSchedule
}: ErgogenicCardPremiumProps) {
    const isAuto = mode === 'auto'
    const isTrainer = mode === 'trainer'
    const showActions = isAuto || isTrainer

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            group
            flex1
            fullHeight
            overflow="hidden"
        >
            <Stack
                flex1
                fullHeight
                justify="between"
                gap={STORE_TOKENS.SPACING.CONTAINER}
                minHeight={0}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1 minHeight={0}>
                {/* Header Actions */}
                <Stack direction="row" align="center" justify="between">
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.BRAND}
                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                    >
                        <Icon icon={Syringe} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                    </Box>
                    {showActions && (
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

                {/* Body Content */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} minWidth={0}>
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="h4"
                        truncate
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {title}
                    </Font>

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
                </Stack>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} shrink={0}>
                {/* Info Rows */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack direction="row" align="center" justify="between">
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            DOSAGEM
                        </Font>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: color,
                            }}>
                            {dosage}
                        </Font>
                    </Stack>
                    <Stack direction="row" align="center" justify="between">
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            FREQUÊNCIA
                        </Font>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>
                            {frequency}
                        </Font>
                    </Stack>
                </Stack>

                {notes && (
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.SURFACE}
                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                        border
                        borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                    >
                        <Font
                            variant="sub-tiny"
                            italic
                            lineClamp={2}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>
                            {notes}
                        </Font>
                    </Box>
                )}

                {/* Footer Buttons - Hidden in Personal Mode */}
                {showActions && (
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Button variant={color as any} flex1 onClick={onEdit} shine>
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Edit3} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                    {...{
                                        color: STORE_TOKENS.COLORS.BLACK,
                                    }}>EDITAR</Font>
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
                    </Stack>
                )}
                </Stack>
            </Stack>
        </GlassPanel>
    );
}

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
import { AssignedStudentsAvatarRow, AssignedStudentInfo } from './assigned-student-mini-card'

type ManagementCardMode = 'auto' | 'personal' | 'trainer'

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
    mode?: ManagementCardMode
    assignedStudents?: AssignedStudentInfo[]
    color?: 'amber' | 'emerald' | 'orange' | 'blue' | 'primary'
    registryType?: 'training' | 'diet' | 'cardio'
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onSchedule?: () => void
    onPlay?: () => void
    editLabel?: string
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
    assignedStudents,
    color = 'primary',
    registryType = 'training',
    onView,
    onEdit,
    onDelete,
    onDuplicate,
    onSchedule,
    onPlay,
    editLabel
}: ManagementCardPremiumProps) {
    const isAuto = mode === 'auto'
    const isTrainer = mode === 'trainer'
    const showManagementActions = isAuto || isTrainer
    let defaultEditLabel = 'Editar Treino'
    if (registryType === 'diet') defaultEditLabel = 'Editar Dieta'
    else if (registryType === 'cardio') defaultEditLabel = 'Editar Protocolo'

    const resolvedEditLabel = editLabel ?? defaultEditLabel

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
            <Stack flex1 fullHeight justify="between" gap={STORE_TOKENS.SPACING.CONTAINER} minHeight={0}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1 minHeight={0}>
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
                                    iconLeft={Play} />
                            )}
                            {showManagementActions && onDelete && (
                                <Button
                                    variant="outline-red"
                                    isIconOnly
                                    shine
                                    onClick={onDelete}
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    iconLeft={Trash2} />
                            )}
                        </Stack>
                    </Stack>

                    {/* Body Content */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} minWidth={0}>
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
                            {description && (
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
                                    truncate
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>
                                    {description}
                                </Font>
                            )}
                        </Stack>

                        {isTrainer && assignedStudents && assignedStudents.length > 0 && (
                            <AssignedStudentsAvatarRow students={assignedStudents} />
                        )}

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                            {days.length > 0 && (
                                days.map((day) => (
                                    <Badge
                                        key={day}
                                        label={day}
                                        variant="glass"
                                        color={color}
                                        size="xs"
                                    />
                                ))
                            )}
                            {days.length === 0 && isTrainer && (
                                <Badge
                                    label="Não agendado"
                                    icon={Calendar}
                                    variant="outline"
                                    color={STORE_TOKENS.COLORS.BRAND}
                                    size="xs"
                                />
                            )}
                        </Stack>
                    </Stack>
                </Stack>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} shrink={0}>
                    {/* Meta Info */}
                    <Stack direction="row" align="center" justify="between">
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {mainStat.value} {mainStat.label}
                        </Font>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {date}
                        </Font>
                    </Stack>

                    {/* Footer Buttons & Actions */}
                    {(isAuto || isTrainer || onView) && (
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {isTrainer && onEdit && (
                                <>
                                <Button
                                    variant="primary"
                                    flex1
                                    onClick={onEdit}
                                    shine
                                    text={resolvedEditLabel}
                                    iconLeft={Edit3} />
                                {onDuplicate && (
                                <Button
                                    variant="outline-zinc"
                                    isIconOnly
                                    size="sm"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    onClick={onDuplicate}
                                    iconLeft={Copy} />
                            )}
                                </>
                            )}
                            {!isTrainer && isAuto && (
                                <>
                            <Button
                                variant={`outline-${color}`}
                                flex1
                                onClick={onSchedule}
                                text="AGENDAR"
                                iconLeft={Calendar} />
                            <Button
                                variant="primary"
                                flex1
                                onClick={onEdit}
                                shine
                                text="EDITAR"
                                iconLeft={Edit3} />
                            {onDuplicate && (
                                <Button
                                    variant="outline-zinc"
                                    isIconOnly
                                    size="sm"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    onClick={onDuplicate}
                                    iconLeft={Copy} />
                            )}
                                </>
                            )}
                            {!isTrainer && !isAuto && (
                            <Button
                                variant={`outline-${color}`}
                                flex1
                                onClick={onView}
                                text="VISUALIZAR"
                                iconLeft={Eye} />
                            )}
                        </Stack>
                    )}
                </Stack>
            </Stack >
        </GlassPanel >
    );
}

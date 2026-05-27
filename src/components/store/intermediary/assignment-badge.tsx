'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { BaseAvatar } from '@/components/store/base/avatar'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

const DAYS_OF_WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

export interface AssignmentBadgeProps {
    studentName: string
    studentAvatarUrl?: string | null
    daysOfWeek?: number[]
    variant?: 'primary' | 'warning'
}

export function AssignmentBadge({
    studentName,
    studentAvatarUrl,
    daysOfWeek,
    variant = 'primary'
}: AssignmentBadgeProps) {
    const colorToken = variant === 'warning' ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.BRAND
    const avatarVariant = variant === 'warning' ? 'amber' : 'primary'

    return (
        <Box
            border
            borderWidth={1}
            borderColor={colorToken}
            borderOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}
            padding={STORE_TOKENS.SPACING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            bg={colorToken}
            bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
            backdropBlur="md"
        >
            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="end" fullWidth>
                <Stack align="end" gap={STORE_TOKENS.SPACING.NONE}>
                    <Font
                        variant="auxiliary"
                        weight="black"
                        italic
                        uppercase
                        opacity={STORE_TOKENS.OPACITY.OVERLAY}
                        {...{
                            color: colorToken,
                        }}>
                        Atribuído para
                    </Font>
                    <Inline gap={STORE_TOKENS.SPACING.TINY} align="center" justify="end">
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            italic
                            uppercase
                            {...{
                                color: colorToken,
                            }}>
                            {studentName}
                        </Font>
                        {daysOfWeek && daysOfWeek.length > 0 && (
                            <Font
                                variant="sub-tiny"
                                weight="medium"
                                opacity={STORE_TOKENS.OPACITY.OVERLAY}
                                {...{
                                    color: colorToken,
                                }}>
                                ({daysOfWeek.map((d) => DAYS_OF_WEEK_LABELS[d]).join(', ')})
                            </Font>
                        )}
                    </Inline>
                </Stack>
                <BaseAvatar
                    initials={studentName.substring(0, 2) || 'AL'}
                    src={studentAvatarUrl || undefined}
                    variant={avatarVariant}
                    size="sm"
                />
            </Inline>
        </Box>
    );
}

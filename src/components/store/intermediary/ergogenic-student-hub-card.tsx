'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { BaseAvatar } from '@/components/store/base/avatar'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import type { TrainerErgogenicHubStudent } from '@/actions/ergogenics-actions'

interface ErgogenicStudentHubCardProps {
    student: TrainerErgogenicHubStudent
}

/**
 * ErgogenicStudentHubCard
 * Trainer hub entry: student with active ergogenic protocol.
 */
export function ErgogenicStudentHubCard({ student }: ErgogenicStudentHubCardProps) {
    const initials = student.full_name
        ? student.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const href = `/dashboard/trainer/students/${student.id}/ergogenics`

    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            group
            flex1
            fullHeight
        >
            <Stack flex1 fullHeight justify="between" gap={STORE_TOKENS.SPACING.CONTAINER} minHeight={0}>
                <Stack direction="row" align="start" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <BaseAvatar
                        initials={initials}
                        src={student.avatar_url || undefined}
                        size="md"
                        variant="primary"
                    />
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1 minWidth={0}>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                            variant="h4"
                            truncate
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>
                            {student.full_name}
                        </Font>
                        <Badge
                            label={student.is_placeholder ? 'Convite pendente' : 'Protocolo ativo'}
                            variant="outline"
                            color={student.is_placeholder ? 'orange' : 'primary'}
                            size="xs"
                        />
                    </Stack>
                    <Box
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={STORE_TOKENS.COLORS.BRAND}
                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                        shrink={0}
                    >
                        <Icon icon={FlaskConical} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                    </Box>
                </Stack>

                <Button variant="outline-primary" asChild shine fullWidth>
                    <Link href={href}>
                        <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                {...{
                                    color: "primary",
                                }}>Abrir protocolo</Font>
                            <Icon icon={ArrowUpRight} size="xs" color="primary" />
                        </Stack>
                    </Link>
                </Button>
            </Stack>
        </GlassPanel>
    );
}

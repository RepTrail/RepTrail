'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { LucideIcon, CheckCircle, Sparkles, Zap } from 'lucide-react'
import { RegistryColor } from '@/components/store/advanced/registry-context'

interface ProtocolCardProps {
    title: string
    subtitle: string
    icon: LucideIcon
    status?: 'not_started' | 'in_progress' | 'completed' | 'empty'
    statusLabel?: string
    color?: RegistryColor
    actionLabel?: string
    onAction?: () => void
    footer?: string
    variant?: 'large' | 'compact'
    count?: { current: number, total: number }
}

/**
 * ProtocolCard: Refactored to normal GlassPanel.
 * - Fixed TS errors: rotate, badge animation, font hover.
 */
export function ProtocolCard({
    title,
    subtitle,
    icon,
    status = 'not_started',
    statusLabel,
    actionLabel = 'Iniciar',
    onAction,
    footer,
    count
}: ProtocolCardProps) {
    const isCompleted = status === 'completed'
    const isInProgress = status === 'in_progress'
    const isEmpty = status === 'empty'

    if (isEmpty) {
        return (
            <GlassPanel
                padding={12.5}
                rounded="system"
                border="dashed"
                align="center"
                justify="center"
                variant="glass"
            >
                <Stack gap={5} align="center">
                    <Icon icon={icon} size="md" color="zinc-700" />
                    <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic tracking="widest">
                        {title}
                    </Font>
                </Stack>
            </GlassPanel>
        )
    }

    return (
        <GlassPanel
            rounded="system"
            position="relative"
            overflow="hidden"
            transition
            group
            onClick={onAction}
            variant="glass"
        >
            {/* Decorative Background Icon */}
            <Box
                position="absolute"
                top="1/2"
                right={-10}
                opacity={10}
                groupHoverOpacity={20}
                transition
                rotate={3}
            />

            <Box>
                <Stack gap={5} position="relative">
                    <Stack gap={5}>
                        {/* Status Line */}
                        <Box>
                            {isCompleted ? (
                                <Badge
                                    variant="glass"
                                    color="emerald"
                                    label={statusLabel || 'MISSÃO CUMPRIDA'}
                                    icon={CheckCircle}
                                    size="sm"
                                />
                            ) : isInProgress ? (
                                <Badge
                                    variant="glass"
                                    color="amber"
                                    label={statusLabel || 'EM ANDAMENTO'}
                                    icon={Zap}
                                    size="sm"
                                />
                            ) : (
                                <Badge
                                    variant="glass"
                                    color="orange"
                                    label={statusLabel || 'PRONTO PARA TREINAR'}
                                    icon={Sparkles}
                                    size="sm"
                                />
                            )}
                        </Box>

                        {/* Title Block */}
                        <Stack gap={2.5}>
                            <Font
                                variant="h3"
                                color="white"
                            >
                                {title}
                            </Font>
                            <Font variant="sub-tiny" color="zinc-500">
                                {subtitle}
                            </Font>
                        </Stack>
                    </Stack>

                    {/* Action Button */}
                    <Box>
                        <Button
                            variant={isCompleted ? 'outline-emerald' : isInProgress ? 'amber' : 'emerald'}
                            fullWidth
                        >
                            <Font variant="body-sm" weight="black">
                                {isCompleted ? 'REVISAR' : isInProgress ? 'CONTINUAR' : actionLabel.toUpperCase()}
                            </Font>
                        </Button>
                    </Box>

                    {footer && (
                        <Box padding={0} border={false}>
                            <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest">
                                {footer}
                            </Font>
                        </Box>
                    )}
                </Stack>
            </Box>
        </GlassPanel>
    )
}

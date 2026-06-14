import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { LucideIcon } from 'lucide-react'

import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StatsCardProps {
    label: string
    value: string
    description?: string
    icon: LucideIcon
    color?: 'emerald' | 'orange' | 'amber' | 'red' | 'blue' | 'primary'
}

/**
 * StatsCard: A high-fidelity card for displaying metrics and financial data.
 * Ideal for Admin and Affiliate dashboards.
 */
export function StatsCard({
    label,
    value,
    description,
    icon,
    color = 'emerald'
}: StatsCardProps) {
    const { primaryColor } = useRegistry()
    const resolvedColor = color === 'primary' ? (primaryColor as any) : color

    const colorMap = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        orange: 'bg-orange-500/10 text-orange-500',
        amber: 'bg-amber-500/10 text-amber-500',
        red: 'bg-red-500/10 text-red-500',
        blue: 'bg-blue-500/10 text-blue-500'
    }

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} group>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="start">
                {/* Icon Header */}
                <Box
                    padding={STORE_TOKENS.PADDING.ELEMENT}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    bg={resolvedColor as any}
                    bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                >
                    <Icon icon={icon} size="sm" color={resolvedColor as any} />
                </Box>

                {/* Content Body */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth align="stretch">
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        {label}
                    </Font>

                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="heading"
                    >
                        {value}
                    </Font>

                    {description && (
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            {description}
                        </Font>
                    )}
                </Stack>
            </Stack>
        </GlassPanel>
    );
}

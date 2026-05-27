'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AIProtocolSummaryStatProps {
    icon: LucideIcon
    value: string | number
    label: string
}

/**
 * AIProtocolSummaryStat: Advanced component for summary metrics in protocol generation.
 * Extracted from AIProtocolSectionContent.
 * ALL styles and structures preserved.
 */
export function AIProtocolSummaryStat({ icon, value, label }: AIProtocolSummaryStatProps) {
    return (
        <Surface padding={STORE_TOKENS.PADDING.CONTAINER} variant="tonal-zinc" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Icon icon={icon} size="sm" color="primary" />
                <Stack gap="none" align="center">
                    <Font
                        variant="h3"
                        weight="black"
                        uppercase
                        italic
                        {...{
                            color: "white",
                        }}>{value}</Font>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "zinc-500",
                        }}>{label}</Font>
                </Stack>
            </Stack>
        </Surface>
    );
}

'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface RegistryMainHeaderProps {
    title: string
    subtitle: string
    icon: LucideIcon
    primaryColor: string
    contextLabel?: string
}

/**
 * RegistryMainHeader: Intermediary molecule for consistent registry titling.
 * Extracted from RegistryMain to satisfy Store Architecture Purity.
 */
export function RegistryMainHeader({ title, subtitle, icon, primaryColor, contextLabel }: RegistryMainHeaderProps) {
    const [first, ...rest] = title.split(' ')

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Icon icon={icon} color={primaryColor as any} size="lg" />
                <Font variant="auxiliary" color={primaryColor as any}>{contextLabel || 'Brand Guidelines'}</Font>
            </Inline>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font variant="h1" nowrap>
                    {first} <Font variant="h1" color={primaryColor as any} nowrap>{rest.join(' ')}</Font>
                </Font>
                <Font variant="description">{subtitle}</Font>
            </Stack>
        </Stack>
    )
}

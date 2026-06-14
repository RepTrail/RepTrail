'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'

import React from 'react'
import { Stack } from '../base/stack'
import { STORE_TOKENS } from '../constants/tokens'
import { LucideIcon } from 'lucide-react'

interface ManagementRegistrySectionProps {
    title: string
    subtitle?: string
    icon: LucideIcon
    ContentComponent: React.ComponentType<{ mode?: any, isEmpty?: boolean }>
    mode?: 'auto' | 'personal'
    fullWidth?: boolean
}

/**
 * ManagementRegistrySection: A unified pattern for dashboard management sections.
 * Renders a standard RegistrySection with a dual stack (Normal + Empty State) 
 * for design system cataloging and clear layout governance.
 */
export function ManagementRegistrySection({
    title,
    subtitle,
    icon,
    ContentComponent,
    mode,
    fullWidth
}: ManagementRegistrySectionProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={icon} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{title}</Font>
                    </Inline>
                    {subtitle && <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{subtitle}</Font>}
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth={fullWidth}>
                <ContentComponent mode={mode} />
                <ContentComponent mode={mode} isEmpty={true} />
            </Stack>
          </Stack>
        </Stack>
    )
}

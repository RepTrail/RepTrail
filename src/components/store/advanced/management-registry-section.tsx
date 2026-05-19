'use client'

import React from 'react'
import { RegistrySection } from './registry-section'
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
        <RegistrySection
            title={title}
            subtitle={subtitle}
            icon={icon}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth={fullWidth}>
                <ContentComponent mode={mode} />
                <ContentComponent mode={mode} isEmpty={true} />
            </Stack>
        </RegistrySection>
    )
}

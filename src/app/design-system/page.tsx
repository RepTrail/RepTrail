'use client'

import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import { RegistryShell } from '@/components/store/advanced/registry-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { BrandingSectionContent } from '@/components/store/sections/branding-section-content'
import { TypographyContent } from '@/components/store/sections/typography-content'
import { LayoutSpacingContent } from '@/components/store/sections/layout-spacing-content'
import { LogoAssetsContent } from '@/components/store/sections/logo-assets-content'
import { Stack } from '@/components/store/base/stack'

export default function DesignSystemPage() {
    return (
        <RegistryShell>
            <RegistryMain 
                title="Design System" 
                subtitle="A comprehensive guide to RepTrail's visual identity, components, and design principles."
                icon={LayoutDashboard}
            >
                <Stack gap="section">
                    <BrandingSectionContent />
                    <LogoAssetsContent />
                    <TypographyContent />
                    <LayoutSpacingContent />
                </Stack>
            </RegistryMain>
        </RegistryShell>
    )
}

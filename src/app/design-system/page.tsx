'use client'

import React from 'react'
import { RegistryShell } from '@/components/store/advanced/registry-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { BrandingSectionContent } from '@/components/store/sections/branding-section-content'
import { TypographyContent } from '@/components/store/sections/typography-content'
import { LayoutSpacingContent } from '@/components/store/sections/layout-spacing-content'
import { ComponentsRegistryContent } from '@/components/store/sections/components-registry-content'
import { ColorsSectionContent } from '@/components/store/sections/colors-section-content'
import { AuthSectionsContent } from '@/components/store/sections/auth-sections-content'

export default function DesignSystemPage() {
    return (
        <RegistryShell>
                <RegistryMain
                    title="Design System"
                    subtitle="A comprehensive guide to RepTrail's visual identity, components, and design principles."
                    icon="Zap"
                    contextLabel="Brand Guidelines"
                    showTabs={true}
                >
                    <BrandingSectionContent id="branding" />
                    <ColorsSectionContent id="colors" />
                    <AuthSectionsContent id="auth" />

                    <TypographyContent id="typography" />
                    <ComponentsRegistryContent id="components" />
                    <LayoutSpacingContent id="layout" />
                </RegistryMain>
        </RegistryShell>
    )
}

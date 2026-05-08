'use client'

import React from 'react'
import { RegistryShell } from '@/components/store/advanced/registry-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { BrandingSectionContent } from '@/components/store/sections/branding-section-content'
import { TypographyContent } from '@/components/store/sections/typography-content'
import { LayoutSpacingContent } from '@/components/store/sections/layout-spacing-content'
import { ComponentsRegistryContent } from '@/components/store/sections/components-registry-content'
import { ColorsSectionContent } from '@/components/store/sections/colors-section-content'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Zap } from 'lucide-react'

export default function DesignSystemPage() {
    return (
        <RegistryShell>
            <RegistryMain 
                title="Design System" 
                subtitle="A comprehensive guide to RepTrail's visual identity, components, and design principles."
                icon={Zap}
            >
                <Stack gap="section">
                    <Box id="branding">
                        <BrandingSectionContent />
                    </Box>

                    <Box id="colors">
                        <ColorsSectionContent />
                    </Box>

                    {/* Admin Identity section removed as requested previously */}
                    <Box id="admin" display="hidden" />

                    <Box id="typography">
                        <TypographyContent />
                    </Box>

                    <Box id="components">
                        <ComponentsRegistryContent />
                    </Box>

                    <Box id="layout">
                        <LayoutSpacingContent />
                    </Box>
                </Stack>
            </RegistryMain>
        </RegistryShell>
    )
}

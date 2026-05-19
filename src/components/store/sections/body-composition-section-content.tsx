'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { StudentBodyCompositionPanel } from '@/components/store/advanced/student-body-composition-panel'

/**
 * BodyCompositionSectionContent Section: Orchestrates the physical assessment domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced panel.
 * - Responsibility: Page structure and semantic coordination of body composition data.
 */
export function BodyCompositionSectionContent() {
    return (
        <Stack fullWidth>
            <StudentBodyCompositionPanel />
        </Stack>
    )
}

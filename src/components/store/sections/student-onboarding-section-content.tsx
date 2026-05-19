'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { StudentOnboardingForm } from '@/components/store/advanced/student-onboarding-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentOnboardingSectionContent: Orchestrates the onboarding domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced form.
 * - Responsibility: Page structure and semantic grouping of onboarding features.
 */
export function StudentOnboardingSectionContent() {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            <StudentOnboardingForm />
        </Stack>
    )
}

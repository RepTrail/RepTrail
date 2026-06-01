'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { AIProtocolTeaserPanel } from '@/components/store/advanced/ai-protocol-teaser-panel'

/**
 * AIProtocolEmptyStateSectionContent Section: Orchestrates the AI Protocol promotional domain.
 * - Following strict Design System Rules: This section now only orchestrates the Advanced panel.
 * - Responsibility: Structural coordination of the empty state/teaser view.
 */
export function AIProtocolEmptyStateSectionContent({ userId = 'me' }: { userId?: string }) {
    return (
        <Stack fullWidth flex1 justify="center">
            <AIProtocolTeaserPanel userId={userId} />
        </Stack>
    )
}

'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { AIProtocolTeaserPanel } from '@/components/store/advanced/ai-protocol-teaser-panel'

export function AIProtocolEmptyState({ userId = 'me' }: { userId?: string }) {
    return (
        <Stack fullWidth flex1 justify="center">
            <AIProtocolTeaserPanel userId={userId} />
        </Stack>
    )
}

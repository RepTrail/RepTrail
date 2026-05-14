'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { AIProtocolForm } from '@/components/store/advanced/ai-protocol-form'
import { AIProtocolSuccessView } from '@/components/store/advanced/ai-protocol-success-view'

/**
 * AIProtocolSectionContent: Ultra-premium reconstruction of the AI Protocol Generator.
 * Refactored to follow Design System Rules: This section now only orchestrates Advanced components.
 * Visual parity is 100% preserved.
 */
export function AIProtocolSectionContent({ userId = 'me' }: { userId?: string }) {
    const [successSummary, setSuccessSummary] = useState<any>(null)

    if (successSummary) {
        return <AIProtocolSuccessView summary={successSummary} />
    }

    return (
        <Stack fullWidth>
            <AIProtocolForm 
                userId={userId} 
                onSuccess={(summary: any) => setSuccessSummary(summary)} 
            />
        </Stack>
    )
}

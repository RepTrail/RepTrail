'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { AIProtocolForm } from '@/components/store/advanced/ai-protocol-form'
import { AIProtocolSuccessView } from '@/components/store/advanced/ai-protocol-success-view'

export function AIProtocolContent({ userId = 'me' }: { userId?: string }) {
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

'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { ActionIconButton } from '@/components/store/intermediary/action-icon-button'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PayoutActionGroupProps {
    onReject: () => void
    onApprove: () => void
}

/**
 * PayoutActionGroup: Intermediary component for consistent payout actions.
 */
export function PayoutActionGroup({ onReject, onApprove }: PayoutActionGroupProps) {
    return (
        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <ActionIconButton 
                icon={XCircle} 
                variant="outline-red" 
                onClick={onReject} 
            />
            <ActionIconButton 
                icon={CheckCircle2} 
                variant="outline-emerald" 
                onClick={onApprove} 
            />
        </Stack>
    )
}

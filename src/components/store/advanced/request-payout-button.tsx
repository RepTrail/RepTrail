'use client'

import React, { useState } from 'react'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Font } from '@/components/store/base/font'
import { Banknote } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RequestPayoutModal } from './request-payout-modal'

/**
 * RequestPayoutButton: Advanced component to handle payout requests.
 * Zero-Manual-Styling compliant.
 */
export function RequestPayoutButton({ availableBalance }: { availableBalance: number }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="primary"
                onClick={() => setIsOpen(true)}
                disabled={availableBalance < 50}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                height="anatomy-item"
                gap={STORE_TOKENS.SPACING.ELEMENT}
                fullWidth
            >
                <Icon icon={Banknote} size="xs" />
                <Font variant="label-caps">Sacar Comissões</Font>
            </Button>
            {isOpen && (
                <RequestPayoutModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    availableBalance={availableBalance}
                />
            )}
        </>
    );
}

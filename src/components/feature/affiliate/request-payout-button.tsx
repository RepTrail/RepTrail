'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Banknote } from 'lucide-react'
import { RequestPayoutModal } from './request-payout-modal'

export function RequestPayoutButton({ availableBalance }: { availableBalance: number }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                disabled={availableBalance < 50}
                className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black uppercase tracking-widest px-6 h-10 gap-2 rounded-xl transition-all"
            >
                <Banknote className="w-4 h-4" />
                Sacar Comissões
            </Button>

            {isOpen && (
                <RequestPayoutModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    availableBalance={availableBalance}
                />
            )}
        </>
    )
}

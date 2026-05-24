'use client'

import { useState, useEffect } from 'react'
import { SettingsModal } from '@/components/store/advanced/student-settings-modal'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'

interface StudentGlobalModalsProps {
    hasTrainer: boolean
    userId?: string
}

export function StudentGlobalModals({ hasTrainer, userId }: StudentGlobalModalsProps) {
    const [asaasModal, setAsaasModal] = useState({ isOpen: false, tier: 'auto_training' as const })

    useEffect(() => {
        const handleOpenAsaas = (e: any) => {
            setAsaasModal({ isOpen: true, tier: e.detail?.tier || 'auto_training' })
        }
        window.addEventListener('open-asaas', handleOpenAsaas)
        return () => window.removeEventListener('open-asaas', handleOpenAsaas)
    }, [])

    return (
        <>
            <SettingsModal hasTrainer={hasTrainer} isTrainer={false} />
            <AsaasPaymentModal 
                isOpen={asaasModal.isOpen}
                onClose={() => setAsaasModal(prev => ({ ...prev, isOpen: false }))}
                tier={asaasModal.tier}
                monthlyTotal={10.90}
                userId={userId}
            />
        </>
    )
}

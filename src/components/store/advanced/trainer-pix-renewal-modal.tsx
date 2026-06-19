'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CalendarClock } from 'lucide-react'
import { checkSubscriptionRenewalState } from '@/actions/asaas-actions'

export function TrainerPixRenewalModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [daysRemaining, setDaysRemaining] = useState(0)

    useEffect(() => {
        const checkRenewal = async () => {
            try {
                // Limit to 1 check per day per browser
                const todayStr = new Date().toISOString().split('T')[0]
                const lastCheck = localStorage.getItem('reptrail_renewal_last_check')
                
                if (lastCheck === todayStr) return

                const res = await checkSubscriptionRenewalState()

                if (res.isExpired) {
                    // It will trigger a redirect on the server action because of revalidatePath
                    window.location.reload()
                    return
                }

                if (res.shouldWarn && res.daysRemaining !== undefined) {
                    setDaysRemaining(res.daysRemaining)
                    setIsVisible(true)
                }

                // Only register check if successfully verified
                localStorage.setItem('reptrail_renewal_last_check', todayStr)
            } catch (e) {
                console.error('Failed to check renewal state', e)
            }
        }

        checkRenewal()
    }, [])

    if (!isVisible) return null

    return (
        <Modal
            isOpen={isVisible}
            onClose={() => setIsVisible(false)}
            title="Atenção à sua Assinatura"
            subtitle="Sua fatura PIX vencerá em breve."
            icon={CalendarClock}
            variant="amber"
            hideCancel
            confirmLabel="Entendido"
            onConfirm={() => setIsVisible(false)}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                    Falta{daysRemaining === 1 ? '' : 'm'} <Font variant="description" weight="bold" color="amber">{daysRemaining} dia{daysRemaining === 1 ? '' : 's'}</Font> para renovar o seu plano.
                </Font>
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                    Para que seus alunos não percam acesso aos treinos, lembre-se de pagar a fatura PIX que será gerada no seu painel ou enviada ao seu e-mail no dia do vencimento.
                </Font>
            </Stack>
        </Modal>
    )
}

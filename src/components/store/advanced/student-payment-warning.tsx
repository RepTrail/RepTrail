'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CreditCard, AlertTriangle, ChevronRight } from 'lucide-react'
import { Box } from '@/components/store/base/box'

interface StudentPaymentWarningProps {
    relationship: any
}

/**
 * StudentPaymentWarning: Smart advanced component for payment alerts.
 * Replaces legacy PaymentWarning while maintaining logic and using Store Modal.
 */
export function StudentPaymentWarning({ relationship }: StudentPaymentWarningProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!relationship?.payment_day) return

        const today = new Date()
        const currentDay = today.getDate()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()

        const paymentDay = relationship.payment_day
        const lastPaymentDate = relationship.last_payment_date ? new Date(relationship.last_payment_date) : null

        const isOverdue = currentDay >= paymentDay && (
            !lastPaymentDate ||
            (lastPaymentDate.getMonth() < currentMonth && lastPaymentDate.getFullYear() <= currentYear) ||
            (lastPaymentDate.getFullYear() < currentYear)
        )

        if (isOverdue) {
            const dismissed = sessionStorage.getItem('payment_warning_dismissed')
            if (!dismissed) {
                setIsVisible(true)
            }
        }
    }, [relationship])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('payment_warning_dismissed', 'true')
    }

    return (
        <Modal
            isOpen={isVisible}
            onClose={handleClose}
            title="VENCIMENTO PRÓXIMO"
            subtitle="PAGAMENTO PENDENTE OU EM ATRASO"
            icon={CreditCard}
            variant="orange"
            confirmLabel="ENTENDIDO, VOU REALIZAR"
            onConfirm={handleClose}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    Notamos que o prazo de pagamento do seu plano com <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="bold">{relationship?.trainer?.full_name}</Font> venceu ou está próximo.
                </Font>

                <Surface variant="base" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Stack direction="row" justify="between">
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">DIA DE VENCIMENTO</Font>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.WARNING} weight="black" uppercase tracking="widest">DIA {relationship?.payment_day}</Font>
                        </Stack>
                        <Box className="h-[1px] w-full bg-white/5" />
                        <Stack direction="row" justify="between">
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">VALOR MENSAL</Font>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" uppercase tracking="widest">R$ {relationship?.monthly_fee?.toFixed(2)}</Font>
                        </Stack>
                    </Stack>
                </Surface>

                <Surface variant="tonal-amber" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                        <Font variant="sub-tiny" color="amber" weight="bold" uppercase>
                            PARA MANTER SEU ACESSO, REALIZE O PAGAMENTO VIA PIX OU CONFORME COMBINADO COM SEU PERSONAL.
                        </Font>
                    </Stack>
                </Surface>
            </Stack>
        </Modal>
    )
}

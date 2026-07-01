'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { Surface } from '@/components/store/base/surface'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CreditCard, MessageCircle, CheckCircle } from 'lucide-react'
import { confirmStudentPayment } from '@/actions/trainer-actions'

export function TrainerStudentBillingCard({ relationship }: { relationship: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    if (!relationship) return null

    const todayDay = new Date().getDate()
    const paymentDay = relationship.payment_day
    const lastPayment = relationship.last_payment_date
    const isPaidThisMonth = lastPayment &&
        new Date(lastPayment).getMonth() === new Date().getMonth() &&
        new Date(lastPayment).getFullYear() === new Date().getFullYear()

    let paymentStatus = null
    if (paymentDay && !isPaidThisMonth) {
        if (todayDay === paymentDay) paymentStatus = 'due_today'
        else if (todayDay > paymentDay) paymentStatus = 'overdue'
        else paymentStatus = 'pending_this_month'
    }

    const showActions = paymentStatus === 'overdue' || paymentStatus === 'pending_this_month' || paymentStatus === 'due_today'

    const handleWhatsApp = () => {
        if (relationship.student?.whatsapp) {
            const phone = relationship.student.whatsapp.replace(/\D/g, '')
            const text = encodeURIComponent(`Olá ${relationship.student.full_name}, passando para lembrar sobre o pagamento do seu plano no RepTrail. Me avise qualquer dúvida!`)
            window.open(`https://wa.me/55${phone}?text=${text}`, '_blank')
        } else {
            alert('Este aluno não possui WhatsApp cadastrado.')
        }
    }

    const handleConfirm = async () => {
        setIsLoading(true)
        const res = await confirmStudentPayment(relationship.id)
        setIsLoading(false)
        if (res.success) {
            setIsConfirmed(true)
            // It will be revalidated
        } else {
            alert(res.message)
        }
    }

    if (isConfirmed) {
        return (
            <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none" fullWidth>
                <Inline align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <Font variant="sub-tiny" weight="bold" {...{ color: "emerald" }}>PAGAMENTO CONFIRMADO</Font>
                </Inline>
            </Surface>
        )
    }

    return (
        <Surface variant="base" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} justify="center">
                <Inline align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Inline align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <Font variant="sub-tiny" weight="bold" {...{ color: STORE_TOKENS.COLORS.TEXT.PRIMARY }} uppercase>Faturamento</Font>
                    </Inline>
                    {paymentStatus === 'overdue' && <Badge label="Atrasado" variant="glass" color={STORE_TOKENS.COLORS.ERROR} size="xs" />}
                    {paymentStatus === 'pending_this_month' && <Badge label="Pendente" variant="glass" color={STORE_TOKENS.COLORS.ERROR} size="xs" />}
                    {paymentStatus === 'due_today' && <Badge label="Vence Hoje" variant="glass" color={STORE_TOKENS.COLORS.WARNING} size="xs" />}
                    {!paymentStatus && <Badge label="Em dia" variant="glass" color={STORE_TOKENS.COLORS.SUCCESS} size="xs" />}
                </Inline>

                {relationship.payment_day && (
                    <Font variant="sub-tiny" {...{ color: STORE_TOKENS.COLORS.TEXT.MUTED }}>Vence todo dia {relationship.payment_day}</Font>
                )}

                {showActions && (
                    <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Button variant="outline-emerald" size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} onClick={handleWhatsApp} gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <MessageCircle className="w-3 h-3" />
                            Cobrar
                        </Button>
                        <Button variant="emerald" size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} onClick={handleConfirm} disabled={isLoading} gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <CheckCircle className="w-3 h-3" />
                            Confirmar
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Surface>
    )
}

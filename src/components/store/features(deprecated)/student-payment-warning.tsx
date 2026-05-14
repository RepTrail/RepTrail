'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { useState, useEffect } from 'react'
import { AlertTriangle, ChevronRight, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'

interface PaymentWarningProps {
    relationship: any
}

export function PaymentWarning({ relationship }: PaymentWarningProps) {
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

    if (!isVisible) return null

    return (
        <Dialog open={isVisible} onOpenChange={(open) => {
            if (!open) {
                setIsVisible(false)
                sessionStorage.setItem('payment_warning_dismissed', 'true')
            }
        }}>
            <DialogContent className="sm:max-w-md border-orange-500/30 p-0 overflow-hidden bg-zinc-950 rounded-system">
                <Box padding={{ base: 6, sm: 10 }}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" textAlign="center">
                            <Box 
                                width={20} 
                                height={20} 
                                bg="orange" 
                                bgOpacity={10} 
                                rounded="system" 
                                border 
                                borderColor="orange" 
                                className="flex items-center justify-center animate-pulse"
                            >
                                <CreditCard className="w-10 h-10 text-orange-500" />
                            </Box>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <DialogTitle asChild>
                                    <Font variant="heading" weight="black" italic uppercase tracking="tighter" className="text-3xl">
                                        Vencimento Próximo
                                    </Font>
                                </DialogTitle>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest" className="leading-relaxed">
                                    Notamos que o prazo de pagamento do seu plano com <Font as="span" color="white">{relationship.trainer?.full_name}</Font> venceu ou está próximo.
                                </Font>
                            </Stack>
                        </Stack>

                        <Box padding={{ base: 4, sm: 6 }} bg="zinc" bgOpacity={50} border borderColor="zinc" rounded="system">
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <div className="flex items-center justify-between">
                                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                        Dia de Vencimento
                                    </Font>
                                    <Font variant="sub-tiny" weight="black" color="orange" uppercase tracking="widest">
                                        Dia {relationship.payment_day}
                                    </Font>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                        Valor Mensal
                                    </Font>
                                    <Font variant="sub-tiny" weight="black" color="white" uppercase tracking="widest">
                                        R$ {relationship.monthly_fee?.toFixed(2)}
                                    </Font>
                                </div>
                            </Stack>
                        </Box>

                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} bg="orange" bgOpacity={5} border borderColor="orange" rounded="system" className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                            <Font variant="sub-tiny" weight="bold" color="zinc-400" uppercase className="leading-snug">
                                Para manter seu acesso aos treinos e dietas, realize o pagamento via PIX ou conforme combinado com seu personal.
                            </Font>
                        </Box>

                        <Button
                            onClick={() => {
                                setIsVisible(false)
                                sessionStorage.setItem('payment_warning_dismissed', 'true')
                            }}
                            className="w-full h-14 bg-white text-zinc-950 hover:bg-zinc-200 rounded-system font-black uppercase italic tracking-widest shadow-xl active:scale-[0.98] transition-all"
                        >
                            <span>Entendido, vou realizar</span>
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}


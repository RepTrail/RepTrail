'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Banknote, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

interface RequestPayoutModalProps {
    isOpen: boolean
    onClose: () => void
    availableBalance: number
}

/**
 * RequestPayoutModal: Advanced component to handle payout request flow.
 * Fully compliant with Zero-Manual-Styling.
 */
export function RequestPayoutModal({ isOpen, onClose, availableBalance }: RequestPayoutModalProps) {
    const { toast } = useToast()
    const [amount, setAmount] = useState<string>('')
    const [pixKey, setPixKey] = useState<string>('')

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'request-payout',
        entity: ENTITIES.PAYOUT,
        entityId: 'new',
        queryKey: QUERY_KEYS.affiliate.earnings,
        mutationFn: async (variables: { amount: number, method: string, details: string }) => {
            const { requestPayout } = await import('@/lib/dal/remote')
            const res = await requestPayout(variables.amount, variables.method, variables.details)
            if (res.error) throw new Error(res.error)
            return res
        },
        onMutate: () => {
            toast({ title: 'Solicitação registrada!', description: 'Sua solicitação foi salva e será sincronizada.' })
            onClose()
            setAmount('')
            setPixKey('')
        },
        onSuccess: () => {
            toast({ title: 'Saque solicitado!', description: 'Nossa equipe processará o pagamento em breve.' })
        }
    })

    const handleMaxAmount = () => {
        setAmount(availableBalance.toFixed(2))
    }

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()

        const val = parseFloat(amount.replace(',', '.'))
        if (isNaN(val) || val < 50) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'O valor mínimo para saque é de R$ 50,00.' })
            return
        }
        if (val > availableBalance) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Saldo insuficiente.' })
            return
        }
        if (!pixKey.trim()) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Por favor, informe a chave PIX.' })
            return
        }

        mutate({ amount: val, method: 'PIX', details: pixKey.trim() })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Solicitar Saque"
            subtitle="Transfira suas comissões confirmadas para sua conta via PIX."
            icon={Banknote}
            variant="emerald"
            confirmLabel={isPending ? 'Processando...' : 'Confirmar Saque'}
            cancelLabel="Cancelar"
            onConfirm={handleSubmit}
            isLoading={isPending}
            disabled={availableBalance < 50}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Balance Summary */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW} border>
                    <Inline justify="between" align="center">
                        <Font
                            variant="description"
                            weight="medium"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>Saldo Disponível:</Font>
                        <Font
                            variant="body"
                            weight="black"
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND,
                            }}>
                            R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Font>
                    </Inline>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Amount Input */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline justify="between" align="center">
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                }}>
                                Valor do Saque (R$)
                            </Font>
                            <Button
                                variant="ghost"
                                padding={STORE_TOKENS.PADDING.NONE}
                                onClick={handleMaxAmount}
                            >
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>SAQUE TOTAL</Font>
                            </Button>
                        </Inline>

                        <Input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            disabled={isPending}
                        />

                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={AlertCircle} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Mínimo de R$ 50,00</Font>
                        </Inline>
                    </Stack>

                    {/* PIX Key Input */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>
                            Chave PIX
                        </Font>
                        <Input
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            placeholder="CPF, Celular, E-mail ou Aleatória"
                            disabled={isPending}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    );
}

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
import { Banknote, AlertCircle, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
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
            const { requestPayout } = await import('@/actions/affiliate-actions')
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
            <Stack gap={5}>
                {/* Balance Summary */}
                <Box padding={5} rounded="system" bg="zinc" bgOpacity={5} border>
                    <Inline justify="between" align="center">
                        <Font variant="description" color="zinc-400" weight="medium">Saldo Disponível:</Font>
                        <Font variant="body" color="primary" weight="black">
                            R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Font>
                    </Inline>
                </Box>

                <Stack gap={5}>
                    {/* Amount Input */}
                    <Stack gap={2.5}>
                        <Inline justify="between" align="center">
                            <Font variant="sub-tiny" weight="black" uppercase tracking="widest" color="zinc-400">
                                Valor do Saque (R$)
                            </Font>
                            <Button 
                                variant="ghost" 
                                padding={0} 
                                onClick={handleMaxAmount}
                            >
                                <Font variant="sub-tiny" color="primary" weight="black">SAQUE TOTAL</Font>
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
                        
                        <Inline gap={1} align="center">
                            <Icon icon={AlertCircle} size="xs" color="zinc-500" />
                            <Font variant="sub-tiny" color="zinc-500">Mínimo de R$ 50,00</Font>
                        </Inline>
                    </Stack>

                    {/* PIX Key Input */}
                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" weight="black" uppercase tracking="widest" color="zinc-400">
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
    )
}

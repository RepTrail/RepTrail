'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { useState } from 'react'
import { Button } from "@/components/store/base/button"
import { Box } from "@/components/store/base/box"
import { Icon } from "@/components/store/base/icon"
import { Modal } from "@/components/store/advanced/modal"
import { Font } from "@/components/store/base/font"
import { Stack } from "@/components/store/base/stack"
import { useToast } from "@/components/store/hooks/use-toast"
import { useOptimisticMutation } from '@/lib/dal'
import { ENTITIES } from '@/lib/outbox-db'
import { XCircle, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react'

export function CancelSubscriptionButton() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const { mutate: cancelMutate, isPending } = useOptimisticMutation({
        actionName: 'cancel-asaas-subscription',
        entity: ENTITIES.SUBSCRIPTION,
        queryKey: ['subscription'], // broad invalidation if needed
        mutationFn: async (variables: any) => variables,
        onMutate: () => {
            setOpen(false)
        },
        onSuccess: (res) => {
            if (res.success) {
                toast({
                    title: "Plano Cancelado",
                    description: "Sua assinatura foi encerrada.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao processar",
                    description: res.error,
                })
            }
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Tente novamente mais tarde.",
            })
        }
    })

    const handleAction = () => {
        cancelMutate({})
    }

    return (
        <>
            <Button
                variant="outline-zinc"
                size="xs"
                rounded={STORE_TOKENS.RADIUS.FULL}
                onClick={() => setOpen(true)}
                gap={STORE_TOKENS.SPACING.NONE}
            >
                <Icon icon={XCircle} size="xs" />
                Encerrar Assinatura
            </Button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Confirmar Cancelamento?"
                subtitle="Sua assinatura será encerrada no Asaas"
                icon={ShieldAlert}
                variant="red"
                confirmVariant="outline-red"
                confirmLabel="Confirmar Cancelamento"
                cancelLabel="Manter Plano"
                onConfirm={handleAction}
                isLoading={isPending}
            >
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.MODAL} border borderColor={STORE_TOKENS.COLORS.BACKGROUND} borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.NONE} padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Icon icon={AlertTriangle} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                            <Font
                                variant="label-caps"
                                weight="bold"
                                {...{
                                    color: "white",
                                }}>
                                O que acontece agora?
                            </Font>
                        </Box>
                        <Stack gap={STORE_TOKENS.SPACING.NONE}>
                            <Box display="flex" align="start" gap={STORE_TOKENS.SPACING.NONE}>
                                <Icon icon={ArrowRight} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} opacity={STORE_TOKENS.OPACITY.MODAL} />
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-400",
                                    }}>
                                    Nenhuma nova cobrança será realizada.
                                </Font>
                            </Box>
                            <Box display="flex" align="start" gap={STORE_TOKENS.SPACING.NONE}>
                                <Icon icon={ArrowRight} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} opacity={STORE_TOKENS.OPACITY.MODAL} />
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-400",
                                    }}>
                                    Você poderá assinar novamente a qualquer momento.
                                </Font>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}

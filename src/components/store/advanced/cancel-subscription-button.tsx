'use client'

import { useState } from 'react'
import { Button } from "@/components/store/base/button"
import { Box } from "@/components/store/base/box"
import { Icon } from "@/components/store/base/icon"
import { Modal } from "@/components/store/advanced/modal"
import { Font } from "@/components/store/base/font"
import { Stack } from "@/components/store/base/stack"
import { useToast } from "@/hooks/use-toast"
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
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
                rounded="full"
                onClick={() => setOpen(true)}
                gap="tiny"
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
                <Box padding="container" bg="zinc" bgOpacity={50} border borderColor="zinc" borderOpacity={10} rounded="system">
                    <Stack gap="element">
                        <Box display="flex" align="center" gap="tiny" style={{ paddingBottom: '10px' }}>
                            <Icon icon={AlertTriangle} size="xs" color="orange" />
                            <Font
                                variant="label-caps"
                                weight="bold"
                                {...{
                                    color: "white",
                                }}>
                                O que acontece agora?
                            </Font>
                        </Box>
                        <Stack gap="tiny">
                            <Box display="flex" align="start" gap="tiny">
                                <Icon icon={ArrowRight} size="xs" color="zinc-400" opacity={50} />
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: "zinc-400",
                                    }}>
                                    Nenhuma nova cobrança será realizada.
                                </Font>
                            </Box>
                            <Box display="flex" align="start" gap="tiny">
                                <Icon icon={ArrowRight} size="xs" color="zinc-400" opacity={50} />
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

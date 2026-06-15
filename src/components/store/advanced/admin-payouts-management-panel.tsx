'use client'

import { useState, useEffect } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Modal } from '@/components/store/advanced/modal'
import { EmptyState } from '../intermediary/empty-state'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@/components/store/hooks/use-toast'
import { useOptimisticMutation } from '@/lib/dal'
import { ENTITIES } from '@/lib/outbox-db'
import { ActionableListCard } from '../intermediary/actionable-list-card'
import { PayoutActionGroup } from '../intermediary/payout-action-group'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface Payout {
    id: string
    amount: number
    status: string
    payout_method: string
    payout_details: any
    created_at: string
    affiliate_id: string
    profiles?: {
        full_name: string
        email: string
        avatar_url?: string | null
    }
}

/**
 * AdminPayoutsManagementPanel: Encapsulates the logic for managing payout requests.
 * - Handles status updates and confirmation modals.
 * - Manages the loop and formatting for payout items.
 * - Responsibility: Payout management domain logic.
 */
export function AdminPayoutsManagementPanel({ initialPayouts }: { initialPayouts: Payout[] }) {
    const { toast } = useToast()
    const [payouts, setPayouts] = useState<Payout[]>(initialPayouts)

    useEffect(() => {
        setPayouts(initialPayouts)
    }, [initialPayouts])

    const [modalConfig, setModalConfig] = useState<{ open: boolean, id: string, status: 'completed' | 'rejected' | null }>({
        open: false,
        id: '',
        status: null
    })

    const { mutate: updateStatusMutate } = useOptimisticMutation({
        actionName: 'update-payout-status',
        entity: ENTITIES.PAYOUT,
        queryKey: ['admin', 'payouts'],
        mutationFn: async (variables: { id: string, status: 'completed' | 'rejected' }) => variables,
        onMutate: (variables) => {
            const previousPayouts = [...payouts]
            setPayouts(prev => prev.map(p => p.id === variables.id ? { ...p, status: variables.status } : p))
            return { previousPayouts }
        },
        onSuccess: () => {
            toast({ title: 'Status do saque atualizado!', description: 'A alteraÃ§Ã£o estÃ¡ sendo sincronizada.' })
        },
        onError: (err, variables, ctx) => {
            setPayouts(ctx?.previousPayouts || [])
            toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao atualizar status.' })
        }
    })

    const handleUpdateStatus = (id: string, status: 'completed' | 'rejected') => {
        setModalConfig({ open: true, id, status })
    }

    const confirmUpdateStatus = () => {
        if (!modalConfig.id || !modalConfig.status) return
        updateStatusMutate({ id: modalConfig.id, status: modalConfig.status })
        setModalConfig({ open: false, id: '', status: null })
    }

    const formatPixKey = (details: any) => {
        if (!details || !details.details) return 'Chave nÃ£o informada'
        return details.details
    }

    const pendingPayouts = payouts.filter(p => p.status === 'requested' || p.status === 'pending')

    if (pendingPayouts.length === 0) {
        return (
            <EmptyState
                icon={CheckCircle2}
                title="Tudo em dia!"
                description="Nenhuma solicitaÃ§Ã£o de saque pendente no momento."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {pendingPayouts.map(payout => (
                <ActionableListCard
                    key={payout.id}
                    badges={
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Badge label="PENDENTE" color={STORE_TOKENS.COLORS.WARNING} variant="glass" size="xs" />
                            <Badge label={new Date(payout.created_at).toLocaleDateString('pt-BR')} variant="glass" size="xs" />
                        </Stack>
                    }
                    actions={
                        <PayoutActionGroup
                            onReject={() => handleUpdateStatus(payout.id, 'rejected')}
                            onApprove={() => handleUpdateStatus(payout.id, 'completed')}
                        />
                    }
                    footer={
                        <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.CONTAINER} align={{ base: 'stretch', md: 'center' }} justify="between">
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        opacity={STORE_TOKENS.OPACITY.MODAL}
                                        {...{
                                            color: "success",
                                        }}>Chave PIX</Font>
                                    <Font
                                        variant="body-sm"
                                        weight="bold"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                            breakAll: true,
                                        }}>{formatPixKey(payout.payout_details)}</Font>
                                </Stack>
                                <Font
                                    variant="heading"
                                    weight="black"
                                    {...{
                                        color: "success",
                                    }}>R$ {Number(payout.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Font>
                            </Stack>
                        </Box>
                    }
                >
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <BaseAvatar
                            src={payout.profiles?.avatar_url || undefined}
                            initials={(payout.profiles?.full_name || '??').substring(0, 2).toUpperCase()}
                            size="md"
                            variant="zinc"
                        />
                        <Stack gap={STORE_TOKENS.SPACING.NONE} minWidth={0}>
                            <Font
                                weight="black"
                                uppercase
                                italic
                                variant={{ base: 'body-sm', md: 'body' }}
                                tracking="wider"
                                truncate
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                {payout.profiles?.full_name || 'UsuÃ¡rio Desconhecido'}
                            </Font>
                            <Box fullWidth minWidth={0} overflow="hidden">
                                <Font
                                    variant="sub-tiny"
                                    lowercase
                                    truncate
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>
                                    {payout.profiles?.email}
                                </Font>
                            </Box>
                        </Stack>
                    </Stack>
                </ActionableListCard>
            ))}
            <Modal
                isOpen={modalConfig.open}
                onClose={() => setModalConfig({ ...modalConfig, open: false })}
                title={modalConfig.status === 'completed' ? "Confirmar Pagamento" : "Rejeitar SolicitaÃ§Ã£o"}
                subtitle={modalConfig.status === 'completed'
                    ? "Confirme que a transferÃªncia via PIX foi realizada com sucesso."
                    : "Esta aÃ§Ã£o informarÃ¡ ao afiliado que a solicitaÃ§Ã£o foi negada."
                }
                icon={modalConfig.status === 'completed' ? CheckCircle2 : XCircle}
                variant={modalConfig.status === 'completed' ? 'emerald' : 'red'}
                onConfirm={confirmUpdateStatus}
                confirmLabel={modalConfig.status === 'completed' ? "Confirmar" : "Rejeitar"}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="body"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                        }}>
                        {modalConfig.status === 'completed'
                            ? "Ao confirmar, o status do saque serÃ¡ atualizado para 'Pago' e o valor serÃ¡ deduzido permanentemente do saldo do afiliado."
                            : "Tem certeza que deseja rejeitar esta solicitaÃ§Ã£o? O saldo retornarÃ¡ para a conta do afiliado."
                        }
                    </Font>
                </Stack>
            </Modal>
        </Stack>
    );
}

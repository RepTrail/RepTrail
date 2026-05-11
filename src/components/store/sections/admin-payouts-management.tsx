'use client'

import { useState } from 'react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Badge } from '../base/badge'
import { BaseAvatar } from '../base/avatar'
import { Modal } from '../advanced/modal'
import { EmptyState } from '../intermediary/empty-state'
import { CheckCircle2, XCircle, Banknote, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { ActionableListCard } from '../intermediary/actionable-list-card'
import { PayoutActionGroup } from '../intermediary/payout-action-group'
import { RegistrySection } from '../advanced/registry-section'

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

export function AdminPayoutsManagement({ initialPayouts }: { initialPayouts: Payout[] }) {
    const { toast } = useToast()
    const [payouts, setPayouts] = useState<Payout[]>(initialPayouts)
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
            toast({ title: 'Status do saque atualizado!', description: 'A alteração está sendo sincronizada.' })
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
        if (!details || !details.details) return 'Chave não informada'
        return details.details
    }

    const pendingPayouts = payouts.filter(p => p.status === 'requested' || p.status === 'pending')

    return (
        <RegistrySection
            title="Solicitações de Saque"
            subtitle="Gestão de pagamentos e transferências para afiliados."
            icon={Banknote}
        >
            <Stack gap={5}>
                {pendingPayouts.length === 0 ? (
                    <EmptyState 
                        icon={CheckCircle2} 
                        title="Tudo em dia!" 
                        description="Nenhuma solicitação de saque pendente no momento."
                    />
                ) : (
                    <Stack gap={5}>
                        {pendingPayouts.map(payout => (
                            <ActionableListCard
                                key={payout.id}
                                badges={
                                    <Stack direction="row" gap={2.5} align="center">
                                        <Badge label="PENDENTE" color="amber" variant="glass" size="xs" />
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
                                    <Box padding={2.5} rounded="system" variant="liquid-success">
                                        <Stack direction={{ base: 'col', md: 'row' }} gap={5} align={{ base: 'stretch', md: 'center' }} justify="between">
                                            <Stack gap={2.5}>
                                                <Font variant="sub-tiny" color="success" weight="black" uppercase tracking="widest" opacity={50}>Chave PIX</Font>
                                                <Font variant="body-sm" color="white" weight="bold" breakAll>{formatPixKey(payout.payout_details)}</Font>
                                            </Stack>
                                            <Font variant="heading" color="success" weight="black">R$ {Number(payout.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Font>
                                        </Stack>
                                    </Box>
                                }
                            >
                                <Stack direction="row" gap={5} align="center">
                                    <BaseAvatar 
                                        src={payout.profiles?.avatar_url || undefined} 
                                        initials={(payout.profiles?.full_name || '??').substring(0, 2).toUpperCase()} 
                                        size="md" 
                                        variant="zinc"
                                    />
                                    <Stack gap={0} minWidth={0}>
                                        <Font weight="black" uppercase italic color="white" variant={{ base: 'body-sm', md: 'body' }} tracking="wider" truncate display="block">
                                            {payout.profiles?.full_name || 'Usuário Desconhecido'}
                                        </Font>
                                        <Box fullWidth minWidth={0} overflow="hidden">
                                            <Font variant="sub-tiny" color="zinc-600" lowercase truncate display="block">
                                                {payout.profiles?.email}
                                            </Font>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </ActionableListCard>
                        ))}
                    </Stack>
                )}

                <Modal
                    isOpen={modalConfig.open}
                    onClose={() => setModalConfig({ ...modalConfig, open: false })}
                    title={modalConfig.status === 'completed' ? "Confirmar Pagamento" : "Rejeitar Solicitação"}
                    subtitle={modalConfig.status === 'completed' 
                        ? "Confirme que a transferência via PIX foi realizada com sucesso." 
                        : "Esta ação informará ao afiliado que a solicitação foi negada."
                    }
                    icon={modalConfig.status === 'completed' ? CheckCircle2 : XCircle}
                    variant={modalConfig.status === 'completed' ? 'emerald' : 'red'}
                    onConfirm={confirmUpdateStatus}
                    confirmLabel={modalConfig.status === 'completed' ? "Confirmar" : "Rejeitar"}
                >
                    <Stack gap={2.5}>
                        <Font variant="body" color="zinc-400">
                            {modalConfig.status === 'completed' 
                                ? "Ao confirmar, o status do saque será atualizado para 'Pago' e o valor será deduzido permanentemente do saldo do afiliado."
                                : "Tem certeza que deseja rejeitar esta solicitação? O saldo retornará para a conta do afiliado."
                            }
                        </Font>
                    </Stack>
                </Modal>
            </Stack>
        </RegistrySection>
    )
}

    
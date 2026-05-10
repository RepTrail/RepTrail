'use client'

import { useState } from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Badge } from '../base/badge'
import { BaseAvatar } from '../base/avatar'
import { Divider, Inline } from '../base/layout'
import { Modal } from '../advanced/modal'
import { RegistrySection } from '../advanced/registry-section'
import { EmptyState } from '../intermediary/empty-state'
import { CheckCircle2, XCircle, Clock, Banknote, History, LucideIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { ActionableListCard } from '../intermediary/actionable-list-card'
import { ActionIconButton } from '../intermediary/action-icon-button'

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
    const completedPayouts = payouts.filter(p => p.status !== 'requested' && p.status !== 'pending')

    return (
        <Stack gap="section">
            {/* Solicitações Pendentes */}
            <RegistrySection title="Saques Pendentes" icon={Banknote} subtitle="Analise e aprove as solicitações de transferência dos afiliados.">
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
                                    <Inline gap={2.5} align="center">
                                        <Badge label="PENDENTE" color="amber" variant="glass" size="xs" rounded="full" />
                                        <Badge label={new Date(payout.created_at).toLocaleDateString('pt-BR')} variant="glass" size="xs" rounded="full" />
                                    </Inline>
                                }
                                actions={
                                    <>
                                        <ActionIconButton 
                                            icon={XCircle} 
                                            variant="outline-red" 
                                            onClick={() => handleUpdateStatus(payout.id, 'rejected')} 
                                        />
                                        <ActionIconButton 
                                            icon={CheckCircle2} 
                                            variant="outline-emerald" 
                                            onClick={() => handleUpdateStatus(payout.id, 'completed')} 
                                        />
                                    </>
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
                                <Inline gap={5} align="center">
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
                                </Inline>
                            </ActionableListCard>
                        ))}
                    </Stack>
                )}
            </RegistrySection>

            {/* Histórico de Saques */}
            {completedPayouts.length > 0 && (
                <RegistrySection
                    title="Histórico de Saques"
                    subtitle="Relatório completo de todas as transações finalizadas."
                    icon={History}
                >
                    <Stack gap={2.5}>
                        {completedPayouts.map(p => (
                            <ActionableListCard
                                key={p.id}
                                badges={
                                    <Inline gap={2.5} align="center">
                                        <Badge label={new Date(p.created_at).toLocaleDateString('pt-BR')} variant="glass" size="xs" rounded="full" />
                                        <Badge 
                                            label={p.status === 'completed' || p.status === 'paid' ? 'PAGO' : 'REJEITADO'} 
                                            color={p.status === 'completed' || p.status === 'paid' ? 'emerald' : 'red'}
                                            variant="glass"
                                            size="xs"
                                            rounded="full"
                                        />
                                    </Inline>
                                }
                            >
                                <Inline gap={5} align="center">
                                    <BaseAvatar 
                                        src={p.profiles?.avatar_url || undefined} 
                                        initials={(p.profiles?.full_name || '??').substring(0, 2).toUpperCase()} 
                                        size="sm" 
                                        variant="zinc"
                                    />
                                    <Stack gap={0} minWidth={0}>
                                        <Font weight="black" uppercase italic color="white" variant="body-sm" tracking="wider" truncate display="block">
                                            {p.profiles?.full_name}
                                        </Font>
                                        <Font variant="sub-tiny" color="zinc-600" uppercase tracking="widest" display="block">
                                            R$ {Number(p.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </Font>
                                    </Stack>
                                </Inline>
                            </ActionableListCard>
                        ))}
                    </Stack>
                </RegistrySection>
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
    )
}
    
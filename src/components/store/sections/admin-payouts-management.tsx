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
import { Modal } from '../advanced/modal'
import { RegistrySection } from '../advanced/registry-section'
import { EmptyState } from '../intermediary/empty-state'
import { CheckCircle2, XCircle, Clock, Banknote, History } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

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
            <RegistrySection
                title="Saques Pendentes"
                subtitle="Analise e aprove as solicitações de transferência dos afiliados."
                icon={Banknote}
            >
                {pendingPayouts.length === 0 ? (
                    <EmptyState 
                        icon={CheckCircle2} 
                        title="Tudo em dia!" 
                        description="Nenhuma solicitação de saque pendente no momento."
                    />
                ) : (
                    <Grid cols={1} mdCols={2} lgCols={3} gap={5}>
                        {pendingPayouts.map(payout => (
                            <Box 
                                key={payout.id} 
                                padding={5} 
                                rounded="system" 
                                className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                                <Stack gap={5} fullHeight justify="between">
                                    <Stack gap={2.5}>
                                        <Stack direction="row" gap={5} align="center">
                                            <BaseAvatar 
                                                src={payout.profiles?.avatar_url || undefined} 
                                                initials={(payout.profiles?.full_name || '??').substring(0, 2).toUpperCase()} 
                                                size="md" 
                                                variant="zinc"
                                            />
                                            <Stack gap={0} flex1>
                                                <Stack direction="row" justify="between" align="start">
                                                    <Stack gap={0}>
                                                        <Font variant="body" weight="black" color="white" uppercase italic>{payout.profiles?.full_name || 'Usuário Desconhecido'}</Font>
                                                        <Font variant="auxiliary" color="zinc-500">{payout.profiles?.email}</Font>
                                                    </Stack>
                                                    <Badge label="PENDENTE" color="amber" variant="glass" size="xs" />
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                        <Box padding={2.5} rounded="system" className="bg-zinc-950 border border-zinc-800/50">
                                            <Stack gap={1}>
                                                <Font variant="label-caps" color="zinc-500">Chave PIX</Font>
                                                <Font variant="auxiliary" color="zinc-400" className="font-mono break-all">{formatPixKey(payout.payout_details)}</Font>
                                            </Stack>
                                        </Box>

                                        <Stack direction="row" justify="between" align="end">
                                            <Font variant="auxiliary" color="zinc-500">{new Date(payout.created_at).toLocaleDateString('pt-BR')}</Font>
                                            <Font variant="heading" color="emerald">R$ {Number(payout.amount).toFixed(2)}</Font>
                                        </Stack>
                                    </Stack>

                                    <Grid cols={2} gap={2.5} className="pt-4 border-t border-zinc-800/50">
                                        <Button
                                            variant="outline-red"
                                            onClick={() => handleUpdateStatus(payout.id, 'rejected')}
                                            className="h-10"
                                        >
                                            <Stack direction="row" gap={2.5} align="center">
                                                <Icon icon={XCircle} size="xs" />
                                                <Font variant="label-caps">Rejeitar</Font>
                                            </Stack>
                                        </Button>
                                        <Button
                                            variant="emerald"
                                            onClick={() => handleUpdateStatus(payout.id, 'completed')}
                                            className="h-10"
                                            textColor="black"
                                        >
                                            <Stack direction="row" gap={2.5} align="center">
                                                <Icon icon={CheckCircle2} size="xs" />
                                                <Font variant="label-caps">Pago (Pix)</Font>
                                            </Stack>
                                        </Button>
                                    </Grid>
                                </Stack>
                            </Box>
                        ))}
                    </Grid>
                )}
            </RegistrySection>

            {/* Histórico de Saques */}
            {completedPayouts.length > 0 && (
                <RegistrySection
                    title="Histórico de Saques"
                    subtitle="Relatório completo de todas as transações finalizadas."
                    icon={History}
                >
                    <Box rounded="system" className="bg-zinc-900/20 border border-zinc-800 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-950/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4"><Font variant="label-caps" color="zinc-500">Afiliado</Font></th>
                                    <th className="px-6 py-4 text-center"><Font variant="label-caps" color="zinc-500">Data</Font></th>
                                    <th className="px-6 py-4 text-center"><Font variant="label-caps" color="zinc-500">Valor</Font></th>
                                    <th className="px-6 py-4 text-right"><Font variant="label-caps" color="zinc-500">Status</Font></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {completedPayouts.map(p => (
                                    <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <Stack direction="row" gap={5} align="center">
                                                <BaseAvatar 
                                                    src={p.profiles?.avatar_url || undefined} 
                                                    initials={(p.profiles?.full_name || '??').substring(0, 2).toUpperCase()} 
                                                    size="sm" 
                                                    variant="zinc"
                                                />
                                                <Stack gap={0}>
                                                    <Font variant="body" weight="bold" color="white">{p.profiles?.full_name}</Font>
                                                    <Font variant="auxiliary" color="zinc-500">{p.profiles?.email}</Font>
                                                </Stack>
                                            </Stack>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Font variant="auxiliary" color="zinc-400">{new Date(p.created_at).toLocaleDateString('pt-BR')}</Font>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Font variant="body" weight="black" color="zinc-400">R$ {Number(p.amount).toFixed(2)}</Font>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Stack direction="row" justify="end">
                                                <Badge 
                                                    label={p.status === 'completed' || p.status === 'paid' ? 'PAGO' : 'REJEITADO'} 
                                                    color={p.status === 'completed' || p.status === 'paid' ? 'emerald' : 'red'}
                                                    variant="glass"
                                                    size="xs"
                                                />
                                            </Stack>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Box>
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

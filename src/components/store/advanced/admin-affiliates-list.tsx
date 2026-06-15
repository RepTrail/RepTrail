'use client'

import React, { useState } from 'react'
import { getAdminAffiliates, removeAffiliate } from '@/lib/dal/remote'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Modal } from '@/components/store/advanced/modal'
import { AffiliateListItem } from '@/components/store/intermediary/affiliate-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { HeartHandshake, Search, XCircle } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AdminAffiliatesList: Encapsulates the logic for managing the affiliates list.
 * - Handles data fetching, searching, and status removal.
 * - Manages the confirmation modal for removal.
 * - Responsibility: Affiliates domain logic and interaction.
 */
export function AdminAffiliatesList() {
    const { toast } = useToast()
    const [search, setSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState({ open: false, id: '', name: '' })

    const { data: affiliatesData, isLoading, refetch } = useQuery({
        queryKey: ['admin-affiliates'],
        queryFn: () => getAdminAffiliates()
    })

    const affiliates = (affiliatesData?.data || [])
        .filter((a: any) =>
            !search ||
            a?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            a.email?.toLowerCase().includes(search.toLowerCase())
        )

    const handleRemoveAffiliate = (id: string, name: string) => {
        setDeleteModal({ open: true, id, name })
    }

    const confirmRemoveAffiliate = async () => {
        try {
            await removeAffiliate(deleteModal.id)
            toast({ title: 'Afiliado removido', description: `${deleteModal.name} nÃ£o Ã© mais um afiliado.` })
            refetch()
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao remover', description: 'NÃ£o foi possÃ­vel processar a solicitaÃ§Ã£o.' })
        } finally {
            setDeleteModal({ open: false, id: '', name: '' })
        }
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                icon={<Search size={18} />}
            />
            {isLoading ? (
                <EmptyState
                    icon={HeartHandshake}
                    title="Carregando..."
                    description="Buscando parceiros cadastrados."
                />
            ) : affiliates.length === 0 ? (
                <EmptyState
                    icon={HeartHandshake}
                    title={search ? "Nenhum resultado" : "Nenhum afiliado ativo"}
                    description={search ? "Tente ajustar sua busca." : "Utilize o painel de afiliados para adicionar novos parceiros comerciais."}
                />
            ) : (
                affiliates.map((affiliate: any) => (
                    <AffiliateListItem
                        key={affiliate.id}
                        affiliateId={affiliate.id}
                        name={affiliate?.full_name || 'UsuÃ¡rio sem nome'}
                        email={affiliate.email || ''}
                        registrationDate={new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                        referrals={{
                            total: affiliate.total_referrals || 0,
                            active: affiliate.active_referrals || 0,
                        }}
                        revenue={`R$ ${Number(affiliate.revenue_generated || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        commission={`R$ ${Number(affiliate.monthly_commission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        rate={affiliate.commission_rate ?? 10}
                        onDelete={() => handleRemoveAffiliate(affiliate.id, affiliate?.full_name || 'afiliado')}
                    />
                ))
            )}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                title="Remover Afiliado"
                subtitle={`Deseja remover o status de afiliado de ${deleteModal.name}?`}
                icon={XCircle}
                variant="red"
                onConfirm={confirmRemoveAffiliate}
                confirmLabel="Remover"
            >
                <Font
                    variant="body"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    Esta aÃ§Ã£o removerÃ¡ imediatamente o acesso do usuÃ¡rio ao painel de afiliado e interromperÃ¡ o rastreamento de novas comissÃµes.
                </Font>
            </Modal>
        </Stack>
    );
}

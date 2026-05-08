'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAllUsers } from '@/actions/admin-actions'
import { getAdminAffiliates, getAdminPayouts } from '@/actions/admin-affiliate-actions'
import { createClient } from '@/lib/supabase/client'
import { AdminPageShell } from '@/components/store/advanced/admin-page-shell'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { AffiliateListItem } from '@/components/store/intermediary/affiliate-list-item'
import { AdminPayoutsManagement } from '@/components/store/sections/admin-payouts-management'
import { useToast } from '@/hooks/use-toast'
import { toggleAffiliateStatus } from '@/actions/admin-affiliate-actions'
import { Modal } from '@/components/store/advanced/modal'
import { HeartHandshake, CreditCard, Search, XCircle } from 'lucide-react'

export default function AdminAfiliadosPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string, name: string }>({
        open: false,
        id: '',
        name: ''
    })
    const { toast } = useToast()

    const { data: affiliatesData, isLoading: loadingAffiliates } = useQuery({
        queryKey: QUERY_KEYS.admin.affiliates,
        queryFn: () => getAdminAffiliates()
    })
    const { data: payoutsData } = useQuery({
        queryKey: QUERY_KEYS.admin.payouts,
        queryFn: () => getAdminPayouts()
    })

    const { data: adminUser } = useQuery({
        queryKey: QUERY_KEYS.auth.user,
        queryFn: async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return null
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
            return profile || authUser
        }
    })

    const affiliates = (affiliatesData?.data || [])
        .filter((a: any) => !search || a.full_name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()))
    const payouts = payoutsData?.data || []

    async function handleRemoveAffiliate(userId: string, name: string) {
        setDeleteModal({ open: true, id: userId, name })
    }

    async function confirmRemoveAffiliate() {
        if (!deleteModal.id) return
        const res = await toggleAffiliateStatus(deleteModal.id)
        if ((res as any)?.error) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao remover afiliado.' })
        } else {
            toast({ title: 'Afiliado removido!' })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.affiliates })
        }
        setDeleteModal({ open: false, id: '', name: '' })
    }

    return (
        <AdminPageShell
            pageTitle="GESTÃO DE AFILIADOS"
            subtitle="Administração de parceiros comerciais, comissões e indicações."
            icon={HeartHandshake}
            user={{
                id: adminUser?.id || 'admin',
                name: adminUser?.full_name || 'Admin RepTrail',
                email: adminUser?.email || 'admin@reptrail.com.br',
                avatar_url: adminUser?.avatar_url || null,
            }}
        >
            <Stack gap="section">
                <RegistrySection
                    title="Parceiros Afiliados"
                    subtitle="Gerencie os membros do seu programa de parceiros e suas comissões."
                    icon={HeartHandshake}
                >
                    <Stack gap={5}>
                        <Input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar parceiro por nome ou email..."
                            icon={<Search size={16} />}
                            rounded="full"
                        />

                        {loadingAffiliates && (
                            <EmptyState icon={HeartHandshake} title="Carregando..." description="Buscando parceiros cadastrados." />
                        )}

                        {!loadingAffiliates && affiliates.map((affiliate: any) => (
                            <AffiliateListItem
                                key={affiliate.id}
                                name={affiliate.full_name || 'Sem nome'}
                                email={affiliate.email || ''}
                                avatarUrl={affiliate.avatar_url}
                                affiliateId={affiliate.affiliate_token || affiliate.id.slice(0, 8)}
                                registrationDate={new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                                referrals={{
                                    total: affiliate.total_referrals || 0,
                                    active: affiliate.active_referrals || 0,
                                }}
                                revenue={`R$ ${Number(affiliate.revenue_generated || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                commission={`R$ ${Number(affiliate.monthly_commission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                rate={affiliate.commission_rate ?? 10}
                                onDelete={() => handleRemoveAffiliate(affiliate.id, affiliate.full_name || 'afiliado')}
                            />
                        ))}

                        {!loadingAffiliates && affiliates.length === 0 && (
                            <EmptyState
                                icon={HeartHandshake}
                                title="Nenhum afiliado ativo"
                                description="Utilize o painel de afiliados para adicionar novos parceiros comerciais."
                            />
                        )}
                    </Stack>
                </RegistrySection>

                <AdminPayoutsManagement initialPayouts={payouts} />

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
                    <Font variant="body" color="zinc-400">
                        Esta ação removerá imediatamente o acesso do usuário ao painel de afiliado e interromperá o rastreamento de novas comissões.
                    </Font>
                </Modal>
            </Stack>
        </AdminPageShell>
    )
}

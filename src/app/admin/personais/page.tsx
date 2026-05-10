'use client'

import { useState, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getAllTrainers, updateUserPlanTier, toggleEliteStatus,
    toggleBillingExemption, grantEliteTrial, impersonateUser, deleteUser
} from '@/actions/admin-actions'
import { createClient } from '@/lib/supabase/client'
import { AdminPageShell } from '@/components/store/advanced/admin-page-shell'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { useToast } from '@/hooks/use-toast'
import { UserCheck, Search, XCircle } from 'lucide-react'

export default function AdminPersonaisPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string, name: string }>({
        open: false,
        id: '',
        name: ''
    })
    const { toast } = useToast()

    const { data: trainers = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.trainers,
        queryFn: () => getAllTrainers()
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

    async function handleOnDemandToggle(userId: string, currentTier: string) {
        startTransition(async () => {
            const newTier = currentTier === 'on_demand' ? 'free' : 'on_demand'
            const res = await updateUserPlanTier(userId, newTier)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: newTier === 'on_demand' ? 'Plano On-Demand ativado!' : 'Plano removido' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
        })
    }

    async function handleImpersonate(userId: string) {
        startTransition(async () => {
            const res = await impersonateUser(userId)
            if (res?.error) toast({ variant: 'destructive', title: 'Erro ao inspecionar', description: res.error })
        })
    }

    async function handleDeleteUser(userId: string, userName: string) {
        setDeleteModal({ open: true, id: userId, name: userName })
    }

    async function confirmDeleteUser() {
        if (!deleteModal.id) return
        startTransition(async () => {
            const res = await deleteUser(deleteModal.id)
            if (res.error) {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            } else {
                toast({ title: 'Personal deletado com sucesso!' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
            setDeleteModal({ open: false, id: '', name: '' })
        })
    }

    const filtered = trainers.filter(t => t.full_name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminPageShell
            pageTitle="GESTÃO DE PERSONAIS"
            subtitle="Administração de profissionais parceiros e planos On-Demand."
            icon={UserCheck}
            user={{
                id: adminUser?.id || 'admin',
                name: adminUser?.full_name || 'Admin RepTrail',
                email: adminUser?.email || 'admin@reptrail.com.br',
                avatar_url: adminUser?.avatar_url || null,
            }}
        >
            <RegistrySection
                title="Lista de Personais"
                subtitle="Administre os profissionais parceiros e suas credenciais de acesso."
                icon={UserCheck}
            >
                <Stack gap={5}>
                    <Input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar personal por nome ou email..."
                        icon={<Search size={16} />}
                        rounded="full"
                    />

                    {isLoading && <EmptyState icon={UserCheck} title="Carregando..." description="Buscando personais cadastrados." />}

                    {!isLoading && filtered.map(trainer => (
                        <UserListItem
                            key={trainer.id}
                            name={trainer.full_name || 'Sem nome'}
                            email={trainer.email || ''}
                            registrationDate={new Date(trainer.created_at).toLocaleDateString('pt-BR')}
                            role="personal"
                            roleLabel={trainer.students ? `${trainer.students.length} ALUNO${trainer.students.length !== 1 ? 'S' : ''}` : "0 ALUNOS"}
                            initials={(trainer.full_name || '??').substring(0, 2).toUpperCase()}
                            avatarVariant="orange"
                            avatarUrl={trainer.avatar_url}
                            onInspect={() => handleImpersonate(trainer.id)}
                            onAction={() => handleOnDemandToggle(trainer.id, trainer.plan_tier || 'free')}
                            isActionActive={trainer.plan_tier === 'on_demand'}
                            onDelete={() => handleDeleteUser(trainer.id, trainer.full_name || trainer.email)}
                        />
                    ))}

                    {!isLoading && filtered.length === 0 && (
                        <EmptyState icon={Search} title="Nenhum personal encontrado" description="Tente ajustar os filtros de busca." />
                    )}
                </Stack>
            </RegistrySection>

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                title="Deletar Personal"
                subtitle={`Deseja deletar permanentemente ${deleteModal.name}?`}
                icon={XCircle}
                variant="red"
                onConfirm={confirmDeleteUser}
                confirmLabel="Deletar"
            >
                <Font variant="body" color="zinc-400">
                    Esta ação é irreversível e removerá todos os dados do profissional, incluindo acesso à plataforma de gestão.
                </Font>
            </Modal>
        </AdminPageShell>
    )
}

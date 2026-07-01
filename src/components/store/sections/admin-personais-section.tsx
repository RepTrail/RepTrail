'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useState, useTransition } from 'react'
import { useQuery, useQueryClient, actions } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { useToast } from '@/components/store/hooks/use-toast'
import { UserCheck, Search, XCircle, Zap, ShieldCheck, Infinity, Ban } from 'lucide-react'
import { iconMap } from '@/components/store/constants/icon-map'

function getPlanIcon(slug: string | null | undefined, cardTheme?: string | null) {
    if (cardTheme) {
        const iconName = cardTheme.split(':')[1]
        if (iconName && iconMap[iconName as keyof typeof iconMap]) {
            return iconMap[iconName as keyof typeof iconMap]
        }
    }
    
    // Retrocompatibilidade
    if (slug === 'pro') return ShieldCheck
    if (slug === 'elite') return Infinity
    if (slug === 'on_demand' || slug === 'starter') return Zap
    return Ban
}

export function AdminPersonaisSection() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [_, startTransition] = useTransition()
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string, name: string }>({
        open: false,
        id: '',
        name: ''
    })
    const { toast } = useToast()

    const { data: trainers = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.trainers,
        queryFn: () => actions.getAllTrainers()
    })



    async function handleImpersonate(userId: string) {
        startTransition(async () => {
            const res = await actions.impersonateUser(userId)
            if (res?.error) toast({ variant: 'destructive', title: 'Erro ao inspecionar', description: res.error })
        })
    }

    async function handleDeleteUser(userId: string, userName: string) {
        setDeleteModal({ open: true, id: userId, name: userName })
    }

    async function confirmDeleteUser() {
        if (!deleteModal.id) return
        startTransition(async () => {
            const res = await actions.deleteUser(deleteModal.id)
            if (res.error) {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            } else {
                toast({ title: 'Personal deletado com sucesso!' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
            setDeleteModal({ open: false, id: '', name: '' })
        })
    }

    const filtered = trainers.filter(t => t?.full_name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar personal por nome ou email..."
                    icon={<Search size={16} />}
                    rounded={STORE_TOKENS.RADIUS.FULL}
                />

                {isLoading && <EmptyState icon={UserCheck} title="Carregando..." description="Buscando personais cadastrados." />}

                {!isLoading && filtered.map(trainer => {
                    const planSlug = (Array.isArray(trainer.plans) ? trainer.plans[0]?.slug : (trainer.plans as any)?.slug) || (trainer.plan_tier === 'none' ? null : trainer.plan_tier)
                    const planTheme = (Array.isArray(trainer.plans) ? trainer.plans[0]?.card_theme : (trainer.plans as any)?.card_theme)
                    return (
                        <UserListItem
                            key={trainer.id}
                            name={trainer?.full_name || 'Sem nome'}
                            email={trainer.email || ''}
                            registrationDate={new Date(trainer.created_at).toLocaleDateString('pt-BR')}
                            role="personal"
                            roleLabel={trainer.students ? `${trainer.students.length} ALUNO${trainer.students.length !== 1 ? 'S' : ''}` : "0 ALUNOS"}
                            initials={(trainer?.full_name || '??').substring(0, 2).toUpperCase()}
                            avatarVariant="orange"
                            avatarUrl={trainer.avatar_url}
                            onInspect={() => handleImpersonate(trainer.id)}
                            isActionActive={planSlug === 'on_demand'}
                            actionIcon={getPlanIcon(planSlug, planTheme)}
                            onDelete={() => handleDeleteUser(trainer.id, trainer?.full_name || trainer.email)}
                        />
                    )
                })}

                {!isLoading && filtered.length === 0 && (
                    <EmptyState icon={Search} title="Nenhum personal encontrado" description="Tente ajustar os filtros de busca." />
                )}
            </Stack>

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
                <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    Esta ação é irreversível e removerá todos os dados do profissional, incluindo acesso Ã  plataforma de gestão.
                </Font>
            </Modal>

        </>
    )
}

'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useState, useTransition } from 'react'
import { useQueryClient, useAuthUser, useAdminStudents, useImpersonateUser, useDeleteUser, useGrantAutoTraining } from '@/lib/dal'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { useToast } from '@/hooks/use-toast'
import { GraduationCap, Search, XCircle } from 'lucide-react'

export function AdminAlunosSection() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string, name: string }>({
        open: false,
        id: '',
        name: ''
    })
    const { toast } = useToast()

    const { data: allUsers = [], isLoading } = useAdminStudents()
    const { data: adminUser } = useAuthUser()

    const impersonateMutation = useImpersonateUser()
    const deleteUserMutation = useDeleteUser()
    const grantAutoTrainingMutation = useGrantAutoTraining()

    async function handleImpersonate(userId: string) {
        startTransition(async () => {
            const res = await impersonateMutation.mutateAsync(userId)
            if (res?.error) toast({ variant: 'destructive', title: 'Erro ao inspecionar', description: res.error })
        })
    }

    async function handleDeleteUser(userId: string, userName: string) {
        setDeleteModal({ open: true, id: userId, name: userName })
    }

    async function confirmDeleteUser() {
        if (!deleteModal.id) return
        startTransition(async () => {
            const res = await deleteUserMutation.mutateAsync(deleteModal.id)
            if (res.error) {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            } else {
                toast({ title: 'Aluno deletado com sucesso!' })
            }
            setDeleteModal({ open: false, id: '', name: '' })
        })
    }

    async function handleGrantAutoTraining(studentId: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'none' : 'active'
        startTransition(async () => {
            const res = await grantAutoTrainingMutation.mutateAsync({ studentId, status: newStatus })
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: newStatus === 'active' ? 'Auto-Treino concedido!' : 'Auto-Treino removido' })
            }
        })
    }

    const students = allUsers
        .filter(s => s.role === 'student')
        .filter(s =>
            !search ||
            s?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase())
        )

    return (
        <>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {/* Search */}
            <Input
                value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar aluno por nome ou email..."
                        icon={<Search size={16} />}
                        rounded={STORE_TOKENS.RADIUS.FULL}
                    />

                    {isLoading && <EmptyState icon={GraduationCap} title="Carregando..." description="Buscando alunos cadastrados." />}

                    {!isLoading && students.map(student => (
                        <UserListItem
                            key={student.id}
                            name={student?.full_name || 'Sem nome'}
                            email={student.email || ''}
                            registrationDate={new Date(student.created_at).toLocaleDateString('pt-BR')}
                            role="aluno"
                            roleLabel={(student as any).auto_training_status === 'active' ? 'AUTO-TREINO' : 'ALUNO'}
                            initials={(student?.full_name || '??').substring(0, 2).toUpperCase()}
                            avatarVariant="emerald"
                            avatarUrl={student.avatar_url}
                            onInspect={() => handleImpersonate(student.id)}
                            onAction={() => handleGrantAutoTraining(student.id, (student as any).auto_training_status)}
                            isActionActive={(student as any).auto_training_status === 'active'}
                            onDelete={() => handleDeleteUser(student.id, student?.full_name || student.email)}
                        />
                    ))}

                    {!isLoading && students.length === 0 && (
                        <EmptyState icon={Search} title="Nenhum aluno encontrado" description="Tente ajustar os filtros de busca." />
                    )}
                </Stack>

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                title="Deletar Aluno"
                subtitle={`Deseja deletar permanentemente ${deleteModal.name}?`}
                icon={XCircle}
                variant="red"
                onConfirm={confirmDeleteUser}
                confirmLabel="Deletar"
            >
                <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    Esta ação é irreversível e removerá todos os dados do aluno, incluindo histórico de treinos e assinaturas vinculadas.
                </Font>
            </Modal>
        </>
    )
}

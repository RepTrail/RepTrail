'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Utensils } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { DietPreviewDialog } from '@/components/store/advanced/diet-preview-dialog'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { AssignedStudentInfo } from '@/components/store/intermediary/assigned-student-mini-card'

interface DietManagementSectionContentProps {
    userId?: string
    diets?: any[]
    mode?: 'auto' | 'personal' | 'trainer'
    isEmpty?: boolean
    betaTesterMode?: boolean
}

/**
 * DietManagementSectionContent: Grid of premium diet cards.
 */
export function DietManagementSectionContent({ 
    userId = 'mock-id',
    diets,
    mode = 'auto',
    isEmpty = false,
    betaTesterMode = false
}: DietManagementSectionContentProps) {
    const libraryQueryKey = QUERY_KEYS.diets.library(userId)
    const assignedQueryKey = QUERY_KEYS.diets.all(userId)
    const activeQueryKey = mode === 'auto' || mode === 'trainer' ? libraryQueryKey : assignedQueryKey
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_diet'
    })
    const [previewDiet, setPreviewDiet] = React.useState<{ isOpen: boolean, dietId: string, dietName: string }>({
        isOpen: false,
        dietId: '',
        dietName: ''
    })

    const router = useRouter()

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.DIET,
        actionName: 'delete-diet',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData
            return oldData.filter((item: any) => item.id !== variables.id)
        }
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.DIET,
        actionName: 'duplicate-diet'
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.diets.all(userId),
        entity: ENTITIES.DIET,
        actionName: 'assign-diet',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData;
            return oldData.map((item: any) => {
                if (item.id === variables.dietId) {
                    const newAssignments = variables.daysOfWeek.map((day: number) => ({
                        day_of_week: day,
                        student_id: variables.studentId
                    }))
                    if (mode === 'trainer') {
                        return { ...item, assignments: newAssignments }
                    } else {
                        return { ...item, assigned_diets: newAssignments }
                    }
                }
                return item;
            })
        }
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.DIET,
        actionName: 'update-diet'
    })

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.diets.library(userId),
        entity: ENTITIES.DIET,
        actionName: 'create-manual-diet'
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data && actionModal.type !== 'create_diet') return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id, userId })
                break
            case 'confirm_duplicate':
                duplicateMutation({ id: actionModal.data.id, userId })
                break
            case 'assign_diet':
                if (data?.selectedDays && Array.isArray(data.selectedDays)) {
                    assignMutation({ 
                        dietId: actionModal.data.id, 
                        studentId: userId, 
                        daysOfWeek: data.selectedDays 
                    })
                }
                break
            case 'create_diet':
                if (data?.name) {
                    createMutation({
                        name: data.name,
                        description: data.description,
                        daysOfWeek: data.selectedDays,
                        userId
                    })
                }
                break
        }
        closeAction()
    }

    React.useEffect(() => {
        if (mode === 'trainer') return
        const handler = (e: any) => {
            if (e.detail?.type === 'create_diet') {
                openAction('create_diet', {})
            }
        }
        window.addEventListener('open-diet-action', handler)
        return () => window.removeEventListener('open-diet-action', handler)
    }, [mode])

    const openAction = (type: RegistryActionType, data?: any) => {
        const selectedDays = (data.assigned_diets || []).map((a: any) => a.day_of_week)
        setActionModal({ 
            isOpen: true, 
            type, 
            data: { ...data, selectedDays } 
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))

    if (isEmpty || !diets || diets.length === 0) {
        return (
            <EmptyState 
                icon={Utensils}
                title="SEM DIETAS"
                description={
                    mode === 'trainer'
                        ? (betaTesterMode ? 'Crie uma nova dieta para começar.' : 'Importe um PDF ou crie uma nova dieta para começar.')
                        : mode === 'auto'
                            ? "Você ainda não possui protocolos alimentares cadastrados."
                            : "Seu treinador ainda não atribuiu dietas para sua conta."
                }
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {diets.map((diet, idx) => {
                    const daySet = new Set<number>()

                    if (mode === 'trainer') {
                        ;(diet.assignments || []).forEach((a: any) => {
                            const days = Array.isArray(a.days_of_week)
                                ? a.days_of_week
                                : typeof a.days_of_week === 'string'
                                    ? JSON.parse(a.days_of_week)
                                    : []
                            days.forEach((d: number) => daySet.add(d))
                        })
                    } else {
                        ;(diet.assigned_diets || []).forEach((a: any) => {
                            if (a.day_of_week !== null && a.day_of_week !== undefined) {
                                daySet.add(a.day_of_week)
                            }
                        })
                    }

                    const assignedDays = Array.from(daySet)
                        .sort((a, b) => a - b)
                        .map((d) => dayNamesShort[d % 7])

                    const mealsCount = diet.meals?.[0]?.count
                        ?? (Array.isArray(diet.meals) ? diet.meals.length : 0)
                        ?? diet.meals_count
                        ?? 0

                    const assignedStudents: AssignedStudentInfo[] | undefined = mode === 'trainer'
                        ? (diet.assignments || []).map((a: any) => ({
                            id: a.student_id || `pending-${a.id}`,
                            name: a.student?.full_name || 'Aluno',
                            avatarUrl: a.student?.avatar_url,
                            isPlaceholder: a.is_placeholder,
                        }))
                        : undefined

                    const editPath = mode === 'trainer'
                        ? `/dashboard/trainer/diets/${diet.id}`
                        : `/dashboard/student/diet/${diet.id}`

                    return (
                        <ManagementCardPremium
                            key={diet.id || idx}
                            title={diet.name.toUpperCase()}
                            description={diet.description || (mode === 'trainer' ? 'Sem descrição disponível.' : 'Plano alimentar oficial.')}
                            days={assignedDays}
                            assignedStudents={assignedStudents}
                            mainStat={{ label: 'REFEIÇÕES', value: mealsCount }}
                            date={new Date(diet.created_at).toLocaleDateString('pt-BR')}
                            icon={Utensils}
                            mode={mode}
                            registryType="diet"
                            onView={mode === 'personal' ? () => setPreviewDiet({ isOpen: true, dietId: diet.id, dietName: diet.name }) : undefined}
                            onSchedule={mode === 'auto' ? () => openAction('assign_diet', diet) : undefined}
                            onEdit={() => router.push(editPath)}
                            onDelete={mode !== 'personal' ? () => openAction('confirm_delete', diet) : undefined}
                            onDuplicate={mode !== 'personal' ? () => openAction('confirm_duplicate', diet) : undefined}
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND as any,
                            }} />
                    );
                })}
            </Grid>
            <RegistryActionModal 
                isOpen={actionModal.isOpen}
                onClose={closeAction}
                type={actionModal.type}
                onConfirm={handleConfirm}
                initialData={actionModal.data}
            />
            <DietPreviewDialog
                dietId={previewDiet.dietId}
                dietName={previewDiet.dietName}
                isOpen={previewDiet.isOpen}
                onClose={() => setPreviewDiet(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}

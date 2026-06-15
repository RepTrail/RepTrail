'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Activity } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { AssignedStudentInfo } from '@/components/store/intermediary/assigned-student-mini-card'

interface CardioManagementSectionContentProps {
    userId?: string
    cardios?: any[]
    students?: any[]
    mode?: 'auto' | 'personal' | 'trainer'
    isEmpty?: boolean
}

/**
 * CardioManagementSectionContent: Grid of premium cardio cards.
 */
export function CardioManagementSectionContent({
    userId = 'mock-id',
    cardios,
    students = [],
    mode = 'auto',
    isEmpty = false
}: CardioManagementSectionContentProps) {
    const libraryQueryKey = QUERY_KEYS.cardio.library(userId)
    const assignedQueryKey = QUERY_KEYS.cardio.all(userId)
    const activeQueryKey = mode === 'auto' || mode === 'trainer' ? libraryQueryKey : assignedQueryKey

    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_cardio'
    })

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.CARDIO,
        actionName: 'delete-cardio',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData
            return oldData.filter((item: any) => item.id !== variables.id)
        }
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.CARDIO,
        actionName: 'duplicate-cardio'
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.cardio.all(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'assign-cardio',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData;
            return oldData.map((item: any) => {
                if (item.id === variables.cardioId) {
                    const newAssignments = variables.daysOfWeek.map((day: number) => ({
                        day_of_week: day,
                        student_id: variables.studentId
                    }))
                    if (mode === 'trainer') {
                        return { ...item, assignments: newAssignments }
                    }
                    return { ...item, assigned_cardios: newAssignments }
                }
                return item;
            })
        }
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.CARDIO,
        actionName: 'update-cardio'
    })

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.cardio.library(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'create-cardio'
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data) return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id, userId })
                break
            case 'confirm_duplicate':
                duplicateMutation({ id: actionModal.data.id, userId })
                break
            case 'assign_cardio':
                if (data?.selectedDays && Array.isArray(data.selectedDays)) {
                    assignMutation({
                        cardioId: actionModal.data.id,
                        studentId: mode === 'trainer' ? data.student_id : userId,
                        daysOfWeek: data.selectedDays
                    })
                }
                break
            case 'edit_cardio':
                updateMutation({
                    id: actionModal.data.id,
                    name: data?.name || actionModal.data.name,
                    description: data?.description || actionModal.data?.description,
                    duration: data?.duration || actionModal.data.duration_minutes,
                    intensity: data?.intensity || actionModal.data.suggested_intensity,
                    userId
                })
                if (data?.selectedDays && data.selectedDays.length > 0) {
                    const targetStudentId = mode === 'trainer' ? data.student_id : userId
                    if (targetStudentId) {
                        assignMutation({
                            cardioId: actionModal.data.id,
                            studentId: targetStudentId,
                            daysOfWeek: data.selectedDays
                        })
                    }
                }
                break
            case 'create_cardio':
                if (data?.name) {
                    createMutation({
                        name: data.name,
                        description: data?.description,
                        duration: data.duration,
                        intensity: data.intensity,
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
            if (e.detail?.type === 'create_cardio') {
                openAction('create_cardio', {})
            }
        }
        window.addEventListener('open-cardio-action', handler)
        return () => window.removeEventListener('open-cardio-action', handler)
    }, [mode])

    const openAction = (type: RegistryActionType, data?: any) => {
        const selectedDays = (data.assigned_cardios || []).map((a: any) => a.day_of_week)
        setActionModal({
            isOpen: true,
            type,
            data: { ...data, selectedDays }
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))

    let emptyDescription = "Seu treinador ainda não atribuiu cardios para sua conta.";
    if (mode === 'trainer') emptyDescription = 'Crie seu primeiro modelo de cardio para começar a atribuir.';
    else if (mode === 'auto') emptyDescription = "Você ainda não possui protocolos de cardio cadastrados.";

    if (isEmpty || !cardios || cardios.length === 0) {
        return (
            <EmptyState
                icon={Activity}
                title="SEM CARDIOS"
                description={emptyDescription}
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {cardios.map((cardio, idx) => {
                    const daySet = new Set<number>()
                    const allAssignments = [
                        ...(cardio.assignments || []),
                        ...(cardio.assigned_cardios || [])
                    ]

                    allAssignments.forEach((a: any) => {
                        if (a.days_of_week && Array.isArray(a.days_of_week)) {
                            a.days_of_week.forEach((d: number) => daySet.add(d))
                        }
                        if (a.day_of_week !== null && a.day_of_week !== undefined) {
                            daySet.add(a.day_of_week)
                        }
                    })

                    const assignedDays = Array.from(daySet)
                        .sort((a, b) => a - b)
                        .map((d) => dayNamesShort[d % 7])

                    const assignedStudentsMap = new Map<string, AssignedStudentInfo>()
                    if (mode === 'trainer') {
                        allAssignments.forEach((a: any) => {
                            if (a.student_id || a.student) {
                                const sid = a.student_id || `pending-${a.id}`
                                if (!assignedStudentsMap.has(sid)) {
                                    assignedStudentsMap.set(sid, {
                                        id: sid,
                                        name: a.student?.full_name || 'Aluno',
                                        avatarUrl: a.student?.avatar_url,
                                        isPlaceholder: a.is_placeholder,
                                    })
                                }
                            }
                        })
                    }
                    const assignedStudents = mode === 'trainer' ? Array.from(assignedStudentsMap.values()) : undefined

                    return (
                        <ManagementCardPremium
                            key={cardio.id || idx}
                            title={cardio.name.toUpperCase()}
                            description={cardio?.description || (mode === 'trainer' ? 'Sem descriÃ§Ã£o disponÃ­vel.' : 'Protocolo oficial de cardio.')}
                            days={assignedDays}
                            assignedStudents={assignedStudents}
                            mainStat={{ label: 'MINUTOS', value: cardio.duration_minutes || 0 }}
                            date={cardio.created_at ? new Date(cardio.created_at).toLocaleDateString('pt-BR') : 'Data IndisponÃ­vel'}
                            icon={Activity}
                            mode={mode}
                            registryType="cardio"
                            onSchedule={mode === 'auto' ? () => openAction('assign_cardio', cardio) : undefined}
                            onEdit={() => openAction('edit_cardio', cardio)}
                            onDelete={mode !== 'personal' ? () => openAction('confirm_delete', cardio) : undefined}
                            onDuplicate={mode !== 'personal' ? () => openAction('confirm_duplicate', cardio) : undefined}
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
                students={students}
            />
        </>

    );
}

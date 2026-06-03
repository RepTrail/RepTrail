'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Dumbbell } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { WorkoutExercisesModal } from '@/components/store/advanced/workout-exercises-modal'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { AssignedStudentInfo } from '@/components/store/intermediary/assigned-student-mini-card'

interface WorkoutManagementSectionContentProps {
    userId?: string
    workouts?: any[]
    mode?: 'auto' | 'personal' | 'trainer'
    isEmpty?: boolean
    betaTesterMode?: boolean
}

/**
 * WorkoutManagementSectionContent: Grid of premium training cards using the unified component.
 * Faithful to Image 27.
 */
export function WorkoutManagementSectionContent({ 
    userId = 'mock-id',
    workouts,
    mode = 'auto',
    isEmpty = false,
    betaTesterMode = false
}: WorkoutManagementSectionContentProps) {
    const libraryQueryKey = QUERY_KEYS.workouts.library(userId)
    const assignedQueryKey = QUERY_KEYS.workouts.all(userId)
    const activeQueryKey = mode === 'auto' || mode === 'trainer' ? libraryQueryKey : assignedQueryKey
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_training'
    })
    const [viewModal, setViewModal] = React.useState<{ isOpen: boolean, workoutId: string | null, workoutName?: string }>({
        isOpen: false,
        workoutId: null
    })

    const router = useRouter()

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.WORKOUT,
        actionName: 'delete-workout',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData
            return oldData.filter((item: any) => item.id !== variables.id)
        }
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: ENTITIES.WORKOUT,
        actionName: 'duplicate-workout'
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.workouts.all(userId),
        entity: ENTITIES.WORKOUT,
        actionName: 'assign-workout',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData;
            return oldData.map((item: any) => {
                if (item.id === variables.workoutId) {
                    const newAssignment = {
                        day_of_week: variables.day,
                        student_id: variables.studentId
                    }
                    if (mode === 'trainer') {
                        return { ...item, assignments: [...(item.assignments || []), newAssignment] }
                    } else {
                        return { ...item, assigned_workouts: [...(item.assigned_workouts || []), newAssignment] }
                    }
                }
                return item;
            })
        }
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
            case 'assign_training':
                // RegistryActionModal returns the selected days
                if (Array.isArray(data)) {
                    data.forEach(day => {
                        assignMutation({ workoutId: actionModal.data.id, day, studentId: userId })
                    })
                }
                break
        }
        closeAction()
    }

    const openAction = (type: RegistryActionType, data?: any) => {
        // Map assigned days for the modal
        const selectedDays = (data.assigned_workouts || []).map((a: any) => a.day_of_week)
        setActionModal({ 
            isOpen: true, 
            type, 
            data: { ...data, selectedDays } 
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))
    
    const openView = (workout: any) => setViewModal({ isOpen: true, workoutId: workout.id, workoutName: workout.name })
    const closeView = () => setViewModal(prev => ({ ...prev, isOpen: false }))

    if (isEmpty || !workouts || workouts.length === 0) {
        return (
            <EmptyState 
                icon={Dumbbell}
                title="SEM TREINOS"
                description={
                    mode === 'trainer'
                        ? (betaTesterMode ? 'Crie um novo treino para começar.' : 'Importe um PDF ou crie um novo treino para começar.')
                        : mode === 'auto'
                            ? "Você ainda não possui protocolos de treino cadastrados."
                            : "Seu treinador ainda não atribuiu treinos para sua conta."
                }
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {workouts.map((workout, idx) => {
                    let exercisesCount = 0
                    if (workout.workout_exercises && Array.isArray(workout.workout_exercises)) {
                        if (workout.workout_exercises.length > 0 && typeof workout.workout_exercises[0].count === 'number') {
                            exercisesCount = workout.workout_exercises[0].count
                        } else {
                            exercisesCount = workout.workout_exercises.length
                        }
                    }

                    const daySet = new Set<number>()
                    const allAssignments = [
                        ...(workout.assignments || []),
                        ...(workout.assigned_workouts || [])
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

                    const editPath = mode === 'trainer'
                        ? `/dashboard/trainer/workouts/${workout.id}`
                        : `/dashboard/student/workouts/${workout.id}`

                    return (
                        <ManagementCardPremium
                            key={workout.id || idx}
                            title={workout.name.toUpperCase()}
                            description={workout.description || (mode === 'trainer' ? 'Sem descrição disponível.' : 'Ficha oficial de treinamento.')}
                            days={assignedDays}
                            assignedStudents={assignedStudents}
                            mainStat={{ label: 'EXERCÍCIOS', value: exercisesCount }}
                            date={workout.created_at ? new Date(workout.created_at).toLocaleDateString('pt-BR') : 'Data Indisponível'}
                            icon={Dumbbell}
                            mode={mode}
                            registryType="training"
                            onView={mode === 'personal' ? () => openView(workout) : undefined}
                            onSchedule={mode === 'auto' ? () => openAction('assign_training', workout) : undefined}
                            onEdit={() => router.push(editPath)}
                            onDelete={mode !== 'personal' ? () => openAction('confirm_delete', workout) : undefined}
                            onDuplicate={mode !== 'personal' ? () => openAction('confirm_duplicate', workout) : undefined}
                            onPlay={mode === 'auto' ? () => router.push(`/dashboard/student/workout/${workout.id}?force=true`) : undefined}
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
            <WorkoutExercisesModal 
                isOpen={viewModal.isOpen}
                onClose={closeView}
                workoutId={viewModal.workoutId}
                workoutName={viewModal.workoutName}
            />
        </>
    );
}

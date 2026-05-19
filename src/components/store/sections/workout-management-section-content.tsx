'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Maximize2, Dumbbell } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { WorkoutExercisesModal } from '@/components/store/advanced/workout-exercises-modal'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { deleteWorkout, duplicateWorkout, assignWorkout } from '@/actions/workout-actions'

interface WorkoutManagementSectionContentProps {
    userId?: string
    workouts?: any[]
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * WorkoutManagementSectionContent: Grid of premium training cards using the unified component.
 * Faithful to Image 27.
 */
export function WorkoutManagementSectionContent({ 
    userId = 'mock-id',
    workouts,
    mode = 'auto',
    isEmpty = false
}: WorkoutManagementSectionContentProps) {
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
        queryKey: mode === 'auto' ? QUERY_KEYS.workouts.library(userId) : QUERY_KEYS.workouts.all(userId),
        entity: ENTITIES.WORKOUT,
        actionName: 'delete-workout',
        mutationFn: async ({ id }: { id: string }) => {
            const res = await deleteWorkout(id)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.workouts.library(userId) : QUERY_KEYS.workouts.all(userId),
        entity: ENTITIES.WORKOUT,
        actionName: 'duplicate-workout',
        mutationFn: async ({ id }: { id: string }) => {
            const res = await duplicateWorkout(id)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.workouts.all(userId),
        entity: ENTITIES.WORKOUT,
        actionName: 'assign-workout',
        mutationFn: async ({ workoutId, day, studentId }: { workoutId: string, day: number, studentId: string }) => {
            const res = await assignWorkout(workoutId, studentId, day)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data) return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id })
                break
            case 'confirm_duplicate':
                duplicateMutation({ id: actionModal.data.id })
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
                description={mode === 'auto' ? "Você ainda não possui protocolos de treino cadastrados." : "Seu treinador ainda não atribuiu treinos para sua conta."}
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

                    const assignedDays = (workout.assigned_workouts || [])
                        .filter((a: any) => a.day_of_week !== null && a.day_of_week !== undefined)
                        .map((a: any) => dayNamesShort[a.day_of_week % 7])
                    
                    return (
                        <ManagementCardPremium 
                            key={workout.id || idx}
                            title={workout.name.toUpperCase()}
                            description={workout.description || 'Ficha oficial de treinamento.'}
                            days={assignedDays}
                            mainStat={{ label: 'EXERCÍCIOS', value: exercisesCount }}
                            date={new Date(workout.created_at).toLocaleDateString('pt-BR')}
                            icon={Dumbbell}
                            mode={mode}
                            color={STORE_TOKENS.COLORS.BRAND as any}
                            registryType="training"
                            onView={() => openView(workout)}
                            onSchedule={() => openAction('assign_training', workout)}
                            onEdit={() => router.push(`/dashboard/student/workouts/${workout.id}`)}
                            onDelete={() => openAction('confirm_delete', workout)}
                            onDuplicate={() => openAction('confirm_duplicate', workout)}
                            onPlay={() => router.push(`/dashboard/student/workout/${workout.id}?force=true`)}
                        />
                    )
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
    )
}

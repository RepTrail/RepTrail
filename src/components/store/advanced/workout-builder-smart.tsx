'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
import { useOptimisticMutation } from '@/lib/dal'
import { getWorkoutDetails, searchExercises } from '@/lib/dal/remote'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Loader2, ArrowLeft, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/store/intermediary/empty-state'

import { WorkoutBuilderHeader } from './workout-builder-header'
import { WorkoutBuilderExerciseCard } from './workout-builder-exercise-card'
import { WorkoutBuilderSearch } from './workout-builder-search'

interface WorkoutBuilderSmartProps {
    workout: any
    students?: any[]
    backHref?: string
    canAssign?: boolean
    showAssignmentBadge?: boolean
    hideHeader?: boolean
    contextLabel?: string
    icon?: string
    contextColor?: string
}

export function WorkoutBuilderSmart({
    workout: initialWorkout,
    students = [],
    backHref = '/dashboard/trainer/workouts',
    canAssign = true,
    showAssignmentBadge = true,
    hideHeader = false,
    contextLabel,
    icon,
    contextColor
}: WorkoutBuilderSmartProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.workouts.detail(initialWorkout.id)

    const { data: workoutData } = useQuery({
        queryKey,
        queryFn: () => getWorkoutDetails(initialWorkout.id),
        initialData: initialWorkout,
    })

    const workout = workoutData as any | null
    const exercises = workout?.workout_exercises || []

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)

    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [editName, setEditName] = useState(workout?.name || '')
    const [editDesc, setEditDesc] = useState(workout?.description || '')

    useEffect(() => {
        if (!isEditingMeta && workout) {
            setEditName(workout.name)
            setEditDesc(workout?.description || '')
        }
    }, [workout?.name, workout?.description, isEditingMeta])

    // MUTATIONS
    const { mutate: reorderMutate } = useOptimisticMutation({
        actionName: 'update-workout-exercises-order',
        entity: ENTITIES.WORKOUT,
        entityId: workout?.id || '',
        queryKey,
        mutationFn: async (variables: { orderedIds: string[] }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => {
                const exs = [...(old?.workout_exercises || [])]
                const sorted = variables.orderedIds.map(id => exs.find(ex => ex.id === id)).filter(Boolean)
                return { ...old, workout_exercises: sorted }
            })
            return { previous }
        }
    })

    const { mutate: mutateMeta } = useOptimisticMutation({
        actionName: 'update-workout-meta',
        entity: ENTITIES.WORKOUT,
        entityId: workout?.id || '',
        queryKey,
        mutationFn: async (variables: { id: string, name: string, description: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({ ...old, ...variables }))
            return { previous }
        },
        onSuccess: () => setIsEditingMeta(false)
    })

    const { mutate: addExerciseMutate } = useOptimisticMutation({
        actionName: 'add-exercise-to-workout',
        entity: ENTITIES.WORKOUT,
        entityId: workout?.id || '',
        queryKey,
        mutationFn: async (variables: { exerciseId: string, workoutId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            const exerciseToAdd = searchResults.find(ex => ex.id === variables.exerciseId)
            if (exerciseToAdd) {
                queryClient.setQueryData(queryKey, (old: any) => ({
                    ...old,
                    workout_exercises: [...(old?.workout_exercises || []), {
                        id: `temp-${Date.now()}`,
                        workout_id: workout?.id || '',
                        exercise_id: variables.exerciseId,
                        exercise: exerciseToAdd,
                        warmup_sets: 0, warmup_reps: '15', warmup_rest_seconds: 60,
                        feeder_sets: 0, feeder_reps: '10', feeder_rest_seconds: 60,
                        working_sets: 3, reps: '10-12', rest_seconds: 90,
                        notes: ''
                    }]
                }))
            }
            return { previous }
        },
        onSuccess: () => {
            setSearchQuery('')
            setSearchResults([])
        }
    })

    const { mutate: addCustomMutate } = useOptimisticMutation({
        actionName: 'create-new-exercise',
        entity: ENTITIES.WORKOUT,
        entityId: workout?.id || '',
        queryKey,
        mutationFn: async (variables: { name: string }) => variables,
        onSuccess: () => {
            setSearchQuery('')
            setSearchResults([])
            toast({ title: "ExercÃ­cio criado", description: "O exercÃ­cio serÃ¡ adicionado ao treino apÃ³s o processamento." })
        }
    })

    const { mutate: removeMutate } = useOptimisticMutation({
        actionName: 'remove-exercise-from-workout',
        entity: ENTITIES.WORKOUT_EXERCISE,
        entityId: 'remove',
        queryKey,
        mutationFn: async (variables: { id: string, workoutId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                workout_exercises: (old?.workout_exercises || []).filter((ex: any) => ex.id !== variables.id)
            }))
            return { previous }
        }
    })

    const { mutate: updateMutate } = useOptimisticMutation({
        actionName: 'update-workout-exercise',
        entity: ENTITIES.WORKOUT_EXERCISE,
        entityId: 'update',
        queryKey,
        mutationFn: async (variables: { id: string, data: any, workoutId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                workout_exercises: (old?.workout_exercises || []).map((ex: any) =>
                    ex.id === variables.id ? { ...ex, ...variables.data } : ex
                )
            }))
            return { previous }
        }
    })

    if (!workout) {
        return (
            <Box display="flex" direction="col" align="center" justify="center" minHeight="lg" gap={STORE_TOKENS.SPACING.SECTION}>
                <Icon icon={Loader2} size="lg" color={STORE_TOKENS.COLORS.SUCCESS} spin />
                <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="heading"
                        uppercase
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>Sincronizando Dados...</Font>
                    <Font
                        variant="description"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>Preparando sua biblioteca de exercÃ­cios</Font>
                </Stack>
            </Box>
        );
    }

    // HANDLERS
    function handleDragStart(e: React.DragEvent, id: string) {
        setDraggedId(id)
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    }

    function handleDragOver(e: React.DragEvent, targetId: string) {
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
        if (!draggedId || draggedId === targetId) return

        const draggedIndex = exercises.findIndex((ex: any) => ex.id === draggedId)
        const targetIndex = exercises.findIndex((ex: any) => ex.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return

        const newOrder = [...exercises]
        const [removed] = newOrder.splice(draggedIndex, 1)
        newOrder.splice(targetIndex, 0, removed)

        queryClient.setQueryData(queryKey, (old: any) => ({ ...old, workout_exercises: newOrder }))
    }

    function handleDragEnd() {
        if (!draggedId || !workout) return
        setDraggedId(null)
        reorderMutate({
            orderedIds: exercises.map((ex: any) => ex.id),
            workoutId: workout.id
        })
    }

    async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value
        setSearchQuery(query)
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        const results = await searchExercises(query)
        setSearchResults(results)
        setIsSearching(false)
    }

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.SECTION, md: STORE_TOKENS.SPACING.SECTION }}>
            {!hideHeader && (
                <WorkoutBuilderHeader
                    workoutId={workout.id}
                    name={workout.name}
                    description={workout?.description}
                    isEditing={isEditingMeta}
                    setIsEditing={setIsEditingMeta}
                    editName={editName}
                    setEditName={setEditName}
                    editDesc={editDesc}
                    setEditDesc={setEditDesc}
                    onSave={() => mutateMeta({ id: workout.id, name: editName, description: editDesc })}
                    onCancel={() => {
                        setEditName(workout.name)
                        setEditDesc(workout?.description || '')
                        setIsEditingMeta(false)
                    }}
                    showAssignmentBadge={showAssignmentBadge}
                    canAssign={canAssign}
                    assignments={workout.assignments}
                    students={students}
                    contextLabel={contextLabel}
                    icon={icon}
                    contextColor={contextColor}
                />
            )}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'center' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="heading"
                        uppercase
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        ExercÃ­cios no Treino
                    </Font>
                    <Badge
                        label={`NÃºmero de exercÃ­cios: ${exercises.length}`}
                        variant="glass"
                        color={contextColor as any || STORE_TOKENS.COLORS.BRAND}
                        size="sm"
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    />
                </Stack>

                {exercises.length > 0 ? (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {exercises.map((item: any) => (
                            <WorkoutBuilderExerciseCard
                                key={item.id}
                                item={item}
                                isDragged={draggedId === item.id}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onRemove={(id) => removeMutate({ id, workoutId: workout.id })}
                                onUpdate={(id, data) => updateMutate({ id, data, workoutId: workout.id })}
                            />
                        ))}
                    </Stack>
                ) : (
                    <EmptyState
                        icon={Dumbbell}
                        title="NENHUM EXERCÃCIO ADICIONADO"
                        description="Use a busca abaixo para comeÃ§ar."
                    />
                )}
            </Stack>
            <WorkoutBuilderSearch
                searchQuery={searchQuery}
                isSearching={isSearching}
                searchResults={searchResults}
                onSearch={handleSearch}
                onAddExercise={(ex) => addExerciseMutate({ exerciseId: ex.id, workoutId: workout.id })}
                onAddCustom={() => addCustomMutate({ name: searchQuery })}
            />
            <Box display="flex" justify="center">
                <Button
                    asChild
                    variant="outline-zinc"
                    fullWidth={{ base: true, sm: false }}
                    paddingY={STORE_TOKENS.SPACING.ELEMENT}
                    paddingX={STORE_TOKENS.SPACING.CONTAINER}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    <Link href={backHref}>
                        <Icon icon={ArrowLeft} size="xs" />
                        Voltar para a Biblioteca de Treinos
                    </Link>
                </Button>
            </Box>
        </Stack>
    );
}

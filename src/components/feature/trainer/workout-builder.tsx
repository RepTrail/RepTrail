'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus,
    PlusCircle,
    Trash2,
    GripVertical,
    Save,
    Loader2,
    Pencil,
    Check,
    X,
    Calendar,
    ArrowLeft
} from "lucide-react"
import { UnifiedAssignDialog } from "@/components/feature/shared/unified-assign-dialog"
import {
    getWorkoutDetails,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateWorkoutExercise,
    searchExercises,
    createNewExercise,
    updateWorkoutMeta,
    updateWorkoutExercisesOrder
} from "@/actions/workout-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from "@/lib/query-keys"
import { ENTITIES } from '@/lib/outbox-db'

interface Exercise {
    id: string
    name: string
}

interface Workout {
    id: string
    name: string
    description: string
    assignments?: any[]
}

interface WorkoutExercise {
    id: string
    workout_id: string
    exercise_id: string
    order_index: number
    warmup_sets: number
    warmup_reps: string
    warmup_rest_seconds: number
    feeder_sets: number
    feeder_reps: string
    feeder_rest_seconds: number
    working_sets: number
    reps: string
    rest_seconds: number
    notes: string
    exercise: Exercise
}

interface WorkoutBuilderProps {
    workout: Workout & { workout_exercises: WorkoutExercise[] }
    students?: any[]
    backHref?: string
    canAssign?: boolean
    showAssignmentBadge?: boolean
}

export function WorkoutBuilder({ workout: initialWorkout, students = [], backHref = '/dashboard/trainer/workouts', canAssign = true, showAssignmentBadge = true }: WorkoutBuilderProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.workouts.detail(initialWorkout.id)

    // 0ms Source of Truth: Read directly from cache
    const { data: workoutData } = useQuery({
        queryKey,
        queryFn: () => getWorkoutDetails(initialWorkout.id),
        initialData: initialWorkout,
        staleTime: 1000 * 60 * 5
    })

    const workout = workoutData as Workout & { workout_exercises: WorkoutExercise[] }
    const exercises = workout.workout_exercises || []

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Exercise[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)

    // Inline name/description editing state
    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [editName, setEditName] = useState(workout.name)
    const [editDesc, setEditDesc] = useState(workout.description || '')
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditingMeta) nameInputRef.current?.focus()
    }, [isEditingMeta])

    // --- MUTATIONS (HARDENED LOCAL-FIRST) ---

    const { mutate: reorderMutate } = useOptimisticMutation({
        actionName: 'update-workout-exercises-order',
        entity: ENTITIES.WORKOUT,
        entityId: workout.id,
        queryKey,
        mutationFn: async (variables: { orderedIds: string[] }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => {
                const exercises = [...(old?.workout_exercises || [])]
                const sorted = variables.orderedIds.map(id => exercises.find(ex => ex.id === id)).filter(Boolean)
                return { ...old, workout_exercises: sorted }
            })
            return { previous }
        }
    })

    const { mutate: mutateMeta } = useOptimisticMutation({
        actionName: 'update-workout-meta',
        entity: ENTITIES.WORKOUT,
        entityId: workout.id,
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
        entityId: workout.id,
        queryKey,
        mutationFn: async (variables: { exerciseId: string, workoutId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            // Note: We don't have the full exercise object here easily for the optimistic update 
            // unless we find it in searchResults. For simplicity, we just trigger the sync.
            // Better: find in searchResults
            const exerciseToAdd = searchResults.find(ex => ex.id === variables.exerciseId)
            if (exerciseToAdd) {
                queryClient.setQueryData(queryKey, (old: any) => ({
                    ...old,
                    workout_exercises: [...(old?.workout_exercises || []), {
                        id: `temp-${Date.now()}`,
                        workout_id: workout.id,
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
        entityId: workout.id,
        queryKey,
        mutationFn: async (variables: { name: string }) => variables,
        onSuccess: () => {
            setSearchQuery('')
            setSearchResults([])
            toast({ title: "Exercício criado", description: "O exercício será adicionado ao treino após o processamento." })
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

    // --- HANDLERS ---

    function handleDragStart(e: React.DragEvent, id: string) {
        setDraggedId(id)
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    }

    function handleDragOver(e: React.DragEvent, targetId: string) {
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
        if (!draggedId || draggedId === targetId) return

        // Local UI reorder (before mutation)
        const draggedIndex = exercises.findIndex(ex => ex.id === draggedId)
        const targetIndex = exercises.findIndex(ex => ex.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return

        const newOrder = [...exercises]
        const [removed] = newOrder.splice(draggedIndex, 1)
        newOrder.splice(targetIndex, 0, removed)

        // Optimistically update the list in cache directly for 0ms feel
        queryClient.setQueryData(queryKey, (old: any) => ({ ...old, workout_exercises: newOrder }))
    }

    function handleDragEnd() {
        if (!draggedId) return
        setDraggedId(null)
        reorderMutate({ orderedIds: exercises.map(ex => ex.id) })
    }

    function handleSaveMeta() {
        if (!editName.trim()) return
        mutateMeta({ id: workout.id, name: editName, description: editDesc })
    }

    function handleCancelMeta() {
        setEditName(workout.name)
        setEditDesc(workout.description || '')
        setIsEditingMeta(false)
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

    function handleAddExercise(ex: Exercise) {
        addExerciseMutate({ exerciseId: ex.id, workoutId: workout.id })
    }

    function handleAddCustom() {
        if (!searchQuery) return
        addCustomMutate({ name: searchQuery })
    }

    function handleRemove(id: string) {
        if (!confirm('Remover este exercício do treino?')) return
        removeMutate({ id, workoutId: workout.id })
    }

    function handleUpdate(id: string, data: any) {
        updateMutate({ id, data, workoutId: workout.id })
    }

    return (
        <div className="space-y-8">
            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex flex-col flex-1 text-left">
                    {isEditingMeta ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-zinc-900/60 border border-zinc-700/60 rounded-2xl p-5 space-y-3 shadow-xl max-w-xl mx-auto sm:mx-0">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome do Treino</label>
                                <Input
                                    ref={nameInputRef}
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSaveMeta(); if (e.key === 'Escape') handleCancelMeta() }}
                                    className="bg-zinc-950 border-zinc-700 text-white text-lg font-black h-12 rounded-xl focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                                    placeholder="Nome do treino..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descrição (opcional)</label>
                                <Input
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Escape') handleCancelMeta() }}
                                    className="bg-zinc-950 border-zinc-700 text-zinc-300 h-10 rounded-xl focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                                    placeholder="Qual é o foco desse treino?"
                                />
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                                <Button
                                    onClick={handleSaveMeta}
                                    className="h-9  bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all active:scale-95"
                                >
                                    <Check className="w-3 h-3 mr-1.5" />Salvar
                                </Button>
                                <Button
                                    onClick={handleCancelMeta}
                                    variant="ghost"
                                    className="h-9  bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600"
                                >
                                    <X className="w-3 h-3 mr-1.5" />Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="group flex items-start justify-start gap-4 cursor-pointer w-fit"
                            onClick={() => setIsEditingMeta(true)}
                        >
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-white font-sans group-hover:text-blue-400 transition-colors duration-200 border-b border-transparent group-hover:border-blue-400/40 pb-0.5 whitespace-nowrap">
                                    {editName}
                                </h1>
                                <p className="text-zinc-500 mt-1 group-hover:text-zinc-400 transition-colors">
                                    {editDesc || 'Builder de Treino'}
                                </p>

                                {showAssignmentBadge && (
                                    <>
                                        {workout.assignments && workout.assignments.length > 0 ? (
                                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl sm:rounded-2xl w-fit animate-in fade-in slide-in-from-left-4 duration-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-orange-500">
                                                    Atribuído para: <span className="text-white italic ml-1">{workout.assignments[0]?.student?.full_name || 'Aluno'}</span>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 mt-4 bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl w-fit">
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Template de Biblioteca</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <button
                                className="p-2 rounded-xl text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-blue-400/20 active:scale-90"
                                title="Editar nome do treino"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="shrink-0 flex justify-center">
                    {canAssign && (
                        <UnifiedAssignDialog
                            itemId={workout.id}
                            students={students}
                            type="workout"
                            title="Atribuir Treino"
                            description="Escolha um aluno e os dias da semana para este protocolo."
                            colorScheme="orange"
                            initialStudentId={workout.assignments?.[0]?.student_id}
                            initialDays={workout.assignments?.[0]?.day_of_week !== undefined ? [workout.assignments?.[0]?.day_of_week] : []}
                            trigger={
                                <Button className="h-[58px] px-8 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-none flex flex-row items-center justify-start gap-3 group transition-all active:scale-95 italic w-full">
                                    <Calendar className="w-5 h-5 text-center" />
                                    <span className="text-center whitespace-normal leading-tight">{workout.assignments?.length ? "Gerenciar Atribuição" : "Atribuir"}</span>
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        Exercícios no Treino
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">
                            {exercises.length}
                        </span>
                    </h2>
                </div>

                {exercises.length > 0 ? (
                    exercises.map((item: any) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDragEnd={handleDragEnd}
                            className={`transition-all duration-200 ${draggedId === item.id ? 'opacity-40 scale-[0.98]' : ''}`}
                        >
                            <Card className="bg-zinc-950 border-zinc-800 relative group/card">
                                <CardContent className="p-0">
                                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3 pb-4">
                                            <GripVertical className="text-zinc-600 cursor-move" />
                                            <span className="font-semibold text-zinc-100">{item.exercise.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(item.id)}
                                            className="text-zinc-500 hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="p-6 flex flex-col gap-6">
                                        {/* SET GROUPS */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* WARMUP */}
                                            <div className="space-y-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/50 transition-colors">
                                                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                                                    <Label className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold">Aquecimento</Label>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Séries</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.warmup_sets}
                                                            onBlur={(e) => handleUpdate(item.id, { warmup_sets: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Reps</span>
                                                        <Input
                                                            defaultValue={item.warmup_reps}
                                                            onBlur={(e) => handleUpdate(item.id, { warmup_reps: e.target.value })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm"
                                                            placeholder="Reps"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Desc (s)</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.warmup_rest_seconds}
                                                            onBlur={(e) => handleUpdate(item.id, { warmup_rest_seconds: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FEEDER */}
                                            <div className="space-y-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/50 transition-colors">
                                                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                                                    <Label className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold">Preparação (Feeder)</Label>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Séries</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.feeder_sets}
                                                            onBlur={(e) => handleUpdate(item.id, { feeder_sets: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Reps</span>
                                                        <Input
                                                            defaultValue={item.feeder_reps}
                                                            onBlur={(e) => handleUpdate(item.id, { feeder_reps: e.target.value })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm"
                                                            placeholder="Reps"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-medium">Desc (s)</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.feeder_rest_seconds}
                                                            onBlur={(e) => handleUpdate(item.id, { feeder_rest_seconds: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-950 border-zinc-800 text-white h-9 text-center text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* WORKING */}
                                            <div className="space-y-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 ring-1 ring-blue-500/10">
                                                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                                                    <Label className="text-[11px] text-blue-400 uppercase tracking-widest font-bold">Séries Validadas</Label>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-blue-500/50 uppercase font-medium">Séries</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.working_sets}
                                                            onBlur={(e) => handleUpdate(item.id, { working_sets: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-900 border-zinc-700 text-white h-9 text-center text-sm font-bold shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-blue-500/50 uppercase font-medium">Reps</span>
                                                        <Input
                                                            defaultValue={item.reps}
                                                            onBlur={(e) => handleUpdate(item.id, { reps: e.target.value })}
                                                            className="bg-zinc-900 border-zinc-700 text-white h-9 text-center text-sm shadow-sm"
                                                            placeholder="Reps"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] text-blue-500/50 uppercase font-medium">Desc (s)</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={item.rest_seconds}
                                                            onBlur={(e) => handleUpdate(item.id, { rest_seconds: parseInt(e.target.value) || 0 })}
                                                            className="bg-zinc-900 border-zinc-700 text-white h-9 text-center text-sm font-semibold shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* NOTES SECTION */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center justify-between bg-zinc-900/50 px-3 py-1.5 rounded-t-lg border-x border-t border-zinc-800">
                                                <Label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Orientações e Observações Técnicas</Label>
                                                <span className="text-[9px] text-zinc-600 italic">Salva automaticamente ao sair do campo</span>
                                            </div>
                                            <Textarea
                                                defaultValue={item.notes}
                                                onBlur={(e) => handleUpdate(item.id, { notes: e.target.value })}
                                                placeholder="Ex: Focar na contração lenta, 2s de isometria no pico..."
                                                className="bg-zinc-950 border-zinc-800 text-zinc-300 text-sm min-h-[100px] rounded-t-none focus:ring-1 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                        <p className="text-zinc-500">Nenhum exercício adicionado. Use a busca abaixo.</p>
                    </div>
                )}
            </div>

            {/* Selector */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-500" /> Adicionar Exercício
                </h3>
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <Input
                        placeholder="Busque por exercícios (ex: Supino, Agachamento...)"
                        className="pl-10 bg-zinc-950 border-zinc-800 h-12 text-zinc-100"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                {searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
                        {searchResults.map((ex) => (
                            <Button
                                key={ex.id}
                                variant="outline"
                                onClick={() => handleAddExercise(ex)}
                                className="justify-start bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 h-auto py-3  text-zinc-300"
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-semibold text-white">{ex.name}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Biblioteca</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm text-zinc-400 truncate">
                                "<span className="text-white font-bold">{searchQuery}</span>" não encontrado na biblioteca.
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddCustom}
                            className="shrink-0 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 font-bold uppercase tracking-wide text-[10px] whitespace-nowrap"
                        >
                            <Plus className="w-3 h-3 mr-1.5" />
                            Criar Novo Exercício
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                <Button
                    asChild
                    variant="ghost"
                    className="w-full sm:w-auto text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-auto py-4 rounded-xl transition-all whitespace-normal text-center"
                >
                    <Link href={backHref} className="flex flex-col sm:flex-row items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="max-w-[100%] sm:max-w-none">
                            <span className="hidden sm:inline">Voltar para a Biblioteca de Treinos</span>
                            <span className="inline sm:hidden">Voltar para a<br />Biblioteca de Treinos</span>
                        </span>
                    </Link>
                </Button>
            </div>
        </div>
    )
}

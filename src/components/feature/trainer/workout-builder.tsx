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
    Trash2,
    GripVertical,
    Search,
    Save,
    Loader2,
    ArrowLeft,
    Pencil,
    Check,
    X
} from "lucide-react"
import {
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateWorkoutExercise,
    searchExercises,
    createNewExercise,
    updateWorkoutMeta,
    updateWorkoutExercisesOrder
} from "@/actions/workout-actions"

interface Exercise {
    id: string
    name: string
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
    workout: {
        id: string
        name: string
        description: string
        exercises: WorkoutExercise[]
    }
    backHref?: string
}

export function WorkoutBuilder({ workout, backHref = '/dashboard/trainer/workouts' }: WorkoutBuilderProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Exercise[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    const [exercises, setExercises] = useState(workout.exercises)
    const [draggedId, setDraggedId] = useState<string | null>(null)

    useEffect(() => {
        setExercises(workout.exercises)
    }, [workout.exercises])

    function handleDragStart(e: React.DragEvent, id: string) {
        setDraggedId(id)
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    }

    function handleDragOver(e: React.DragEvent, targetId: string) {
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

        if (!draggedId || draggedId === targetId) return

        setExercises((prev) => {
            const draggedIndex = prev.findIndex(ex => ex.id === draggedId)
            const targetIndex = prev.findIndex(ex => ex.id === targetId)
            if (draggedIndex === -1 || targetIndex === -1) return prev

            const newOrder = [...prev]
            const [removed] = newOrder.splice(draggedIndex, 1)
            newOrder.splice(targetIndex, 0, removed)
            return newOrder
        })
    }

    async function handleDragEnd() {
        if (!draggedId) return
        const currentExercises = [...exercises]
        setDraggedId(null)
        setLoadingMap(prev => ({ ...prev, 'reorder': true }))

        const orderedIds = currentExercises.map(ex => ex.id)
        const res = await updateWorkoutExercisesOrder(workout.id, orderedIds)
        if (res?.error) {
            alert("Erro ao reordenar exercícios.")
            setExercises(workout.exercises)
        }
        setLoadingMap(prev => ({ ...prev, 'reorder': false }))
    }

    // Inline name/description editing
    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [editName, setEditName] = useState(workout.name)
    const [editDesc, setEditDesc] = useState(workout.description || '')
    const [isSavingMeta, setIsSavingMeta] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditingMeta) nameInputRef.current?.focus()
    }, [isEditingMeta])

    async function handleSaveMeta() {
        if (!editName.trim()) return
        setIsSavingMeta(true)
        const res = await updateWorkoutMeta(workout.id, editName, editDesc)
        setIsSavingMeta(false)
        if (res.success) {
            setIsEditingMeta(false)
        }
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

    async function handleAddExercise(ex: Exercise) {
        setLoadingMap(prev => ({ ...prev, [ex.id]: true }))
        const res = await addExerciseToWorkout(workout.id, ex.id)
        if (res.error) alert(res.error)
        setLoadingMap(prev => ({ ...prev, [ex.id]: false }))
        setSearchQuery('')
        setSearchResults([])
    }

    async function handleAddCustom() {
        if (!searchQuery) return
        setLoadingMap(prev => ({ ...prev, 'custom': true }))

        const res = await createNewExercise(searchQuery)
        if (res.success && res.exerciseId) {
            await addExerciseToWorkout(workout.id, res.exerciseId)
        } else {
            alert(res.error || "Erro ao criar exercício.")
        }

        setLoadingMap(prev => ({ ...prev, 'custom': false }))
        setSearchQuery('')
        setSearchResults([])
    }

    async function handleRemove(id: string) {
        if (!confirm('Remover este exercício do treino?')) return
        setLoadingMap(prev => ({ ...prev, [id]: true }))
        await removeExerciseFromWorkout(id, workout.id)
        setLoadingMap(prev => ({ ...prev, [id]: false }))
    }

    async function handleUpdate(id: string, data: any) {
        setLoadingMap(prev => ({ ...prev, [`save-${id}`]: true }))
        await updateWorkoutExercise(id, workout.id, data)
        setLoadingMap(prev => ({ ...prev, [`save-${id}`]: false }))
    }

    return (
        <div className="space-y-8">
            {/* Header / Meta */}
            <div className="flex flex-col gap-3">
                {isEditingMeta ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-zinc-900/60 border border-zinc-700/60 rounded-2xl p-5 space-y-3 shadow-xl">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome do Treino</label>
                            <Input
                                ref={nameInputRef}
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSaveMeta(); if (e.key === 'Escape') handleCancelMeta() }}
                                className="bg-zinc-950 border-zinc-700 text-white text-lg font-black h-12 rounded-xl focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                                placeholder="Nome do treino..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descrição (opcional)</label>
                            <Input
                                value={editDesc}
                                onChange={e => setEditDesc(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Escape') handleCancelMeta() }}
                                className="bg-zinc-950 border-zinc-700 text-zinc-300 h-10 rounded-xl focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                                placeholder="Qual é o foco desse treino?"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                onClick={handleSaveMeta}
                                disabled={isSavingMeta || !editName.trim()}
                                className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                {isSavingMeta ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1.5" />Salvar</>}
                            </Button>
                            <Button
                                onClick={handleCancelMeta}
                                disabled={isSavingMeta}
                                variant="ghost"
                                className="h-9 px-4 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600"
                            >
                                <X className="w-3 h-3 mr-1.5" />Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="group flex items-start gap-3 cursor-pointer"
                        onClick={() => setIsEditingMeta(true)}
                    >
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-white font-sans group-hover:text-blue-400 transition-colors duration-200 border-b border-transparent group-hover:border-blue-400/40 pb-0.5 inline-block">
                                {editName}
                            </h1>
                            <p className="text-zinc-500 mt-1 group-hover:text-zinc-400 transition-colors">
                                {editDesc || 'Builder de Treino'}
                            </p>
                        </div>
                        <button
                            className="mt-1 p-2 rounded-xl text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-400/20 active:scale-90"
                            title="Editar nome do treino"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        Exercícios no Treino
                        {loadingMap['reorder'] && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">
                            {exercises.length}
                        </span>
                    </h2>
                </div>

                {exercises.length > 0 ? (
                    exercises.map((item) => (
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
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="text-zinc-600 cursor-move" />
                                            <span className="font-semibold text-zinc-100">{item.exercise.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(item.id)}
                                            disabled={loadingMap[item.id]}
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
                                            <div className="space-y-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/10">
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
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between bg-zinc-900/50 px-3 py-1.5 rounded-t-lg border-x border-t border-zinc-800">
                                                <Label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Orientações e Observações Técnicas</Label>
                                                {loadingMap[`save-${item.id}`] ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-zinc-600 animate-pulse italic">Salvando...</span>
                                                        <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] text-zinc-600">Autosave on focus loss</span>
                                                )}
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
                    <Plus className="w-5 h-5 text-blue-500" /> Adicionar Exercício
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
                                disabled={loadingMap[ex.id]}
                                className="justify-start bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 h-auto py-3 px-4 text-zinc-300"
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-semibold text-white">{ex.name}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Biblioteca</span>
                                </div>
                                {loadingMap[ex.id] && <Loader2 className="ml-auto w-4 h-4 animate-spin" />}
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
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                                Clique para criar um novo exercício com esse nome
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingMap['custom']}
                            onClick={handleAddCustom}
                            className="shrink-0 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/50 font-bold uppercase tracking-wide text-[10px] whitespace-nowrap"
                        >
                            {loadingMap['custom'] ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-3 h-3 mr-1.5" />
                                    Criar Novo Exercício
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                <Button
                    asChild
                    variant="ghost"
                    className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-12 rounded-xl transition-all"
                >
                    <Link href={backHref}>
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para a Biblioteca de Treinos
                    </Link>
                </Button>
            </div>
        </div>
    )
}

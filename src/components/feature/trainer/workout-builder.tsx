'use client'

import { useState } from 'react'
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
    Clock,
    Hash,
    Repeat,
    Save,
    Loader2,
    ArrowLeft
} from "lucide-react"
import {
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateWorkoutExercise,
    searchExercises,
    createNewExercise
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
}

export function WorkoutBuilder({ workout }: WorkoutBuilderProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Exercise[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

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
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white font-sans">{workout.name}</h1>
                <p className="text-zinc-500">{workout.description || "Builder de Treino"}</p>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        Exercícios no Treino
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs">
                            {workout.exercises.length}
                        </span>
                    </h2>
                </div>

                {workout.exercises.length > 0 ? (
                    workout.exercises.map((item) => (
                        <Card key={item.id} className="bg-zinc-950 border-zinc-800">
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
                    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                        <span className="text-sm text-zinc-400">"{searchQuery}" não encontrado na biblioteca.</span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingMap['custom']}
                            onClick={handleAddCustom}
                        >
                            Criar Novo: {searchQuery}
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
                    <Link href="/dashboard/trainer/workouts">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para a Biblioteca de Treinos
                    </Link>
                </Button>
            </div>
        </div>
    )
}

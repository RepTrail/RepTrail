'use client'

import { useState, useEffect } from 'react'
import { ExerciseLoadChart } from './exercise-load-chart'
import { getExerciseProgress } from '@/actions/log-actions'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Dumbbell, Search } from 'lucide-react'

interface Exercise {
    id: string
    name: string
}

interface ExerciseProgressSectionProps {
    studentId: string
    exercises: Exercise[]
}

export function ExerciseProgressSection({ studentId, exercises }: ExerciseProgressSectionProps) {
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
        exercises.length > 0 ? exercises[0].id : null
    )
    const [progressData, setProgressData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedExerciseId) {
            fetchProgress(selectedExerciseId)
        }
    }, [selectedExerciseId])

    const fetchProgress = async (exerciseId: string) => {
        setLoading(true)
        try {
            const data = await getExerciseProgress(studentId, exerciseId)
            setProgressData(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const selectedExerciseName = exercises.find(e => e.id === selectedExerciseId)?.name || ''

    if (exercises.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-5 rounded-[2rem] border border-zinc-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl">
                        <Search className="w-4 h-4 text-zinc-500" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">Analisar Exercício</p>
                </div>

                <Select value={selectedExerciseId || ''} onValueChange={setSelectedExerciseId}>
                    <SelectTrigger className="w-full sm:w-[280px] bg-zinc-950 border-zinc-800 rounded-2xl h-11 text-xs font-bold text-zinc-100 italic uppercase tracking-tight focus:ring-emerald-500/20">
                        <SelectValue placeholder="Selecione um exercício" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 rounded-2xl">
                        {exercises.map((ex) => (
                            <SelectItem
                                key={ex.id}
                                value={ex.id}
                                className="text-xs font-bold text-zinc-400 focus:bg-zinc-900 focus:text-white uppercase italic tracking-tight rounded-xl py-3"
                            >
                                {ex.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <ExerciseLoadChart
                    data={progressData}
                    exerciseName={selectedExerciseName}
                />
            </div>
        </div>
    )
}

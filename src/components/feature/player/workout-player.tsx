'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Play,
    Pause,
    CheckCircle,
    SkipForward,
    Timer,
    Activity,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Target,
    ChevronDown,
    ChevronUp,
    XCircle,
    Check
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { startWorkoutLog, recordSetLoad, finishWorkoutLog, saveWorkoutLogState, getWorkoutLastSession } from '@/actions/log-actions'
import { generateExecutionSteps, ExecutionStep, WorkoutPhase } from '@/lib/workout-flow-engine'

export function WorkoutPlayer({
    userId,
    workout,
    exercises,
    initialExerciseIndex = 0,
    initialLogId,
    initialSet,
    initialSetType,
    initialIsResting,
    initialRestEndTime
}: {
    userId: string,
    workout: any,
    exercises: any[],
    initialExerciseIndex?: number,
    initialLogId?: string,
    initialSet?: number,
    initialSetType?: 'WARMUP' | 'FEEDER' | 'WORKING',
    initialIsResting?: boolean,
    initialRestEndTime?: number
}) {
    const [lastSession, setLastSession] = useState<any>(null)
    const isMounted = useRef(false)

    // 1. Generate Linear Steps
    const steps = useMemo(() => generateExecutionSteps(exercises), [exercises])

    // 2. Find Initial Step for Resume
    const findInitialStepIndex = () => {
        if (!initialExerciseIndex && !initialSet && !initialSetType) return 0
        const idx = steps.findIndex(s =>
            s.exerciseIndex === initialExerciseIndex &&
            s.setNumber === initialSet &&
            s.phase === initialSetType
        )
        return idx !== -1 ? idx : 0
    }

    const [currentStepIndex, setCurrentStepIndex] = useState(findInitialStepIndex())
    const currentStep = steps[currentStepIndex] || steps[0]

    const [isResting, setIsResting] = useState(initialIsResting || false)
    const [restTimeLeft, setRestTimeLeft] = useState(initialRestEndTime ? Math.max(0, Math.ceil((initialRestEndTime - Date.now()) / 1000)) : 0)
    const [restEndTime, setRestEndTime] = useState<number | null>(initialRestEndTime || null)

    // Batch Input State
    const [setsLog, setSetsLog] = useState<Array<{
        id: string,
        workoutExerciseId: string,
        exerciseId: string,
        exerciseName: string,
        type: string,
        setNumber: number,
        label: string,
        expectedReps: string,
        subIndex?: number,
        groupId?: string
    }>>([])
    const [showSummary, setShowSummary] = useState(false)
    const [summaryInputs, setSummaryInputs] = useState<Record<number, { weight: string, reps: string }>>({})
    const [summaryActiveSubIndex, setSummaryActiveSubIndex] = useState<Record<string, number>>({})
    const [exerciseNote, setExerciseNote] = useState('')

    const [logId, setLogId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [perceivedEffort, setPerceivedEffort] = useState('7')
    const [adherenceStatus, setAdherenceStatus] = useState<'success' | 'partial' | 'fail'>('success')

    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()


    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getWorkoutLastSession(userId, workout.id)
            if (data) setLastSession(data)
        }
        fetchHistory()

        // Populate setsLog if resuming in the middle of a block
        if (initialLogId) {
            const startIdx = findInitialStepIndex()
            const currentGroup = steps[startIdx]?.groupId
            if (currentGroup) {
                const previousStepsInGroup = steps.slice(0, startIdx + (initialIsResting ? 1 : 0))
                    .filter(s => s.groupId === currentGroup)

                const reconstructedLog = previousStepsInGroup.map((s, idx) => {
                    const ex = exercises[s.exerciseIndex]
                    const sTypeLabel = ({
                        WARMUP: 'Aquecimento',
                        FEEDER: 'Feeder Set',
                        WORKING: 'Trabalho'
                    } as any)[s.phase]

                    let expectedReps = '10'
                    if (s.phase === 'WARMUP') expectedReps = ex.warmup_reps
                    else if (s.phase === 'FEEDER') expectedReps = ex.feeder_reps
                    else expectedReps = ex.reps

                    return {
                        id: `${ex.id}-${idx}-${Date.now()}`,
                        workoutExerciseId: ex.id,
                        exerciseId: ex.exercise_id || (ex as any).exercise?.id,
                        exerciseName: s.exerciseName,
                        type: s.phase,
                        setNumber: s.setNumber,
                        label: `${sTypeLabel} ${s.setNumber}`,
                        expectedReps: expectedReps || '0',
                        subIndex: s.subIndex,
                        groupId: s.groupId
                    }
                })
                setSetsLog(reconstructedLog)
            }
        }

        // Midnight check: if day changes, refresh everything
        const currentDay = new Date().toDateString()
        const interval = setInterval(() => {
            if (new Date().toDateString() !== currentDay) {
                console.log('Day changed! Resetting workout player...')
                window.location.reload()
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [userId, workout.id])

    const currentExercise = exercises[currentStep.exerciseIndex]
    const currentSet = currentStep.setNumber
    const setType = currentStep.phase

    // Simplified Progress & UI Helpers
    const totalWorkoutSets = steps.length
    const totalCompletedSets = isResting ? currentStepIndex + 1 : currentStepIndex
    const progress = totalWorkoutSets > 0 ? (totalCompletedSets / totalWorkoutSets) * 100 : 0

    const isBiSet = useMemo(() => {
        const currentGroupId = currentStep.groupId
        const groupSteps = steps.filter(s => s.groupId === currentGroupId)
        const uniqueNames = new Set(groupSteps.map(s => s.exerciseName))
        return uniqueNames.size > 1
    }, [currentStep.groupId, steps])

    const setTypeLabel = ({
        WARMUP: 'Aquecimento',
        FEEDER: 'Feeder Set',
        WORKING: 'Trabalho'
    } as any)[setType]

    // Reset state on step change
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }

        // Auto Save State when critical values change
        if (!logId) return

        const stateToSave = {
            exerciseIndex: currentStep.exerciseIndex,
            set: currentStep.setNumber,
            type: currentStep.phase,
            restEndTime: restEndTime,
            isResting: isResting
        }

        const timer = setTimeout(() => {
            saveWorkoutLogState(logId, stateToSave)
        }, 1000)

        return () => clearTimeout(timer)
    }, [currentStepIndex, isResting, restEndTime, logId])

    // Initialize Log
    useEffect(() => {
        const initLog = async () => {
            if (initialLogId) {
                setLogId(initialLogId)
                queryClient.invalidateQueries({ queryKey: ['active-workout-session'] })
                return
            }
            const result = await startWorkoutLog(workout.id)
            if (result.success) {
                setLogId(result.logId)
                queryClient.invalidateQueries({ queryKey: ['active-workout-session'] })
            } else {
                toast({ title: "Erro", description: "Falha ao iniciar log.", variant: "destructive" })
            }
        }
        initLog()
    }, [workout.id, initialLogId])

    // Rest Timer Logic

    useEffect(() => {
        if (!isResting || !restEndTime) return
        const interval = setInterval(() => {
            const now = Date.now()
            const secondsLeft = Math.ceil((restEndTime - now) / 1000)
            if (secondsLeft <= 0) {
                setRestTimeLeft(0)
                handleRestEnd()
            } else {
                setRestTimeLeft(secondsLeft)
            }
        }, 200)
        return () => clearInterval(interval)
    }, [isResting, restEndTime])

    const handleRestEnd = () => {
        setIsResting(false)
        setRestEndTime(null)

        if (currentStep.isLastInBlock) {
            advanceExercise()
            return
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        }

        if ("Notification" in window && Notification.permission === "granted") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification("Descanso Finalizado!", {
                        body: "Hora de voltar para a série.",
                        icon: '/icon.jpg',
                        badge: '/icon.jpg',
                        vibrate: [200, 100, 200],
                        tag: 'workout-rest'
                    } as any);
                });
            } else {
                new Notification("Descanso Finalizado!", { body: "Hora de voltar para a série." })
            }
        }
    }

    const advanceExercise = () => {
        // Clear log for next block
        setSetsLog([])
        setSummaryInputs({})
        setExerciseNote('')
        setShowSummary(false)

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    // Main Interaction Handler
    const handleSetAction = () => {
        // Record current set
        let expectedReps = '10'
        if (setType === 'WARMUP') expectedReps = currentExercise.warmup_reps
        else if (setType === 'FEEDER') expectedReps = currentExercise.feeder_reps
        else expectedReps = currentExercise.reps

        setSetsLog(prev => [...prev, {
            id: `${currentExercise.id}-${setsLog.length}-${Date.now()}`,
            workoutExerciseId: currentExercise.id,
            exerciseId: currentExercise.exercise_id || (currentExercise as any).exercise?.id,
            exerciseName: currentStep.exerciseName,
            type: setType,
            setNumber: currentSet,
            label: `${setTypeLabel} ${currentSet}`,
            expectedReps: expectedReps || '0',
            subIndex: currentStep.subIndex,
            groupId: currentStep.groupId
        }])

        // Intra-block logic (Rest or Switch)
        if (currentStep.isLastInBlock) {
            setShowSummary(true)
        } else if (currentStep.restSeconds > 0) {
            setRestTimeLeft(currentStep.restSeconds)
            setRestEndTime(Date.now() + currentStep.restSeconds * 1000)
            setIsResting(true)

            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission()
            }
        } else {
            setCurrentStepIndex(prev => prev + 1)
        }
    }

    const handleSaveExercise = async () => {
        // Validate that all sets have inputs (Mandatory Load Recording)
        for (let i = 0; i < setsLog.length; i++) {
            if (!summaryInputs[i]?.weight || !summaryInputs[i]?.reps) {
                toast({ variant: 'destructive', title: 'Dados Incompletos', description: 'Preencha carga e repetições de todas as séries.' })
                return
            }
        }

        if (logId) {
            setLoading(true)
            try {
                // Batch Save in parallel for better performance
                const savePromises = setsLog.map((set, i) => {
                    const input = summaryInputs[i]
                    // If it's a split exercise part, include the part name in the notes for clarity in history
                    const recordNotes = set.subIndex !== undefined && set.subIndex > 0 || (setsLog.some(s => s.groupId === set.groupId && s.subIndex !== undefined && s.subIndex > 0))
                        ? `[${set.exerciseName}] ${i === setsLog.length - 1 ? exerciseNote : ''}`
                        : (i === setsLog.length - 1 ? exerciseNote : '')

                    return recordSetLoad({
                        logId,
                        exerciseId: set.exerciseId,
                        weight: parseFloat(input.weight),
                        reps: parseInt(input.reps),
                        setType: set.type as any,
                        notes: recordNotes,
                        subIndex: set.subIndex,
                        groupId: set.groupId
                    })
                })

                const results = await Promise.all(savePromises)
                const failed = results.filter(r => !r.success)

                if (failed.length > 0) {
                    console.error('Failed to save some sets:', failed)
                }

                if (currentStep.restSeconds > 0 && currentStepIndex < steps.length - 1) {
                    setShowSummary(false)
                    setRestTimeLeft(currentStep.restSeconds)
                    setRestEndTime(Date.now() + currentStep.restSeconds * 1000)
                    setIsResting(true)
                } else {
                    advanceExercise()
                }
            } catch (error) {
                console.error('Error saving exercise sets:', error)
                toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Ocorreu um erro ao salvar os dados.' })
            } finally {
                setLoading(false)
            }
        }
    }

    const handleFinishWorkout = async () => {
        setLoading(true)
        try {
            if (logId) {
                const res = await finishWorkoutLog(logId, feedback, parseInt(perceivedEffort), adherenceStatus)
                if (res?.error) {
                    toast({ variant: 'destructive', title: 'Erro ao Finalizar', description: res.error })
                    setLoading(false)
                    return
                }
                queryClient.invalidateQueries({ queryKey: ['active-workout-session'] })
            }
            queryClient.invalidateQueries({ queryKey: ['today-workout'] })
            queryClient.invalidateQueries({ queryKey: ['workout-status'] })
            toast({ title: "MISSÃO CUMPRIDA!", description: "Treino registrado com sucesso." })
            router.refresh()
            router.push('/dashboard/student')
        } catch (error) {
            console.error('Error finishing workout:', error)
            toast({ variant: 'destructive', title: 'Erro ao Finalizar', description: 'Ocorreu um erro ao salvar seu treino.' })
        } finally {
            setLoading(false)
        }
    }

    const setTypeColor = ({
        WARMUP: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        FEEDER: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        WORKING: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    } as any)[setType]

    const getNextSetInfo = () => {
        if (currentStepIndex >= steps.length - 1) {
            return { label: 'Resumo do Exercício', set: 0, type: 'SUMMARY', color: 'text-white', isNewExercise: false, nextExerciseName: '' }
        }

        const next = steps[currentStepIndex + 1]
        const label = ({
            WARMUP: 'Aquecimento',
            FEEDER: 'Feeder Set',
            WORKING: 'Série de Trabalho'
        } as any)[next.phase]

        const color = ({
            WARMUP: 'text-orange-500',
            FEEDER: 'text-blue-500',
            WORKING: 'text-emerald-500'
        } as any)[next.phase]

        const isNewExercise = next.exerciseName !== currentStep.exerciseName

        return { label, set: next.setNumber, type: next.phase, color, isNewExercise, nextExerciseName: next.exerciseName }
    }

    const nextSet = getNextSetInfo()

    // Render Finished View
    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-lg mx-auto">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="relative p-6 bg-zinc-900 rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="h-12 w-12 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Treino Finalizado!</h2>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Como foi o seu desempenho hoje?</p>
                </div>
                <div className="w-full space-y-6 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-sm">
                    {/* Status Selection */}
                    <div className="space-y-3 text-left">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Como foi a execução?</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAdherenceStatus('success')}
                                className={cn(
                                    "h-12 rounded-xl border-zinc-800 text-[10px] font-black uppercase tracking-tighter",
                                    adherenceStatus === 'success' ? "bg-emerald-500 border-emerald-500 text-zinc-950" : "hover:bg-zinc-800 text-zinc-400"
                                )}
                            >
                                <CheckCircle className="w-3 h-3 mr-1" /> Sucesso
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAdherenceStatus('partial')}
                                className={cn(
                                    "h-12 rounded-xl border-zinc-800 text-[10px] font-black uppercase tracking-tighter",
                                    adherenceStatus === 'partial' ? "bg-amber-500 border-amber-500 text-zinc-950" : "hover:bg-zinc-800 text-zinc-400"
                                )}
                            >
                                <Activity className="w-3 h-3 mr-1" /> Parcial
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAdherenceStatus('fail')}
                                className={cn(
                                    "h-12 rounded-xl border-zinc-800 text-[10px] font-black uppercase tracking-tighter",
                                    adherenceStatus === 'fail' ? "bg-red-500 border-red-500 text-zinc-950" : "hover:bg-zinc-800 text-zinc-400"
                                )}
                            >
                                <XCircle className="w-3 h-3 mr-1" /> Falha
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 text-left">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Percepção de Esforço (1-10)</Label>
                        <Input type="number" min="1" max="10" value={perceivedEffort} onChange={(e) => setPerceivedEffort(e.target.value)} className="bg-zinc-950 border-zinc-800 text-white rounded-2xl h-14 text-xl font-black text-center" />
                    </div>
                    <div className="space-y-3 text-left">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Relato do Aluno</Label>
                        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Comentários sobre o treino..." className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-2xl p-4 text-sm font-medium min-h-[120px] outline-none" />
                    </div>
                </div>
                <Button onClick={handleFinishWorkout} disabled={loading} className="w-full h-auto min-h-[4rem] py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black italic uppercase tracking-tight rounded-2xl text-lg md:text-xl shadow-2xl active:scale-95 transition-all whitespace-normal leading-tight flex items-center justify-center gap-4">
                    {loading ? "Salvando..." : "Confirmar e Sair"}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Progress Bar */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Progresso Geral</p>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight leading-none">
                            {totalCompletedSets} <span className="text-zinc-700">/ {totalWorkoutSets}</span>
                        </h3>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-2 bg-zinc-900/50 rounded-full overflow-hidden border border-zinc-800/30">
                    <div className="h-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {showSummary ? (
                    // SUMMARY VIEW
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Resumo do Exercício</h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Preencha os dados das séries realizadas</p>
                            </div>

                            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(
                                    setsLog.reduce((acc, set, idx) => {
                                        // Group by groupId to keep bi-sets together in one card
                                        const groupId = set.groupId || 'none'
                                        if (!acc[groupId]) acc[groupId] = { items: [] }
                                        acc[groupId].items.push({ ...set, summaryIdx: idx })
                                        return acc
                                    }, {} as Record<string, { items: any[] }>)
                                ).map(([gId, group]) => {
                                    const uniqueExercises = Array.from(new Set(group.items.map(i => i.exerciseName)))
                                    const activeSubIndex = summaryActiveSubIndex[gId] || 0
                                    const activeExerciseName = uniqueExercises[activeSubIndex] || uniqueExercises[0]
                                    const filteredItems = group.items.filter(i => i.exerciseName === activeExerciseName)

                                    return (
                                        <div key={gId} className="space-y-6 bg-zinc-950/20 p-4 rounded-3xl border border-zinc-800/30">
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-3 pb-4">
                                                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                        <h4 className="text-lg font-black text-white uppercase italic tracking-tight">
                                                            {uniqueExercises.length > 1 ? "Exercício Conjugado" : activeExerciseName}
                                                        </h4>
                                                    </div>

                                                    {uniqueExercises.length > 1 && (
                                                        <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 gap-1">
                                                            {uniqueExercises.map((exName, idx) => (
                                                                <button
                                                                    key={exName}
                                                                    onClick={() => setSummaryActiveSubIndex(prev => ({ ...prev, [gId]: idx }))}
                                                                    className={cn(
                                                                        "flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                                                                        activeSubIndex === idx
                                                                            ? "bg-emerald-500 text-zinc-950 shadow-lg"
                                                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                                                                    )}
                                                                >
                                                                    {exName}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {filteredItems.map((set) => {
                                                        const exerciseHistory = lastSession?.loads?.filter((l: any) => l.exercise_id === set.exerciseId) || []
                                                        // Attempt to find history for this specific part if it was recorded with notes
                                                        const pHistory = exerciseHistory.filter((l: any) => l.notes?.includes(`[${set.exerciseName}]`))
                                                        const historyRef = pHistory.length > 0 ? pHistory : exerciseHistory
                                                        const lastSessionSet = historyRef[set.setNumber - 1]

                                                        return (
                                                            <SummarySetRow
                                                                key={set.summaryIdx}
                                                                set={set}
                                                                lastSessionSet={lastSessionSet}
                                                                initialWeight={summaryInputs[set.summaryIdx]?.weight || ''}
                                                                initialReps={summaryInputs[set.summaryIdx]?.reps || ''}
                                                                onUpdate={(weight: string, reps: string) =>
                                                                    setSummaryInputs(prev => ({ ...prev, [set.summaryIdx]: { weight, reps } }))
                                                                }
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Anotação Técnica</Label>
                                <textarea
                                    value={exerciseNote}
                                    onChange={(e) => setExerciseNote(e.target.value)}
                                    placeholder="Como foi o desempenho neste exercício?"
                                    className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-xs font-medium text-zinc-300 outline-none h-24 italic"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-auto min-h-[5rem] py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black italic uppercase tracking-tighter text-lg md:text-xl rounded-[2rem] shadow-2xl active:scale-95 transition-all whitespace-normal leading-tight flex items-center justify-center gap-4"
                            onClick={handleSaveExercise}
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Concluir Exercício"}
                            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                        </Button>
                    </div>
                ) : isResting ? (
                    // REST VIEW
                    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-10" />
                            <div className="relative w-48 h-48 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                                <Timer className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-zinc-700 bg-zinc-950 p-1.5 rounded-full border border-zinc-900" />
                                <span className="text-6xl font-black text-white italic tracking-tighter">
                                    {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                        <div className="text-center space-y-3 flex flex-col items-center">
                            <h4 className="text-lg font-black text-zinc-100 uppercase italic">Hora de Descansar</h4>
                            {nextSet && (
                                <div className="space-y-1 animate-pulse flex flex-col items-center w-full">
                                    {nextSet.isNewExercise && nextSet.nextExerciseName ? (
                                        <>
                                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Prepare-se para o próximo Exercício</p>
                                            <p className="text-2xl md:text-3xl font-black text-orange-500 uppercase italic tracking-tighter text-center max-w-[90vw] break-words">
                                                {nextSet.nextExerciseName}
                                            </p>
                                            <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl  py-2 text-center">
                                                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Primeira Série</p>
                                                <p className={`text-sm font-black uppercase italic tracking-tighter ${nextSet.color}`}>
                                                    {nextSet.label} {nextSet.type !== 'SUMMARY' && nextSet.set}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Próxima Série</p>
                                            <p className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter ${nextSet.color}`}>
                                                {nextSet.label} {nextSet.type !== 'SUMMARY' && nextSet.set}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleRestEnd}
                            className="bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-2xl h-12 px-8 font-black uppercase italic tracking-widest text-[10px] border border-zinc-800/50 transition-all"
                        >
                            <SkipForward className="w-4 h-4 mr-2" /> Pular Descanso
                        </Button>
                    </div>
                ) : (
                    // EXECUTION VIEW
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header + Info Card */}
                        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                            {/* Background Icon */}
                            <div className="absolute -right-10 -top-10 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 pointer-events-none">
                                <Play className="w-64 h-64 text-white" />
                            </div>

                            {/* Header */}
                            <div className="space-y-4 relative mb-8">
                                <div className="flex items-center gap-3 pb-4">
                                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md italic shadow-lg border-2 ${setTypeColor}`}>
                                        {setTypeLabel}
                                    </Badge>
                                    {isBiSet && (
                                        <Badge className="bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md italic shadow-lg border-transparent">
                                            Bi-Set / Conjugado
                                        </Badge>
                                    )}
                                    {setType === 'WORKING' && (
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                    )}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] break-words">
                                    {currentStep.exerciseName}
                                </h2>
                                {currentStep.subIndex !== undefined && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                            PARTE {(currentStep.subIndex + 1)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* HUD Stats Layout Grid */}
                            <div className="grid grid-cols-12 gap-3 relative z-10">
                                {/* Current Set - Prominent */}
                                <div className="col-span-12 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 p-5 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Série</p>
                                        <p className="text-6xl font-black text-white italic tracking-tighter leading-none">
                                            {currentSet}<span className="text-zinc-600 text-3xl align-top ml-1">/{
                                                setType === 'WARMUP' ? currentExercise.warmup_sets :
                                                    setType === 'FEEDER' ? currentExercise.feeder_sets :
                                                        (currentExercise.working_sets || 3)
                                            }</span>
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 bg-zinc-700/50 rounded-full flex items-center justify-center border border-zinc-600/30">
                                        <Trophy className="w-5 h-5 text-zinc-400" />
                                    </div>
                                </div>

                                {/* Target Reps (60%) */}
                                <div className="col-span-7 bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Alvo</p>
                                    <p className="text-3xl font-black text-emerald-400 italic tracking-tight">
                                        {(() => {
                                            const val = (setType === 'WARMUP' ? currentExercise.warmup_reps :
                                                setType === 'FEEDER' ? currentExercise.feeder_reps :
                                                    currentExercise.reps) || '10'

                                            // 1. Try to find the number after "series de" or similar prefixes
                                            const match = val.match(/(?:\d+.*series?|series?.*de|x)\s*(\d+(?:\s*[-–a/]\s*\d+)?)\b/i)
                                            if (match) return match[1].replace(/\s+/g, '').replace(/a|[-–/]/g, '-')

                                            // 2. Just clean the string of common words if no pattern found
                                            return val.replace(/(?:movimentos|reps?|repetições|repeticoes|series?|de)/gi, '').trim()
                                        })()}
                                        <span className="text-xs text-zinc-500 ml-1 not-italic font-bold">REPS</span>
                                    </p>
                                </div>

                                {/* Rest Time (40%) */}
                                <div className="col-span-5 bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Descanso</p>
                                    <p className="text-3xl font-black text-zinc-300 italic tracking-tight">
                                        {setType === 'WARMUP' ? currentExercise.warmup_rest_seconds || 45 :
                                            setType === 'FEEDER' ? currentExercise.feeder_rest_seconds || 60 :
                                                currentExercise.rest_seconds || 60}
                                        <span className="text-xs text-zinc-500 ml-1 not-italic font-bold">s</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button - Massive Icon */}
                        <Button
                            size="lg"
                            className={`w-full h-auto min-h-[7rem] py-6 text-zinc-950 font-black italic uppercase tracking-tighter text-2xl md:text-3xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] active:scale-95 transition-all whitespace-normal leading-none group flex items-center justify-between px-8 gap-6 overflow-hidden relative ${setType === 'WARMUP' ? 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/20' :
                                setType === 'FEEDER' ? 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/20' :
                                    'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                                }`}
                            onClick={handleSetAction}
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                            <div className="flex flex-col items-start gap-1 relative z-10 text-left">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    {isBiSet && currentStep.restSeconds === 0 ? `Próximo: ${steps[currentStepIndex + 1]?.exerciseName || 'Exercício'}` :
                                        currentStep.isLastInBlock ? 'Finalizar' : 'Iniciar Descanso'}
                                </span>
                                <span>
                                    {isBiSet && currentStep.restSeconds === 0 ? 'Ir para próximo exercício' :
                                        currentStep.isLastInBlock ? 'Concluir & Revisar' : setTypeLabel}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <Play className="w-12 h-12 md:w-16 md:h-16 fill-current" />
                            </div>
                        </Button>
                    </div>
                )}
            </div>


        </div>
    )
}


function SummarySetRow({ set, lastSessionSet, initialWeight, initialReps, onUpdate }: { set: any, lastSessionSet?: any, initialWeight: string, initialReps: string, onUpdate: (w: string, r: string) => void }) {
    const [weight, setWeight] = useState(initialWeight)
    const [reps, setReps] = useState(initialReps)

    const handleChange = (type: 'weight' | 'reps', val: string) => {
        let newWeight = weight
        let newReps = reps
        if (type === 'weight') {
            setWeight(val)
            newWeight = val
        } else {
            setReps(val)
            newReps = val
        }
        onUpdate(newWeight, newReps)
    }

    return (
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center transition-all">
            <div className="w-full md:w-40 shrink-0">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border whitespace-nowrap block w-fit shadow-sm ${set.type === 'WARMUP' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                    set.type === 'FEEDER' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    }`}>
                    {set.type === 'WORKING' ? `Série ${set.setNumber}` : set.label}
                </span>

            </div>
            <div className="flex gap-4 w-full flex-1">
                <div className="flex-1 space-y-1">
                    <Label className="text-[9px] text-zinc-500 uppercase font-black">Carga (kg)</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={weight}
                        onChange={e => handleChange('weight', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-10 text-center font-bold"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <Label className="text-[9px] text-zinc-500 uppercase font-black">Reps</Label>
                    <Input
                        type="number"
                        placeholder={set.expectedReps}
                        value={reps}
                        onChange={e => handleChange('reps', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-10 text-center font-bold text-emerald-500"
                    />
                </div>
            </div>
        </div>
    )
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}

'use client'

import { useState, useEffect } from 'react'
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
    ChevronUp
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { startWorkoutLog, recordSetLoad, finishWorkoutLog } from '@/actions/log-actions'

export function WorkoutPlayer({ workout, exercises }: { workout: any, exercises: any[] }) {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [setType, setSetType] = useState<'WARMUP' | 'FEEDER' | 'WORKING'>('WARMUP')
    const [currentSet, setCurrentSet] = useState(1)
    const [isResting, setIsResting] = useState(false)
    const [restTimeLeft, setRestTimeLeft] = useState(0)
    const [weightInput, setWeightInput] = useState('')
    const [repsInput, setRepsInput] = useState('')
    const [exerciseNote, setExerciseNote] = useState('')
    const [logId, setLogId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [perceivedEffort, setPerceivedEffort] = useState('7')

    const { toast } = useToast()
    const router = useRouter()

    const currentExercise = exercises[currentExerciseIndex]
    const totalExercises = exercises.length
    const progress = ((currentExerciseIndex) / totalExercises) * 100

    const setTypeLabel = {
        WARMUP: 'Aquecimento',
        FEEDER: 'Feeder Set',
        WORKING: 'Trabalho'
    }[setType]

    // Logic to determine initial set type for a new exercise
    const getInitialSetType = (ex: any) => {
        if (ex.warmup_sets > 0) return 'WARMUP'
        if (ex.feeder_sets > 0) return 'FEEDER'
        return 'WORKING'
    }

    // Sync input with exercise defaults or history
    useEffect(() => {
        if (currentExercise) {
            const initialType = getInitialSetType(currentExercise)
            setSetType(initialType)
            setCurrentSet(1)

            // Set initial reps based on type (taking first number if it's a range)
            if (initialType === 'WARMUP') setRepsInput(currentExercise.warmup_reps?.split('-')[0] || '15')
            else if (initialType === 'FEEDER') setRepsInput(currentExercise.feeder_reps?.split('-')[0] || '8')
            else setRepsInput(currentExercise.reps?.split('-')[0] || '10')

            setWeightInput('')
        }
    }, [currentExerciseIndex])

    // Update reps when setType changes (within same exercise)
    useEffect(() => {
        if (currentExercise) {
            if (setType === 'WARMUP') setRepsInput(currentExercise.warmup_reps?.split('-')[0] || '15')
            else if (setType === 'FEEDER') setRepsInput(currentExercise.feeder_reps?.split('-')[0] || '8')
            else setRepsInput(currentExercise.reps?.split('-')[0] || '10')
        }
    }, [setType])

    // Initialize Log
    useEffect(() => {
        const initLog = async () => {
            const result = await startWorkoutLog(workout.id)
            if (result.success) {
                setLogId(result.logId)
            } else {
                toast({
                    title: "Atenção",
                    description: "Seu progresso não será salvo (Erro no Log).",
                    variant: "destructive"
                })
            }
        }
        initLog()
    }, [workout.id])

    // Rest Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (isResting && restTimeLeft > 0) {
            interval = setInterval(() => {
                setRestTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (restTimeLeft === 0 && isResting) {
            handleRestEnd()
        }
        return () => clearInterval(interval)
    }, [isResting, restTimeLeft])

    const handleRestEnd = () => {
        setIsResting(false)
        const ex = currentExercise

        if (setType === 'WARMUP') {
            if (currentSet < ex.warmup_sets) {
                setCurrentSet(prev => prev + 1)
            } else if (ex.feeder_sets > 0) {
                setSetType('FEEDER')
                setCurrentSet(1)
            } else {
                setSetType('WORKING')
                setCurrentSet(1)
            }
        } else if (setType === 'FEEDER') {
            if (currentSet < ex.feeder_sets) {
                setCurrentSet(prev => prev + 1)
            } else {
                setSetType('WORKING')
                setCurrentSet(1)
            }
        } else {
            if (currentSet < (ex.working_sets || 3)) {
                setCurrentSet(prev => prev + 1)
            } else {
                advanceExercise()
            }
        }
    }

    const advanceExercise = () => {
        if (currentExerciseIndex < totalExercises - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    const handleNext = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
            setCurrentSet(1) // Reset set count for new exercise
            setWeightInput('')
            setRepsInput('')
            setExerciseNote('')
        }
    }

    const handlePrev = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1)
            setCurrentSet(1) // Reset set count for new exercise
            setWeightInput('')
            setRepsInput('')
            setExerciseNote('')
        }
    }

    const handleSetComplete = async () => {
        if (logId) {
            setLoading(true)
            await recordSetLoad({
                logId,
                exerciseId: currentExercise.exercise_id,
                weight: parseFloat(weightInput),
                reps: parseInt(repsInput),
                setType,
                notes: exerciseNote
            })
            setLoading(false)
        }

        // Specific rest for each type
        let restTime = 60
        if (setType === 'WARMUP') restTime = currentExercise.warmup_rest_seconds || 45
        else if (setType === 'FEEDER') restTime = currentExercise.feeder_rest_seconds || 60
        else restTime = currentExercise.rest_seconds || 60

        setRestTimeLeft(restTime)
        setIsResting(true)
    }

    const handleFinish = async () => {
        setLoading(true)
        if (logId) {
            await finishWorkoutLog(logId, feedback, parseInt(perceivedEffort))
        }
        toast({
            title: "MISSÃO CUMPRIDA!",
            description: "Treino registrado com sucesso. Bora crescer!",
        })
        router.push('/dashboard/student/workouts')
    }

    const setTypeColor = {
        WARMUP: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        FEEDER: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        WORKING: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }[setType]

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
                    <div className="space-y-3 text-left">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Percepção de Esforço (1-10)</Label>
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            value={perceivedEffort}
                            onChange={(e) => setPerceivedEffort(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-white rounded-2xl h-14 text-xl font-black text-center focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xl"
                        />
                        <div className="flex justify-between px-2">
                            <span className="text-[10px] text-zinc-600 font-bold uppercase italic">Fácil</span>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase italic">Intenso</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-left">
                        <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Relato do Aluno</Label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Ex: Senti muita fadiga no final, mas as cargas foram bem controladas. Falhei na última série de elevação lateral."
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xl min-h-[120px] outline-none"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full h-16 bg-white hover:bg-zinc-200 text-zinc-950 font-black italic uppercase tracking-tight rounded-2xl text-xl shadow-2xl active:scale-95 transition-all"
                >
                    {loading ? "Salvando..." : "Confirmar e Sair"}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Progress Bar Container */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Progresso Geral</p>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight leading-none">
                            {currentExerciseIndex + 1} <span className="text-zinc-700">/ {totalExercises}</span>
                        </h3>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-2 bg-zinc-900/50 rounded-full overflow-hidden border border-zinc-800/30">
                    <div
                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px]">
                {isResting ? (
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
                        <div className="text-center space-y-1">
                            <h4 className="text-lg font-black text-zinc-100 uppercase italic">Hora de Descansar</h4>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Prepare-se para o próximo set ({setTypeLabel})</p>
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Exercise Card */}
                        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Play className="w-24 h-24 text-white" />
                            </div>

                            <div className="space-y-4 relative">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl italic shadow-2xl ${setTypeColor}`}>
                                        {setTypeLabel}
                                    </Badge>
                                    {setType === 'WORKING' && (
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    )}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                                    {currentExercise.exercise?.name}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="bg-zinc-950 border border-zinc-800 px-5 py-3 rounded-2xl space-y-1 shadow-2xl">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Séries</p>
                                    <p className="text-xl font-black text-white italic">
                                        {currentSet} <span className="text-zinc-700">/ {
                                            setType === 'WARMUP' ? currentExercise.warmup_sets :
                                                setType === 'FEEDER' ? currentExercise.feeder_sets :
                                                    (currentExercise.working_sets || 3)
                                        }</span>
                                    </p>
                                </div>
                                <div className="bg-zinc-950 border border-zinc-800 px-5 py-3 rounded-2xl space-y-1 shadow-2xl">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Alvo</p>
                                    <p className="text-xl font-black text-emerald-500 italic">
                                        {setType === 'WARMUP' ? currentExercise.warmup_reps :
                                            setType === 'FEEDER' ? currentExercise.feeder_reps :
                                                currentExercise.reps} <span className="text-xs uppercase">Reps</span>
                                    </p>
                                </div>
                                <div className="bg-zinc-950 border border-zinc-800 px-5 py-3 rounded-2xl space-y-1 shadow-2xl">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Descanso</p>
                                    <p className="text-xl font-black text-zinc-400 italic">
                                        {setType === 'WARMUP' ? currentExercise.warmup_rest_seconds || 45 :
                                            setType === 'FEEDER' ? currentExercise.feeder_rest_seconds || 60 :
                                                currentExercise.rest_seconds || 60}s
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Carga (kg)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={weightInput}
                                        onChange={(e) => setWeightInput(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-2xl h-16 text-2xl font-black text-center focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xl"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Reps</span>
                                    <input
                                        type="number"
                                        value={repsInput}
                                        onChange={(e) => setRepsInput(e.target.value)}
                                        className="w-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center py-4 text-2xl font-black text-emerald-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none italic"
                                    />
                                </div>
                            </div>

                            {/* Exercise Note Input */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 px-1">
                                    <Activity className="w-3 h-3 text-zinc-600" />
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Anotação Técnica (Opcional)</span>
                                </div>
                                <textarea
                                    value={exerciseNote}
                                    onChange={(e) => setExerciseNote(e.target.value)}
                                    placeholder="Como foi o desempenho neste exercício?"
                                    className="w-full bg-zinc-900/30 border border-zinc-800 rounded-[1.5rem] p-4 text-xs font-medium text-zinc-300 placeholder:text-zinc-700 focus:border-zinc-700 transition-all outline-none resize-none h-20 leading-relaxed italic"
                                />
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className={`w-full h-24 text-zinc-950 font-black italic uppercase tracking-tighter text-2xl rounded-[2rem] shadow-2xl active:scale-95 transition-all group ${setType === 'WARMUP' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' :
                                setType === 'FEEDER' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' :
                                    'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                                }`}
                            onClick={handleSetComplete}
                            disabled={loading}
                        >
                            <CheckCircle className="mr-4 h-10 w-10 group-hover:scale-110 transition-transform" />
                            {setType === 'WORKING' && currentSet === (currentExercise.working_sets || 3) ? 'Finalizar Exercício' : `Concluir ${setTypeLabel}`}
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="pt-10 flex items-center justify-between border-t border-zinc-800/30">
                <Button
                    variant="ghost"
                    onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentExerciseIndex === 0}
                    className="text-zinc-600 hover:text-white font-black uppercase italic tracking-widest text-[10px]"
                >
                    Anterior
                </Button>
                <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                <Button
                    variant="ghost"
                    onClick={advanceExercise}
                    className="text-zinc-600 hover:text-red-500 font-black uppercase italic tracking-widest text-[10px]"
                >
                    Desistir / Pular
                </Button>
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

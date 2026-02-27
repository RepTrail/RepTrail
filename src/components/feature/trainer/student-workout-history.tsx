'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Clock,
    Calendar,
    Dumbbell,
    ChevronDown,
    ChevronUp,
    Timer,
    Activity,
    Lock,
    TrendingUp,
    LineChart,
    XIcon,
    Bell,
    Trash2
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { UnifiedExerciseChart } from '@/components/feature/shared/unified-exercise-chart'
import { getExerciseProgress, deleteWorkoutLog } from '@/actions/log-actions'
import { useToast } from '@/hooks/use-toast'

interface WorkoutLog {
    id: string
    student_id: string
    started_at: string
    completed_at: string
    workout: { name: string }
    feedback?: string
    perceived_effort?: number
    loads: Array<{
        weight_kg: number
        reps_performed: number
        set_type?: string
        notes?: string
        exercise_id: string
        exercise: { name: string, id: string }
    }>
}

interface StudentWorkoutHistoryProps {
    history: WorkoutLog[]
    isBlocked?: boolean
    mode?: 'student' | 'trainer'
}

export function StudentWorkoutHistory({ history, isBlocked, mode = 'student' }: StudentWorkoutHistoryProps) {
    const [expandedLogs, setExpandedLogs] = useState<string[]>([])
    const [expandedExercises, setExpandedExercises] = useState<string[]>([])
    const [activeParts, setActiveParts] = useState<Record<string, number>>({})
    const { toast } = useToast()

    const toggleLog = (id: string) => {
        setExpandedLogs(prev =>
            prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
        )
    }

    const toggleExercise = (logExId: string) => {
        setExpandedExercises(prev =>
            prev.includes(logExId) ? prev.filter(id => id !== logExId) : [...prev, logExId]
        )
    }

    if (isBlocked) {
        return (
            <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-14 flex flex-col items-center justify-center text-center space-y-5 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl">
                    <Lock className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="space-y-2">
                    <p className="text-white text-sm font-black uppercase italic tracking-widest">Recurso Exclusivo</p>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">
                        Histórico detalhado disponível apenas nos planos <span className="text-emerald-500">PRO e ELITE</span>.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 text-emerald-500 hover:text-white hover:bg-emerald-500/10 rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest italic border-emerald-500/20">
                    <a href="/dashboard/trainer/profile">Fazer Upgrade</a>
                </Button>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-14 flex flex-col items-center justify-center text-center space-y-4 backdrop-blur-sm">
                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <Activity className="h-8 w-8 text-zinc-800" />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] italic">Nenhum treino registrado ainda</p>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {history.map((log) => {
                const isExpanded = expandedLogs.includes(log.id)
                const duration = log.completed_at
                    ? Math.round((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 60000)
                    : null

                // Group loads by exercise
                const groupedByExercise = log.loads.reduce((acc, load) => {
                    const exId = load.exercise_id || load.exercise?.id
                    if (!acc[exId]) {
                        acc[exId] = {
                            name: load.exercise?.name,
                            id: exId,
                            sets: []
                        }
                    }
                    acc[exId].sets.push(load)
                    return acc
                }, {} as Record<string, { name: string, id: string, sets: any[] }>)

                return (
                    <div
                        key={log.id}
                        className={`
                            bg-zinc-900/40 border transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm
                            ${isExpanded ? 'border-zinc-700/50 ring-1 ring-zinc-700/20' : 'border-zinc-800/50 hover:border-zinc-700/50'}
                        `}
                    >
                        <div
                            className="p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group gap-4"
                            onClick={() => toggleLog(log.id)}
                        >
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/30 transition-all shadow-lg shrink-0">
                                    <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                                    <h4 className="text-sm sm:text-base font-black text-white italic uppercase tracking-tight leading-none truncate">
                                        {log.workout?.name || 'Treino Avulso'}
                                    </h4>
                                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                        <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 flex items-center gap-1.5 uppercase tracking-widest whitespace-nowrap">
                                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-700" />
                                            {new Date(log.started_at).toLocaleDateString('pt-BR')}
                                        </span>
                                        {duration && (
                                            <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 flex items-center gap-1.5 uppercase tracking-widest whitespace-nowrap">
                                                <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-700" />
                                                {duration} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-zinc-800/50 sm:border-0 pt-3 sm:pt-0">
                                <div className="flex flex-col items-start sm:items-end gap-0.5">
                                    <span className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</span>
                                    <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                        Concluído
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {mode === 'student' && (
                                        <DeleteWorkoutDialog logId={log.id} workoutName={log.workout?.name || 'Treino Avulso'} />
                                    )}
                                    <div className={`
                                        w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-300
                                        ${isExpanded ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 group-hover:border-zinc-700'}
                                    `}>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-4 sm:p-6 pt-0 border-t border-zinc-800/30 animate-in slide-in-from-top-4 duration-300">
                                {/* Feedback Section */}
                                {(log.perceived_effort || log.feedback) && (
                                    <div className="mt-6 p-4 sm:p-5 bg-zinc-950/50 rounded-3xl border border-zinc-800/50 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0">
                                                    <Activity className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-tight">Análise de Desempenho (RPE)</p>
                                            </div>
                                            {log.perceived_effort && (
                                                <div className="flex items-center justify-between sm:justify-end gap-3 bg-zinc-900/40 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-zinc-800/30 sm:border-0">
                                                    <span className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest whitespace-nowrap">Nível de Esforço</span>
                                                    <span className={`
                                                        px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black border italic shrink-0
                                                        ${log.perceived_effort >= 8 ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                                                            log.perceived_effort >= 5 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}
                                                    `}>
                                                        {log.perceived_effort}/10
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {log.feedback && (
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> Relato do Aluno
                                                </p>
                                                <p className="text-sm font-medium text-zinc-300 italic bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/30 leading-relaxed">
                                                    "{log.feedback}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 space-y-5">
                                    <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-3">
                                        <Activity className="w-3.5 h-3.5 text-zinc-700" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">Ganhos de Carga</p>
                                    </div>
                                    <div className="grid gap-3">
                                        {Object.values(groupedByExercise).length > 0 ? (
                                            Object.values(groupedByExercise).map((exGroup) => {
                                                const logExId = `${log.id}-${exGroup.id}`
                                                const isExExpanded = expandedExercises.includes(logExId)

                                                const isBiSet = exGroup.name.includes('+')
                                                const parts = isBiSet ? exGroup.name.split(/\s*\+\s*/).map(p => p.trim()) : [exGroup.name]
                                                const activePartIdx = activeParts[logExId] || 0

                                                return (
                                                    <div key={exGroup.id} className="space-y-2">
                                                        <div
                                                            className={`
                                                                grid grid-cols-[40px_1fr_auto] items-center bg-zinc-950/40 p-3 sm:p-4 rounded-[1.5rem] sm:rounded-3xl border transition-all cursor-pointer gap-3
                                                                ${isExExpanded ? 'border-zinc-700 bg-zinc-900/40 ring-1 ring-zinc-700/20' : 'border-zinc-800/50 hover:border-zinc-700/50'}
                                                            `}
                                                            onClick={() => toggleExercise(logExId)}
                                                        >
                                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner shrink-0 transition-transform group-hover:scale-105">
                                                                <div className={`w-2 h-2 rounded-full ${isExExpanded ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
                                                            </div>

                                                            <div className="min-w-0 flex flex-col justify-center">
                                                                <span className="text-xs sm:text-sm font-black text-zinc-100 uppercase italic tracking-tight truncate block leading-tight">{isBiSet ? "Exercício Conjugado" : exGroup.name}</span>
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    {!isBiSet && (
                                                                        <div className="bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-zinc-800/50 flex items-baseline gap-1">
                                                                            <span className="text-[10px] font-black text-zinc-400 uppercase italic">{exGroup.sets.length}</span>
                                                                            <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">Séries</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                                                <ObservationsPopup
                                                                    exerciseName={exGroup.name}
                                                                    notes={exGroup.sets.map(s => s.notes).filter(Boolean) as string[]}
                                                                />
                                                                <ProgressionPopup studentId={log.student_id} exerciseId={exGroup.id} exerciseName={exGroup.name} />
                                                                <div className={`
                                                                    w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-300
                                                                    ${isExExpanded ? 'bg-zinc-100 text-zinc-950 border-white shadow-lg shadow-white/10' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}
                                                                `}>
                                                                    {isExExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {isExExpanded && (
                                                            <div className="grid gap-2.5 animate-in slide-in-from-left-2 duration-200">
                                                                {isBiSet && parts.length > 1 && (
                                                                    <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 gap-1 mb-2">
                                                                        {parts.map((partName, idx) => (
                                                                            <button
                                                                                key={idx}
                                                                                onClick={() => setActiveParts(prev => ({ ...prev, [logExId]: idx }))}
                                                                                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activePartIdx === idx
                                                                                    ? "bg-emerald-500 text-zinc-950 shadow-lg"
                                                                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                                                                                    }`}
                                                                                type="button"
                                                                            >
                                                                                {partName}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {exGroup.sets.filter((load: any) => {
                                                                    if (!isBiSet) return true;
                                                                    if (load.sub_index !== undefined && load.sub_index !== null) {
                                                                        return load.sub_index === activePartIdx;
                                                                    }
                                                                    const currentPartName = parts[activePartIdx];
                                                                    if (load.notes?.includes(`[${currentPartName}]`)) return true;
                                                                    // Fallback: If no sub_index/note but is bi-set, assign to first block unless notes tell us otherwise
                                                                    // Since old data might just all fall to part 0, that's better than duplicating.
                                                                    return activePartIdx === 0 && !parts.some((p, i) => i !== 0 && load.notes?.includes(`[${p}]`));
                                                                }).map((load, idx) => (
                                                                    <div key={idx} className="grid grid-cols-[25px_1.5fr_1fr_1fr] items-center bg-zinc-900/30 p-3.5 sm:p-5 rounded-2xl border border-zinc-800/30 gap-2 sm:gap-4">
                                                                        <span className="text-[11px] font-black text-zinc-600 uppercase italic leading-none">{idx + 1}º</span>

                                                                        <div className="flex justify-start min-w-0">
                                                                            <div className={`
                                                                                px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border
                                                                                ${load.set_type === 'WARMUP' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                                    load.set_type === 'FEEDER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}
                                                                            `}>
                                                                                {load.set_type === 'WARMUP' ? 'Aquecimento' :
                                                                                    load.set_type === 'FEEDER' ? 'Feeder' : 'Trabalho'}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex flex-col items-end border-l border-zinc-800/50 pl-3">
                                                                            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Carga</span>
                                                                            <div className="flex items-baseline gap-0.5">
                                                                                <span className="text-sm sm:text-base font-black text-white italic leading-none">{load.weight_kg}</span>
                                                                                <span className="text-[9px] font-black text-zinc-700 uppercase italic">kg</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex flex-col items-end border-l border-zinc-800/50 pl-3">
                                                                            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Reps</span>
                                                                            <span className="text-sm sm:text-base font-black text-emerald-500 italic leading-none">{load.reps_performed}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="py-8 text-center bg-zinc-900/20 rounded-2xl border border-zinc-800/50 border-dashed">
                                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest italic leading-none">Nenhuma carga anotada</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function ProgressionPopup({ studentId, exerciseId, exerciseName }: { studentId: string, exerciseId: string, exerciseName: string }) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleOpen = async () => {
        setLoading(true)
        try {
            const history = await getExerciseProgress(studentId, exerciseId)
            setData(history)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog onOpenChange={(open) => open && handleOpen()}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 p-0 rounded-xl bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-500 transition-all duration-300 shadow-xl border"
                >
                    <LineChart className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="bg-zinc-950 border-zinc-800 rounded-[2.5rem] shadow-2xl max-w-4xl w-[90vw] max-h-[85vh] p-0"
            >
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-300"
                    >
                        <XIcon className="w-5 h-5" />
                    </Button>
                </DialogClose>

                <div className="overflow-y-auto max-h-[85vh] p-6 sm:p-10">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center justify-start gap-4 pr-12">
                            <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
                                <TrendingUp className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="space-y-1 text-left min-w-0">
                                <DialogTitle className="text-lg sm:text-2xl font-black text-zinc-100 uppercase italic tracking-tighter leading-tight">
                                    Evolução de Carga
                                </DialogTitle>
                                <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest">{exerciseName}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {loading ? (
                        <div className="aspect-[16/7] flex items-center justify-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Analisando histórico...</span>
                            </div>
                        </div>
                    ) : (
                        <UnifiedExerciseChart data={data} mode="detailed" exerciseName={exerciseName} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ObservationsPopup({ exerciseName, notes }: { exerciseName: string, notes: string[] }) {
    const hasNotes = notes.length > 0

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className={`h-8 w-8 p-0 rounded-xl transition-all duration-300 shadow-xl border relative group/bell ${hasNotes
                        ? 'bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-zinc-950'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-700 hover:text-zinc-400'
                        }`}
                >
                    <Bell className={`w-4 h-4 ${hasNotes ? 'group-hover/bell:animate-ring' : ''}`} />
                    {hasNotes && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-xl bg-zinc-950 border-zinc-800 rounded-[2rem] p-0 overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-300 backdrop-blur-md"
                    >
                        <XIcon className="w-5 h-5" />
                    </Button>
                </DialogClose>

                <div className="p-6 sm:p-10 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center justify-start gap-4 pr-12">
                            <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-2xl border border-red-500/20 shrink-0">
                                <Bell className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="space-y-1 text-left min-w-0">
                                <DialogTitle className="text-lg sm:text-2xl font-black text-zinc-100 uppercase italic tracking-tighter leading-tight">
                                    Observações do Aluno
                                </DialogTitle>
                                <p className="text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-widest">{exerciseName}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        {hasNotes ? (
                            notes.map((note, idx) => (
                                <div key={idx} className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 backdrop-blur-sm space-y-2">
                                    <div className="flex items-center gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">
                                        <Clock className="w-3 h-3" /> Relato {idx + 1}
                                    </div>
                                    <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                                        "{note}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-zinc-900/20 p-8 rounded-2xl border border-zinc-800/30 border-dashed text-center">
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">
                                    Nenhuma observação anotada pelo aluno.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-800/30 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-zinc-700" />
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">
                            Use estas informações para ajustar o volume ou a carga no próximo treino.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function DeleteWorkoutDialog({ logId, workoutName }: { logId: string, workoutName: string }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteWorkoutLog(logId)
            if (result.success) {
                toast({
                    title: "Treino Apagado",
                    description: "O registro foi removido com sucesso."
                })
                setOpen(false)
            } else {
                toast({
                    title: "Erro ao Apagar",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-2xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-md bg-zinc-950 border-zinc-800 rounded-[2rem] p-0 overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="p-6 sm:p-10 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center justify-start gap-4 pr-12">
                            <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-2xl border border-red-500/20 shrink-0">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="space-y-1 text-left min-w-0">
                                <DialogTitle className="text-lg sm:text-2xl font-black text-zinc-100 uppercase italic tracking-tighter leading-tight">
                                    Apagar Registro?
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">
                                    Esta ação não pode ser desfeita.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                            Você está prestes a remover o registro do treino <span className="text-white font-black italic">{workoutName}</span>. Todas as cargas e anotações deste dia serão perdidas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-widest text-[10px] italic transition-all"
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-zinc-950 font-black uppercase tracking-widest text-[10px] italic transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95"
                        >
                            {loading ? "Apagando..." : "Confirmar Exclusão"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function WorkoutFeedbackPopup({ feedback, workoutName }: { feedback?: string, workoutName: string }) {
    const hasFeedback = !!feedback

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className={`w-10 h-10 rounded-2xl transition-all duration-300 relative group/feedback ${hasFeedback
                        ? 'text-emerald-500 hover:bg-emerald-500/10'
                        : 'text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800/50'
                        }`}
                >
                    <Bell className={`w-4 h-4 ${hasFeedback ? 'group-hover/feedback:animate-ring' : ''}`} />
                    {hasFeedback && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-xl bg-zinc-950 border-zinc-800 rounded-[2rem] p-0 overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all duration-300 backdrop-blur-md"
                    >
                        <XIcon className="w-5 h-5" />
                    </Button>
                </DialogClose>

                <div className="p-6 sm:p-10 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center justify-start gap-4 pr-12">
                            <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
                                <Activity className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="space-y-1 text-left min-w-0">
                                <DialogTitle className="text-lg sm:text-2xl font-black text-zinc-100 uppercase italic tracking-tighter leading-tight">
                                    Relato do Treino
                                </DialogTitle>
                                <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest">{workoutName}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        {hasFeedback ? (
                            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 backdrop-blur-sm space-y-3">
                                <div className="flex items-center gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">
                                    <Clock className="w-3 h-3" /> Comentário Pós-Treino
                                </div>
                                <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
                                    "{feedback}"
                                </p>
                            </div>
                        ) : (
                            <div className="bg-zinc-900/20 p-8 rounded-2xl border border-zinc-800/30 border-dashed text-center">
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">
                                    O aluno concluiu o treino sem deixar um relato por escrito.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-800/30 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-zinc-700" />
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">
                            Este relato ajuda a entender o nível de fadiga sistêmica do aluno.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

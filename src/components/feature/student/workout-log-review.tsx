'use client'

import { useState, useTransition } from 'react'
import { updateLoadEntry } from '@/actions/log-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, CheckCircle, Save, Dumbbell, Flame, Zap, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Load {
    id: string
    exercise_id: string
    weight_kg: number
    reps_performed: number
    set_type: string
    notes?: string
    exercise: { id: string; name: string }
}

interface WorkoutLogReviewProps {
    logId: string
    workoutName: string
    completedAt: string
    loads: Load[]
}

const setTypeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    WARMUP: { label: 'Aquec.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    FEEDER: { label: 'Feeder', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    WORKING: { label: 'Trab.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

export function WorkoutLogReview({ logId, workoutName, completedAt, loads }: WorkoutLogReviewProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Local state: map of loadId -> { weight, reps }
    const [edits, setEdits] = useState<Record<string, { weight: string; reps: string }>>(() => {
        const init: Record<string, { weight: string; reps: string }> = {}
        loads.forEach(l => {
            init[l.id] = { weight: String(l.weight_kg), reps: String(l.reps_performed) }
        })
        return init
    })

    // Group loads by exercise name
    const grouped = loads.reduce((acc, load) => {
        const name = load.exercise?.name || 'Exercício'
        if (!acc[name]) acc[name] = []
        acc[name].push(load)
        return acc
    }, {} as Record<string, Load[]>)

    const handleSaveAll = () => {
        startTransition(async () => {
            const updates = Object.entries(edits).map(async ([loadId, { weight, reps }]) => {
                const w = parseFloat(weight)
                const r = parseInt(reps)
                if (isNaN(w) || isNaN(r)) return
                return updateLoadEntry(loadId, w, r)
            })

            const results = await Promise.all(updates)
            const hasError = results.some((r: any) => r?.error)

            if (hasError) {
                toast({ title: 'Erro ao salvar', description: 'Algumas alterações não foram salvas.', variant: 'destructive' })
            } else {
                toast({ title: 'Salvo!', description: 'Cargas e repetições atualizadas.' })
                router.push('/dashboard/student')
            }
        })
    }

    const date = new Date(completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    const time = new Date(completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-2 -mb-24">
            {/* Header */}
            <div className="space-y-3">
                <Link
                    href="/dashboard/student"
                    className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                </Link>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest mb-0.5">
                            Revisar Treino • {date} às {time}
                        </p>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight leading-none">
                            {workoutName}
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {loads.length} série{loads.length !== 1 ? 's' : ''} registrada{loads.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Exercises */}
            <div className="space-y-2">
                {Object.entries(grouped).map(([exerciseName, exerciseLoads]) => (
                    <div key={exerciseName} className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
                        {/* Exercise title */}
                        <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800/40">
                            <Dumbbell className="w-4 h-4 text-orange-500/70 flex-shrink-0" />
                            <p className="text-sm font-black text-white italic uppercase tracking-tight">
                                {exerciseName}
                            </p>
                        </div>

                        {/* Sets */}
                        <div className="divide-y divide-zinc-800/30">
                            {exerciseLoads.map((load, setIdx) => {
                                const cfg = setTypeConfig[load.set_type] || setTypeConfig.WORKING
                                const edit = edits[load.id] || { weight: '0', reps: '0' }

                                return (
                                    <div key={load.id} className="flex items-center gap-3 px-4 py-2">
                                        {/* Set type badge */}
                                        <span className={`flex-shrink-0 text-[9px] font-black px-2 py-0.5 rounded-md border uppercase ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                                            {cfg.label}
                                        </span>

                                        {/* Weight input */}
                                        <div className="flex-1 flex items-center gap-1.5">
                                            <Input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                value={edit.weight}
                                                onChange={e => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], weight: e.target.value } }))}
                                                className="h-9 bg-zinc-950 border-zinc-700 text-white text-center font-bold rounded-xl text-sm focus:border-orange-500/50 w-20"
                                            />
                                            <span className="text-[10px] text-zinc-500 font-bold">kg</span>
                                        </div>

                                        <span className="text-zinc-700 text-xs font-black">×</span>

                                        {/* Reps input */}
                                        <div className="flex items-center gap-1.5">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={edit.reps}
                                                onChange={e => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], reps: e.target.value } }))}
                                                className="h-9 bg-zinc-950 border-zinc-700 text-white text-center font-bold rounded-xl text-sm focus:border-orange-500/50 w-16"
                                            />
                                            <span className="text-[10px] text-zinc-500 font-bold">reps</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Save button — floating at the bottom */}
            <div className="fixed bottom-6 left-6 right-6 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-lg md:w-full z-50">
                <Button
                    onClick={handleSaveAll}
                    disabled={isPending}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black italic uppercase tracking-tight text-base rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] border-t border-emerald-400/20"
                >
                    <Save className="w-5 h-5" />
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </div>
    )
}

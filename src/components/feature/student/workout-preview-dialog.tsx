'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, Dumbbell } from 'lucide-react'

interface Exercise {
    id: string
    order_index?: number
    warmup_sets?: number
    feeder_sets?: number
    working_sets?: number
    reps?: string
    exercise?: { name: string } | null
}

interface WorkoutPreviewDialogProps {
    workoutName: string
    exercises: Exercise[]
}

export function WorkoutPreviewDialog({ workoutName, exercises }: WorkoutPreviewDialogProps) {
    const [open, setOpen] = useState(false)

    const sorted = [...exercises].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-10 px-4 bg-zinc-950 border-zinc-700 hover:bg-zinc-800 hover:border-orange-500/40 text-zinc-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                >
                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                    Ver Exercícios
                </Button>
            </DialogTrigger>

            <DialogContent className="p-0 overflow-hidden gap-0 flex flex-col">
                {/* Header */}
                <DialogHeader className="border-b border-zinc-800/60">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                            <Dumbbell className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                                {sorted.length} exercício{sorted.length !== 1 ? 's' : ''}
                            </p>
                            <DialogTitle className="text-base font-black text-white italic uppercase tracking-tight leading-tight">
                                {workoutName}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {/* Exercise List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {sorted.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <Dumbbell className="w-8 h-8 text-zinc-700" />
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                Nenhum exercício cadastrado
                            </p>
                        </div>
                    ) : (
                        sorted.map((ex, idx) => {
                            const name = ex.exercise?.name || '—'
                            const working = ex.working_sets ?? 0
                            const warmup = ex.warmup_sets ?? 0
                            const feeder = ex.feeder_sets ?? 0

                            return (
                                <div
                                    key={ex.id}
                                    className="grid grid-cols-[16px_1fr_auto] items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/50 w-full overflow-hidden"
                                >
                                    {/* Index */}
                                    <span className="text-[10px] font-black text-zinc-600">
                                        {idx + 1}
                                    </span>

                                    {/* Name */}
                                    <p className="text-sm font-black text-white italic uppercase tracking-tight truncate min-w-0">
                                        {name}
                                    </p>

                                    {/* Series badges */}
                                    <div className="flex items-center gap-1 flex-shrink-0 min-w-fit">
                                        {warmup > 0 && (
                                            <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black rounded-lg uppercase whitespace-nowrap">
                                                {warmup}aq
                                            </span>
                                        )}
                                        {feeder > 0 && (
                                            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black rounded-lg uppercase whitespace-nowrap">
                                                {feeder}fd
                                            </span>
                                        )}
                                        {working > 0 && (
                                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg uppercase whitespace-nowrap">
                                                {working}×{ex.reps || '–'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-800/60">
                    <Button
                        onClick={() => setOpen(false)}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                        Fechar Visualização
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

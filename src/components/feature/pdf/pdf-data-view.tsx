'use client'

import { Badge } from "@/components/ui/badge"
import { Activity, Utensils, Timer, Repeat, Zap, Flame, Pill, Info, Clock } from 'lucide-react'

interface Exercise {
    name: string
    sets: number
    reps: string
    rest: number
    warmup_sets?: string
    feeder_sets?: string
    notes?: string
}

interface Workout {
    name: string
    day_of_week: number
    exercises: Exercise[]
}

interface Cardio {
    type: string
    duration: string
    intensity: string
    frequency: string
}

interface Meal {
    meal_name: string
    foods: Array<{
        name: string
        quantity: string
        calories: number
        protein: number
        carbs: number
        fat: number
    }>
}

interface Ergogenic {
    name: string
    dosage: string
    unit: string
}

export function PdfDataView({ type, data }: { type: 'workout' | 'diet', data: any }) {
    if (type === 'workout') {
        const workouts = data.workouts || []
        const cardios = data.cardios || []
        const ergogenics = data.ergogenics || []

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Workouts */}
                {workouts.map((workout: Workout, idx: number) => (
                    <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="bg-zinc-900/60 px-6 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="line-clamp-2">{workout.name || `TREINO ${idx + 1}`}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                    {workout.exercises?.length || 0} EXERCÍCIOS
                                </Badge>
                                {(() => {
                                    const totalWarmup = workout.exercises?.filter(ex => ex.warmup_sets).length || 0
                                    const totalFeeder = workout.exercises?.filter(ex => ex.feeder_sets).length || 0
                                    if (totalWarmup === 0 && totalFeeder === 0) return null
                                    return (
                                        <Badge variant="outline" className="bg-zinc-950 border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                            {totalWarmup > 0 && `${totalWarmup} WARMUP`}
                                            {totalWarmup > 0 && totalFeeder > 0 && " • "}
                                            {totalFeeder > 0 && `${totalFeeder} FEEDER`}
                                        </Badge>
                                    )
                                })()}
                            </div>
                        </div>
                        <div className="divide-y divide-zinc-800/50">
                            {workout.exercises?.map((ex: Exercise, exIdx: number) => (
                                <div key={exIdx} className="p-4 lg:p-6 hover:bg-zinc-800/20 transition-colors group">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-white font-bold text-sm lg:text-base group-hover:text-emerald-400 transition-colors">
                                                        {ex.name}
                                                    </p>
                                                    {(ex.name?.toLowerCase().includes('+') ||
                                                        ex.name?.toLowerCase().includes('conjugado') ||
                                                        ex.notes?.toLowerCase().includes('bi-set') ||
                                                        ex.notes?.toLowerCase().includes('biset') ||
                                                        ex.notes?.toLowerCase().includes('conjugado')) && (
                                                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 h-4 shrink-0">
                                                                <Zap className="w-2 h-2 mr-1" /> CONJUGADO
                                                            </Badge>
                                                        )}
                                                </div>
                                                {ex.notes && (
                                                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 italic bg-zinc-800/30 px-2 py-1 rounded-lg border border-zinc-800/50 sm:whitespace-nowrap w-fit">
                                                        <Info className="w-2.5 h-2.5 shrink-0" />
                                                        <span className="line-clamp-2 sm:line-clamp-1">{ex.notes}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detailed Sets Breakdown */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                                                {/* Warmup Sets */}
                                                {ex.warmup_sets && (
                                                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-orange-500 uppercase tracking-widest">
                                                            <Flame className="w-3 h-3" /> AQUECIMENTO
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-zinc-100 italic">
                                                                {ex.warmup_sets.includes('x')
                                                                    ? `${ex.warmup_sets.split('x')[0]} SÉRIES`
                                                                    : 'SÉRIES PROG.'}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-zinc-500 px-2 py-0.5 bg-zinc-950 rounded-lg">
                                                                {ex.warmup_sets.includes('x')
                                                                    ? `${ex.warmup_sets.split('x')[1]} REPS`
                                                                    : ex.warmup_sets}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Feeder Sets */}
                                                {ex.feeder_sets && (
                                                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                                            <Timer className="w-3 h-3" /> FEEDER
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-zinc-100 italic">
                                                                {ex.feeder_sets.includes('x')
                                                                    ? `${ex.feeder_sets.split('x')[0]} SÉRIES`
                                                                    : 'SÉRIE ÚNICA'}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-zinc-500 px-2 py-0.5 bg-zinc-950 rounded-lg">
                                                                {ex.feeder_sets.includes('x')
                                                                    ? `${ex.feeder_sets.split('x')[1]} REPS`
                                                                    : ex.feeder_sets}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Working Sets (Séries de Trabalho) */}
                                                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                                        <Activity className="w-3 h-3" /> TRABALHO
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-white italic">
                                                            {ex.sets} SÉRIES
                                                        </span>
                                                        <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 bg-zinc-950 rounded-lg">
                                                            {ex.reps} REPS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Extra small info like rest */}
                                            <div className="flex items-center gap-4 mt-3 pl-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" />
                                                    DESCANSO: {ex.rest}s
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Cardios & Ergogenics */}
                {(cardios.length > 0 || ergogenics.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {cardios.length > 0 && (
                            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-4">
                                <h4 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2 border-b border-zinc-800 pb-4">
                                    <Timer className="w-5 h-5 text-emerald-500" />
                                    Cardios Extraídos
                                </h4>
                                <div className="space-y-3">
                                    {cardios.map((c: Cardio, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/40 border border-zinc-800/50 rounded-xl">
                                            <p className="text-zinc-200 font-bold text-xs uppercase">{c.type}</p>
                                            <div className="flex gap-2 text-[10px] font-bold text-emerald-500 uppercase">
                                                <span>{c.duration}</span>
                                                <span className="text-zinc-700">•</span>
                                                <span>{c.intensity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {ergogenics.length > 0 && (
                            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-4">
                                <h4 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2 border-b border-zinc-800 pb-4">
                                    <Pill className="w-5 h-5 text-amber-500" />
                                    Protocolo Extraído
                                </h4>
                                <div className="space-y-3">
                                    {ergogenics.map((ergo: Ergogenic, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/40 border border-zinc-800/50 rounded-xl">
                                            <p className="text-zinc-200 font-bold text-xs uppercase">{ergo.name}</p>
                                            <Badge className="bg-amber-500/10 text-amber-500 border-none text-[10px] font-black uppercase">
                                                {ergo.dosage}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    // DIET VIEW
    const diets = data.diets || data.meals || []
    const cardios = data.cardios || []
    const ergogenics = data.ergogenics || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {diets.map((meal: any, idx: number) => {
                // Se a IA mandou o objeto de dieta com meals dentro, a gente pega o primeiro
                const mealData = meal.meals ? meal.meals : [meal]

                return (meal.meals || [meal]).map((m: Meal, mIdx: number) => {
                    const totalKcal = m.foods?.reduce((acc, f) => acc + (f.calories || 0), 0) || 0
                    const totalProt = m.foods?.reduce((acc, f) => acc + (f.protein || 0), 0) || 0
                    const totalCarbs = m.foods?.reduce((acc, f) => acc + (f.carbs || 0), 0) || 0
                    const totalFat = m.foods?.reduce((acc, f) => acc + (f.fat || 0), 0) || 0

                    return (
                        <div key={`${idx}-${mIdx}`} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="bg-zinc-900/60 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                                <h3 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2">
                                    <Utensils className="w-5 h-5 text-emerald-500" />
                                    {m.meal_name || `REFEIÇÃO ${mIdx + 1}`}
                                </h3>
                                <div className="flex gap-2 text-[9px] font-black text-emerald-500/70 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 uppercase tracking-widest">
                                    <span>{Math.round(totalKcal)} KCAL</span>
                                    <span className="text-zinc-800">•</span>
                                    <span>{Math.round(totalProt)}G P</span>
                                    <span className="text-zinc-800">•</span>
                                    <span>{Math.round(totalCarbs)}G C</span>
                                    <span className="text-zinc-800">•</span>
                                    <span>{Math.round(totalFat)}G F</span>
                                </div>
                            </div>
                            <div className="p-4 lg:p-6 space-y-3">
                                {m.foods?.length > 0 ? (
                                    m.foods.map((food, fIdx) => (
                                        <div key={fIdx} className="flex items-center justify-between p-3 bg-zinc-950/20 border border-zinc-800/30 rounded-xl group hover:border-emerald-500/30 transition-all">
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors uppercase leading-tight">{food.name}</p>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{food.quantity}</p>
                                            </div>
                                            <div className="flex gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">
                                                <div className="text-center min-w-[35px]">
                                                    <div className="text-zinc-300">{Math.round(food.protein || 0)}G</div>
                                                    <div className="text-[6px] text-zinc-600">PROT</div>
                                                </div>
                                                <div className="text-center min-w-[35px]">
                                                    <div className="text-zinc-300">{Math.round(food.carbs || 0)}G</div>
                                                    <div className="text-[6px] text-zinc-600">CARB</div>
                                                </div>
                                                <div className="text-center min-w-[35px]">
                                                    <div className="text-zinc-300">{Math.round(food.fat || 0)}G</div>
                                                    <div className="text-[6px] text-zinc-600">FAT</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 border border-dashed border-zinc-800 rounded-xl">
                                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Nenhum alimento detectado nesta refeição</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })
            })}

            {/* Extras section for Diets (Cardios only, Ergogenics hidden) */}
            {(cardios.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                    {cardios.length > 0 && (
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-4 shadow-xl">
                            <h4 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2 border-b border-zinc-800 pb-4">
                                <Timer className="w-5 h-5 text-emerald-500" />
                                Cardios Detectados
                            </h4>
                            <div className="space-y-3">
                                {cardios.map((c: Cardio, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/40 border border-zinc-800/50 rounded-xl group hover:border-emerald-500/20 transition-all">
                                        <p className="text-zinc-200 font-bold text-xs uppercase">{c.type}</p>
                                        <div className="flex gap-2 text-[10px] font-bold text-emerald-500 uppercase">
                                            <span>{c.duration}</span>
                                            <span className="text-zinc-700">•</span>
                                            <span>{c.intensity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

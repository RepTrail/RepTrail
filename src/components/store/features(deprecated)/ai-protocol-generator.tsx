'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateAIProtocol, AIProtocolPreferences } from '@/actions/ai-protocol-actions'
import {
    Sparkles, Dumbbell, Activity, Utensils,
    ChevronRight, ChevronLeft, Loader2,
    RotateCcw, Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/store/base/input'

// ── Types ──────────────────────────────────────────────────────────────────
type Step = 'goal' | 'workout' | 'priorities' | 'cardio' | 'diet' | 'confirm'

const STEPS: Step[] = ['goal', 'workout', 'priorities', 'cardio', 'diet', 'confirm']

const STEP_LABELS: Record<Step, string> = {
    goal: 'Objetivo',
    workout: 'Divisão',
    priorities: 'Pontos',
    cardio: 'Cardio',
    diet: 'Dieta',
    confirm: 'Gerar'
}

const STEP_ICONS: Record<Step, typeof Dumbbell> = {
    goal: Zap,
    workout: Dumbbell,
    priorities: Activity,
    cardio: Activity,
    diet: Utensils,
    confirm: Sparkles
}

const SPLITS = [
    { value: 'ppl', label: 'PPL', sub: 'Push / Pull / Legs' },
    { value: 'upper_lower', label: 'Upper/Lower', sub: 'Superior e Inferior' },
    { value: 'one_group', label: '1 Grupo', sub: '1 músculo por semana' },
    { value: 'full_body', label: 'Full Body', sub: 'Corpo todo por sessão' },
]

const CARDIO_OPTIONS = ['Esteira', 'Bike', 'Escada', 'Corrida ao Ar Livre', 'HIIT', 'Elíptico', 'Natação', 'Pular corda']

const DAYS_OPTIONS = [3, 4, 5, 6]
const DURATION_OPTIONS = [30, 45, 60, 75, 90]
const MEALS_OPTIONS = [3, 4, 5, 6]

// ── Sub-components ──────────────────────────────────────────────────────────

function SelectCard({ label, sub, selected, onClick }: { label: string, sub?: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative p-4 rounded-system border text-left transition-all duration-200 active:scale-95",
                selected
                    ? "border-orange-500/60 bg-orange-500/10 shadow-orange-500/10 shadow-lg"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            )}
        >
            {/* Check icon removed */}
            <p className={cn("font-black text-sm uppercase italic tracking-tight", selected ? "text-orange-400" : "text-white")}>
                {label}
            </p>
            {sub && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{sub}</p>}
        </button>
    )
}

function NumberCard({ value, label, selected, onClick }: { value: number, label?: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-2 sm:p-4 rounded-system border text-center transition-all duration-200 active:scale-95 w-full min-w-0",
                selected
                    ? "border-orange-500/60 bg-orange-500/10 shadow-orange-500/10 shadow-lg"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            )}
        >
            <p className={cn("font-black text-lg sm:text-xl italic", selected ? "text-orange-400" : "text-white")}>{value}</p>
            {label && <p className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 truncate">{label}</p>}
        </button>
    )
}

function ToggleChip({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-system border text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95",
                selected
                    ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            )}
        >
            {label}
        </button>
    )
}

function TextArea({ placeholder, value, onChange }: { placeholder: string, value: string, onChange: (v: string) => void }) {
    return (
        <textarea
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-system p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 resize-none h-28 font-medium transition-colors"
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    )
}

// ── Main Component ──────────────────────────────────────────────────────────

export function AIProtocolGenerator({ userId = 'me' }: { userId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [step, setStep] = useState<Step>('goal')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<any>(null)

    // Form state
    const [goal, setGoal] = useState<'bulking' | 'cutting' | 'maintenance'>('bulking')
    const [workoutSplit, setWorkoutSplit] = useState('ppl')
    const [customSplit, setCustomSplit] = useState('')
    const [trainingVolume, setTrainingVolume] = useState<'low' | 'high'>('high')
    const [strongMuscles, setStrongMuscles] = useState('')
    const [weakMuscles, setWeakMuscles] = useState('')
    const [cardioLikes, setCardioLikes] = useState<string[]>([])
    const [cardioDislikes, setCardioDislikes] = useState<string[]>([])
    const [mealsPerDay, setMealsPerDay] = useState(4)
    const [foodLikes, setFoodLikes] = useState('')
    const [foodDislikes, setFoodDislikes] = useState('')
    const [dietaryRestrictions, setDietaryRestrictions] = useState('')

    const stepIdx = STEPS.indexOf(step)

    const prev = () => setStep(STEPS[stepIdx - 1])
    const next = () => setStep(STEPS[stepIdx + 1])

    const canGoNext = () => {
        if (step === 'goal') return !!goal
        if (step === 'workout') return !!workoutSplit
        return true
    }

    const { mutate: saveProtocolMutate } = useOptimisticMutation({
        actionName: 'save-parsed-data',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async (vars) => vars,
        onMutate: async ({ data, type }: { data: any, type: string }) => {
            // 🧠 MULTI-SYNC: Update everything present in the payload
            if (data.workouts?.length) {
                const optimisticWorkouts = data.workouts.map((w: any) => ({
                    ...w,
                    id: w.id || `opt-w-${Math.random()}`,
                    status: 'not_started',
                    workout_exercises: (w.exercises || []).map((ex: any) => ({
                        ...ex,
                        id: `opt-ex-${Math.random()}`,
                        exercise: { name: ex.name || ex.exercise }
                    }))
                }))
                queryClient.setQueryData(QUERY_KEYS.workouts.today(userId), optimisticWorkouts)
            }

            if (data.cardios?.length) {
                const optimisticCardios = data.cardios.map((c: any) => ({
                    ...c,
                    id: c.id || `opt-c-${Math.random()}`,
                    name: c.type || c.name || 'Cardio'
                }))
                queryClient.setQueryData(QUERY_KEYS.cardio.today(userId), optimisticCardios)
            }

            if (data.diets?.length || data.meals?.length) {
                const dietSource = data.diets?.[0] || data
                const optimisticDiet = {
                    ...dietSource,
                    id: dietSource.id || `opt-d-${Math.random()}`,
                    user_id: userId,
                    meals: (dietSource.meals || []).map((m: any) => ({
                        ...m,
                        id: `opt-m-${Math.random()}`,
                        name: m.meal_name || m.name,
                        meal_items: (m.foods || m.items || []).map((i: any) => ({
                            ...i,
                            id: `opt-i-${Math.random()}`,
                            food_name: i.name || i.food_name || i.food,
                            is_checked: false
                        }))
                    }))
                }
                queryClient.setQueryData(QUERY_KEYS.diets.today(userId), optimisticDiet)
            }
        }
    })

    const { mutate: generateMutate } = useMutation({
        mutationFn: async (variables: any) => {
            const result = await generateAIProtocol(variables.preferences)
            if (result.error) throw new Error(result.error)
            return result
        },
        onMutate: () => {
            setLoading(true)
            toast({
                title: "✨ Gerando seu protocolo...",
                description: "Nossa IA está trabalhando. Isso pode levar até 60 segundos."
            })
        },
        onSuccess: (result) => {
            setLoading(false)
            if (result.data) {
                // 🧠 PERSISTENCE-FIRST: Save to Outbox immediately (Unified single call to prevent duplication)
                if (result.data) {
                    saveProtocolMutate({ type: 'workout', data: result.data, studentId: userId })
                }
                setSuccess(result.summary)
            }
        },
        onError: (err) => {
            setLoading(false)
            setError(err.message)
            toast({
                variant: "destructive",
                title: "Erro na geração",
                description: err.message
            })
        }
    })

    const handleGenerate = () => {
        const preferences: AIProtocolPreferences = {
            goal,
            workoutSplit: workoutSplit === 'other' ? customSplit : workoutSplit,
            trainingVolume,
            strongMuscles,
            weakMuscles,
            cardioLikes: cardioLikes.join(', '),
            cardioDislikes: cardioDislikes.join(', '),
            mealsPerDay,
            foodLikes,
            foodDislikes,
            dietaryRestrictions,
        }
        generateMutate({ preferences })
    }

    // ── Success Screen ────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="flex flex-col items-center gap-8 py-8 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-[60px] opacity-30 rounded-full" />
                    <div className="relative w-24 h-24 bg-orange-500/10 border border-orange-500/30 rounded-system flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-orange-400" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        Protocolo <span className="text-orange-500">Gerado!</span>
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium max-w-xs mx-auto">
                        Seu protocolo completo está pronto e já foi adicionado ao seu dashboard.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {[
                        { label: 'Treinos', value: success.workoutsCount, icon: Dumbbell },
                        { label: 'Cardios', value: success.cardiosCount, icon: Activity },
                        { label: 'Calorias', value: `${success.targetCalories} kcal`, icon: Zap },
                        { label: 'Proteína', value: `${success.proteinG}g`, icon: Utensils },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-zinc-900/60 border border-zinc-800 rounded-system p-4">
                            <Icon className="w-4 h-4 text-orange-500 mb-2" />
                            <p className="text-xl font-black italic text-white">{value}</p>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
                        </div>
                    ))}
                </div>
                <Button
                    onClick={() => {
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all(userId) })
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.all(userId) })
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diets.all(userId) })
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ergogenics.all(userId) })
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.student.all(userId) })
                        router.push('/dashboard/student')
                    }}
                    className="h-12 px-10 rounded-system bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl"
                >
                    Ver Meu Dashboard
                    <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Step progress bar — dots on mobile, labeled on sm+ */}
            <div className="flex items-center gap-1">
                {STEPS.map((s, i) => {
                    const Icon = STEP_ICONS[s]
                    const isActive = s === step
                    const isDone = STEPS.indexOf(step) > i
                    return (
                        <div key={s} className="flex items-center gap-1 flex-1">
                            <div className={cn(
                                "flex items-center justify-center gap-1.5 rounded-system text-[9px] font-black uppercase tracking-widest transition-all duration-300 shrink-0",
                                "px-2 py-1.5",
                                isActive ? "bg-orange-500/20 border border-orange-500/40 text-orange-400"
                                    : isDone ? "text-orange-500/60"
                                        : "text-zinc-700"
                            )}>
                                <Icon className="w-3 h-3" />
                                <span className="hidden sm:block">{STEP_LABELS[s]}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-[1px] transition-all duration-500",
                                    isDone ? "bg-orange-500/50" : "bg-zinc-800"
                                )} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step content */}
            <div className="min-h-[240px] sm:min-h-[280px]">

                {/* Step 1: Goal */}
                {step === 'goal' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Objetivo</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">O que buscamos agora?</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <SelectCard 
                                label="Bulking" 
                                sub="Ganho de massa muscular e força" 
                                selected={goal === 'bulking'} 
                                onClick={() => setGoal('bulking')} 
                            />
                            <SelectCard 
                                label="Cutting" 
                                sub="Perda de gordura e definição" 
                                selected={goal === 'cutting'} 
                                onClick={() => setGoal('cutting')} 
                            />
                            <SelectCard 
                                label="Manutenção" 
                                sub="Manter o peso e melhorar qualidade" 
                                selected={goal === 'maintenance'} 
                                onClick={() => setGoal('maintenance')} 
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Workout Split */}
                {step === 'workout' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Divisão de Treino</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Qual divisão você prefere?</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SPLITS.map(s => (
                                <SelectCard key={s.value} label={s.label} sub={s.sub} selected={workoutSplit === s.value} onClick={() => setWorkoutSplit(s.value)} />
                            ))}
                            <SelectCard label="Outra" sub="Descreva abaixo" selected={workoutSplit === 'other'} onClick={() => setWorkoutSplit('other')} />
                        </div>
                        {workoutSplit === 'other' && (
                            <Input
                                placeholder="Descreva sua divisão preferida..."
                                value={customSplit}
                                onChange={e => setCustomSplit(e.target.value)}
                            />
                        )}

                        {/* Volume */}
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Volume de Treino</p>
                            <div className="grid grid-cols-2 gap-3">
                                <SelectCard
                                    label="Low Volume"
                                    sub="Menos séries, alta intensidade"
                                    selected={trainingVolume === 'low'}
                                    onClick={() => setTrainingVolume('low')}
                                />
                                <SelectCard
                                    label="High Volume"
                                    sub="Mais séries, volume elevado"
                                    selected={trainingVolume === 'high'}
                                    onClick={() => setTrainingVolume('high')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Priorities */}
                {step === 'priorities' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Pontos Fortes e Fracos</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Quais músculos precisamos focar?</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">💪 Pontos Fortes (Manutenção)</p>
                                <TextArea 
                                    placeholder="Ex: Peitoral, Braços..." 
                                    value={strongMuscles} 
                                    onChange={setStrongMuscles} 
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">🎯 Pontos Fracos (Prioridade IA)</p>
                                <TextArea 
                                    placeholder="Ex: Dorsais, Pernas (Quadríceps)..." 
                                    value={weakMuscles} 
                                    onChange={setWeakMuscles} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Cardio */}
                {step === 'cardio' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Preferências de Cardio</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">O que você curte e o que não curte?</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">✅ Gosto de</p>
                                <div className="flex flex-wrap gap-2">
                                    {CARDIO_OPTIONS.map(c => (
                                        <ToggleChip key={c} label={c} selected={cardioLikes.includes(c)}
                                            onClick={() => setCardioLikes(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">❌ Não gosto de</p>
                                <div className="flex flex-wrap gap-2">
                                    {CARDIO_OPTIONS.map(c => (
                                        <ToggleChip key={c} label={c} selected={cardioDislikes.includes(c)}
                                            onClick={() => setCardioDislikes(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Diet */}
                {step === 'diet' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Preferências Alimentares</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Personalize seu plano alimentar</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Refeições por dia</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {MEALS_OPTIONS.map(m => (
                                        <NumberCard key={m} value={m} label="refeições" selected={mealsPerDay === m} onClick={() => setMealsPerDay(m)} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Alimentos que gosta</p>
                                <TextArea placeholder="Ex: Frango, batata doce, arroz, ovos, frutas..." value={foodLikes} onChange={setFoodLikes} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Alimentos que não gosta / Restrições</p>
                                <TextArea placeholder="Ex: Brócolis, leite, glúten, lactose..." value={foodDislikes} onChange={v => setFoodDislikes(v)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirm */}
                {step === 'confirm' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Pronto para Gerar!</h3>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Revise e confirme antes de gerar</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Objetivo', value: goal === 'bulking' ? 'Bulking' : goal === 'cutting' ? 'Cutting' : 'Manutenção', icon: Zap },
                                { label: 'Divisão', value: SPLITS.find(s => s.value === workoutSplit)?.label || customSplit, icon: Dumbbell },
                                { label: 'Cardio', value: cardioLikes.length > 0 ? cardioLikes.slice(0, 2).join(', ') : 'Qualquer', icon: Activity },
                                { label: 'Refeições', value: `${mealsPerDay} por dia`, icon: Utensils },
                            ].map(({ label, value, icon: Icon }) => (
                                <div key={label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-system p-4">
                                    <Icon className="w-4 h-4 text-orange-500 mb-2" />
                                    <p className="text-sm font-black italic text-white truncate">{value}</p>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 rounded-system bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-start gap-3">
                                <span className="mt-0.5">⚠️</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            onClick={handleGenerate}
                            /* ❌ UI BLOCKING REMOVED */ disabled={false}
                            className="w-full min-h-14 h-auto py-4 rounded-system bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-2xl shadow-orange-500/20 text-base active:scale-95 [&]:whitespace-normal"
                        >
                            {loading ? (
                                <span className="flex flex-col items-center gap-1">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm leading-tight">Gerando protocolo<br />completo...</span>
                                </span>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 shrink-0" />
                                    Gerar Protocolo com IA
                                </>
                            )}
                        </Button>
                        {loading && (
                            <p className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Isso pode levar 30 a 60 segundos...
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            {step !== 'confirm' && (
                <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800/50">
                    {/* Progress bar — full width above buttons */}
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                    {/* Nav buttons */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={prev}
                            disabled={stepIdx === 0}
                            className="h-10 px-5 rounded-system bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px] disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Voltar
                        </Button>
                        <Button
                            onClick={next}
                            disabled={!canGoNext()}
                            className="h-10 px-5 rounded-system bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] disabled:opacity-40 transition-all"
                        >
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
            {step === 'confirm' && stepIdx > 0 && (
                <Button
                    variant="ghost"
                    onClick={prev}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Revisar preferências
                </Button>
            )}
        </div>
    )
}


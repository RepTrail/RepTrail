'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, Calendar, X, Timer, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { useQueryClient, QueryKey } from '@tanstack/react-query'

import { assignCardio, removeCardioAssignment } from '@/actions/cardio-actions'
import { assignDiet, unassignDiet } from '@/actions/diet-actions'
import { assignWorkout, unassignWorkout } from '@/actions/workout-actions'
import { assignErgogenic } from '@/actions/student-content-actions'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

import { cn } from '@/lib/utils'

interface UnifiedAssignDialogProps {
    title: string
    description: string
    students?: any[]
    items?: any[]
    itemId?: string
    fixedStudentId?: string
    initialStudentId?: string
    initialStudentName?: string
    assignmentId?: string
    type: 'workout' | 'diet' | 'cardio' | 'ergogenic'
    trigger?: React.ReactNode
    initialDays?: number[]
    colorScheme?: 'orange' | 'emerald'
    queryKey?: QueryKey
}

const WEEKDAYS = [
    { label: 'D', value: 0, full: 'Domingo' },
    { label: 'S', value: 1, full: 'Segunda-feira' },
    { label: 'T', value: 2, full: 'Terça-feira' },
    { label: 'Q', value: 3, full: 'Quarta-feira' },
    { label: 'Q', value: 4, full: 'Quinta-feira' },
    { label: 'S', value: 5, full: 'Sexta-feira' },
    { label: 'S', value: 6, full: 'Sábado' },
]

export function UnifiedAssignDialog({
    title,
    description,
    students = [],
    items = [],
    itemId,
    type,
    trigger,
    fixedStudentId,
    initialStudentId,
    initialStudentName,
    assignmentId: providedAssignmentId,
    initialDays = [],
    colorScheme: providedColorScheme,
    queryKey
}: UnifiedAssignDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>(initialStudentId || fixedStudentId || '')
    const [selectedItem, setSelectedItem] = useState<string>(itemId || '')
    const [selectedDays, setSelectedDays] = useState<number[]>((initialDays as number[]) || [])
    const [assignmentId, setAssignmentId] = useState<string>(providedAssignmentId || '')
    const [duration, setDuration] = useState('30')
    const [intensity, setIntensity] = useState('Moderada')

    const queryClient = useQueryClient()
    const router = useRouter()
    const { toast } = useToast()

    const initialDaysStr = JSON.stringify(initialDays || [])
    
    React.useEffect(() => {
        if (open) {
            setSelectedStudent(initialStudentId || fixedStudentId || '')
            setSelectedItem(itemId || '')
            setAssignmentId(providedAssignmentId || '')
            const daysValues = Array.isArray(initialDays) ? initialDays : (initialDays ? [initialDays] : [])
            const numericDays = (daysValues || []).map((d: any) => parseInt(d.toString())).filter((n: any) => !isNaN(n))
            setSelectedDays(numericDays as number[])
        }
    }, [open, initialStudentId, fixedStudentId, itemId, initialDaysStr, providedAssignmentId])

    // Config based on type
    const configs = {
        workout: {
            color: 'orange',
            primary: 'emerald-500',
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-orange-500/20',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-none'
        },
        diet: {
            color: 'orange',
            primary: 'orange-500',
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-none',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-none'
        },
        cardio: {
            color: 'orange',
            primary: 'orange-500',
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-none',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-none'
        },
        ergogenic: {
            color: 'orange',
            primary: 'orange-500',
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-none',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-none'
        }
    }

    const config = { ...configs[type] }
    if (providedColorScheme === 'orange') {
        config.color = 'orange'
        config.primary = 'orange-500'
        config.btnGradient = 'from-orange-600 to-orange-400'
        config.btnHover = 'hover:from-orange-500 hover:to-orange-300'
        config.btnShadow = 'shadow-orange-500/20'
        config.daySelected = 'bg-orange-500 text-zinc-950 shadow-orange-500/30'
    } else if (providedColorScheme === 'emerald') {
        config.color = 'emerald'
        config.primary = 'emerald-500'
        config.btnGradient = 'from-emerald-600 to-emerald-400'
        config.btnHover = 'hover:from-emerald-500 hover:to-emerald-300'
        config.btnShadow = 'shadow-emerald-500/20'
        config.daySelected = 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
    }

    const toggleDay = (day: number) => {
        const currentDays = selectedDays || []
        if (type === 'workout') {
            setSelectedDays(currentDays.includes(day) ? [] : [day])
        } else {
            setSelectedDays(prev => {
                const p = prev || []
                return p.includes(day) ? p.filter(d => d !== day) : [...p, day].sort()
            })
        }
    }

    const { mutate } = useOptimisticMutation({
        queryKey: queryKey || [type],
        actionName: `assign-${type}`,
        entity: type === 'workout' ? ENTITIES.ASSIGNED_WORKOUT : type === 'diet' ? ENTITIES.DIET : type === 'cardio' ? ENTITIES.CARDIO : ENTITIES.ERGOGENIC,
        entityId: 'new',
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
        updateFn: (oldData: any, variables: any) => {
            if (!queryKey) return oldData
            const optimisticItem = {
                ...variables,
                id: crypto.randomUUID(),
                _optimistic: true,
                created_at: new Date().toISOString()
            }
            if (Array.isArray(oldData)) return [optimisticItem, ...oldData]
            return oldData
        },
        onMutate: () => {
            setOpen(false) // 🚀 LOCAL-FIRST: close instantly
        },
        onSuccess: () => {
            toast({ title: "Sucesso!", description: "Atribuição realizada com sucesso." })
        },
        onError: (err) => {
            toast({ variant: 'destructive', title: 'Erro', description: err.message })
        }
    })

    function handleAssign() {
        if (!selectedStudent) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione um aluno.' })
            return
        }
        if (selectedDays.length === 0) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione pelo menos um dia.' })
            return
        }

        const payload: Record<string, any> = {
            student_id: selectedStudent,
            daysOfWeek: selectedDays,
        }

        if (type === 'cardio') {
            payload.cardio_id = selectedItem
            payload.duration = parseInt(duration)
            payload.intensity = intensity
        } else if (type === 'workout') {
            payload.workout_id = selectedItem
            payload.day_of_week = selectedDays[0]
        } else if (type === 'diet') {
            payload.diet_id = selectedItem
        } else if (type === 'ergogenic') {
            payload.ergogenic_id = selectedItem
        }

        mutate(payload)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white rounded-system h-10  gap-2 transition-all active:scale-95">
                        <UserPlus className="w-4 h-4" /> Atribuir
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader className="relative">
                    <DialogTitle className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter leading-tight">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-black mt-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 py-2">
                    {((items.length > 0 && !itemId) || !fixedStudentId) && (
                        <div className="space-y-4">
                             <div className="flex items-center gap-2 px-1">
                                <UserPlus className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destinatário & Protocolo</span>
                            </div>
                            
                            <div className="space-y-4">
                                {items.length > 0 && !itemId && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Protocolo</Label>
                                        <Select onValueChange={setSelectedItem} value={selectedItem}>
                                            <SelectTrigger className={cn("w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-system hover:border-zinc-700 transition-all font-bold", config.color === 'emerald' ? "focus:ring-emerald-500/20" : "focus:ring-orange-500/20")}>
                                                <SelectValue placeholder="Escolha um protocolo..." />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="bg-zinc-900 border-zinc-800 text-white rounded-system p-2 shadow-2xl border-white/5 animate-in fade-in zoom-in duration-200 z-[100001]">
                                                {items.map((i) => (
                                                    <SelectItem key={i.id} value={i.id} className={cn("rounded-system px-3 py-2.5 font-bold transition-all mb-1 last:mb-0", config.color === 'emerald' ? "focus:bg-emerald-500/10 focus:text-emerald-500" : "focus:bg-orange-500/10 focus:text-orange-500")}>
                                                        {i.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {!fixedStudentId && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Aluno</Label>
                                        {(students || []).length > 0 ? (
                                            <Select key={`${initialStudentId}-${initialDaysStr}-${open}`} value={selectedStudent} onValueChange={setSelectedStudent}>
                                                <SelectTrigger className={cn("w-full h-14 bg-zinc-900/50 border-zinc-800 rounded-system text-white font-bold text-xs ring-offset-zinc-950 transition-all flex items-center justify-between px-4", config.color === 'emerald' ? "focus:ring-emerald-500/20" : "focus:ring-orange-500/20")}>
                                                    <SelectValue placeholder="Selecione o aluno" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-system z-[100001]" position="popper" sideOffset={5}>
                                                    {initialStudentId && !students.some(s => s.student_id === initialStudentId) && (
                                                       <SelectItem value={initialStudentId} className="focus:bg-zinc-800 focus:text-white">
                                                           <span className="font-bold text-xs uppercase tracking-tight text-zinc-400">
                                                               {initialStudentName || initialStudentId} (Inativo/Outro)
                                                           </span>
                                                       </SelectItem>
                                                    )}
                                                    {(students || []).map((s) => (
                                                        <SelectItem
                                                            key={s.student_id}
                                                            value={s.student_id}
                                                            className={cn("text-zinc-300 rounded-system py-3 focus:bg-zinc-800 focus:text-white", config.color === 'emerald' ? "focus:bg-emerald-500/10 focus:text-white" : "focus:bg-orange-500/10 focus:text-white")}
                                                        >
                                                            <span className="font-bold text-xs uppercase tracking-tight">{s.student?.full_name || 'Aluno sem nome'}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-4 rounded-system border border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center gap-2">
                                                <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nenhum aluno ativo</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {type === 'cardio' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <Activity className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Configuração do Cardio</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Duração (min)</Label>
                                    <div className="relative group">
                                        <Timer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                                        <Input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="bg-zinc-900/50 border-zinc-800 !h-14 rounded-system text-white font-bold pl-11 focus:border-orange-500/50 focus:ring-orange-500/10"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Intensidade</Label>
                                    <Select value={intensity} onValueChange={setIntensity}>
                                        <SelectTrigger className="w-full !h-14 bg-zinc-900/50 border-zinc-800 rounded-system text-white font-bold text-xs ring-offset-zinc-950 transition-all focus:border-orange-500/50 focus:ring-orange-500/10">
                                            <SelectValue placeholder="Moderada" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 rounded-system z-[100001]">
                                            {['Leve', 'Moderada', 'Intensa', 'HIIT'].map(opt => (
                                                <SelectItem key={opt} value={opt} className="text-zinc-300 rounded-system py-3 focus:bg-orange-500/10 focus:text-white font-bold text-xs uppercase">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {type === 'workout' ? 'Dia Programado' : 'Dias da Semana'}
                            </span>
                        </div>
                        <div className="flex justify-between gap-1.5 h-14 p-1.5 bg-zinc-900/40 rounded-system border border-zinc-800/50 shadow-inner">
                            {WEEKDAYS.map((day) => {
                                const isSelected = (selectedDays || []).includes(day.value)
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={cn(
                                            "flex-1 rounded-system text-[10px] font-black transition-all active:scale-90",
                                            isSelected
                                                ? config.daySelected
                                                : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            onClick={handleAssign}
                            className={cn("h-14 w-full rounded-system font-black uppercase tracking-wider text-[11px] italic transition-all active:scale-95 shadow-lg", config.color === 'emerald' ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/20" : "bg-orange-500 text-zinc-950 hover:bg-orange-400 shadow-orange-500/20")}
                        >
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Confirmar Atribuição
                            </div>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}


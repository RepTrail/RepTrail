
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, Calendar, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

interface UnifiedAssignDialogProps {
    title: string
    description: string
    students?: any[]
    items?: any[]
    itemId?: string
    fixedStudentId?: string
    type: 'workout' | 'diet' | 'cardio' | 'ergogenic'
    trigger?: React.ReactNode
    initialDays?: number[]
    colorScheme?: 'orange' | 'emerald'
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
    initialDays = [],
    colorScheme: providedColorScheme
}: UnifiedAssignDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>(fixedStudentId || '')
    const [selectedItem, setSelectedItem] = useState<string>(itemId || '')
    const [selectedDays, setSelectedDays] = useState<number[]>(initialDays)

    // Sync initialDays when dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        if (open) {
            setSelectedDays(initialDays || [])
        }
        // JSON.stringify prevents infinite loop from array reference changing every render
    }, [open, JSON.stringify(initialDays)])

    const { toast } = useToast()
    const router = useRouter()

    // Config based on type
    const configs = {
        workout: {
            color: 'orange',
            primary: 'emerald-500', // Accent for days
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-orange-500/20',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-orange-500/30'
        },
        diet: {
            color: 'emerald',
            primary: 'emerald-500',
            btnGradient: 'from-emerald-600 to-emerald-400',
            btnHover: 'hover:from-emerald-500 hover:to-emerald-300',
            btnShadow: 'shadow-emerald-500/20',
            daySelected: 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
        },
        cardio: {
            color: 'orange',
            primary: 'orange-500',
            btnGradient: 'from-orange-600 to-orange-400',
            btnHover: 'hover:from-orange-500 hover:to-orange-300',
            btnShadow: 'shadow-orange-500/20',
            daySelected: 'bg-orange-500 text-zinc-950 shadow-orange-500/30'
        },
        ergogenic: {
            color: 'emerald',
            primary: 'emerald-500',
            btnGradient: 'from-emerald-600 to-emerald-400',
            btnHover: 'hover:from-emerald-500 hover:to-emerald-300',
            btnShadow: 'shadow-emerald-500/20',
            daySelected: 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
        }
    }

    // Override color scheme if provided
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
        if (type === 'workout') {
            setSelectedDays([day])
        } else {
            setSelectedDays(prev =>
                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
            )
        }
    }

    async function handleAssign() {
        if (!selectedStudent) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione um aluno.' })
            return
        }
        if (selectedDays.length === 0) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione pelo menos um dia.' })
            return
        }

        setLoading(true)
        try {
            let res: any

            if (type === 'cardio') {
                const { assignCardioToStudent } = await import('@/actions/student-content-actions')
                res = await assignCardioToStudent(selectedItem, {
                    daysOfWeek: selectedDays
                })
            } else if (type === 'workout') {
                const { assignWorkout } = await import('@/actions/workout-actions')
                res = await assignWorkout(selectedItem, selectedStudent, selectedDays[0])
            } else if (type === 'diet') {
                const { assignDiet } = await import('@/actions/diet-actions')
                res = await assignDiet(selectedItem, selectedStudent, selectedDays)
            } else if (type === 'ergogenic') {
                const { assignErgogenic } = await import('@/actions/student-content-actions')
                res = await assignErgogenic(selectedItem, selectedDays)
            }

            if (res?.success || !res?.error) {
                setOpen(false)
                toast({ title: "Sucesso!", description: "Atribuição realizada com sucesso." })
                router.refresh()
            } else {
                toast({ variant: 'destructive', title: 'Erro', description: res?.error || 'Algo deu errado.' })
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white rounded-xl h-10  gap-2 transition-all active:scale-95">
                        <UserPlus className="w-4 h-4" /> Atribuir
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader className="relative">
                    <DialogTitle className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter leading-tight">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-10">
                    {items.length > 0 && !itemId && (
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Selecione o Item</Label>
                            <Select onValueChange={setSelectedItem} value={selectedItem}>
                                <SelectTrigger className={cn("w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl hover:border-zinc-700 transition-all font-bold ", config.color === 'orange' ? 'focus:ring-orange-500/20' : 'focus:ring-emerald-500/20')}>
                                    <SelectValue placeholder="Escolha um protocolo..." />
                                </SelectTrigger>
                                <SelectContent position="popper" className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-2 shadow-2xl border-white/5 animate-in fade-in zoom-in duration-200">
                                    {items.map((i) => (
                                        <SelectItem key={i.id} value={i.id} className={cn("rounded-xl px-3 py-2.5 font-bold transition-all mb-1 last:mb-0", config.color === 'orange' ? 'focus:bg-orange-500/10 focus:text-orange-500' : 'focus:bg-emerald-500/10 focus:text-emerald-500')}>
                                            {i.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {students.length > 0 && !fixedStudentId && (
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Selecione o Aluno</Label>
                            <Select onValueChange={setSelectedStudent} value={selectedStudent}>
                                <SelectTrigger className={cn("w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl hover:border-zinc-700 transition-all font-bold ", config.color === 'orange' ? 'focus:ring-orange-500/20' : 'focus:ring-emerald-500/20')}>
                                    <SelectValue placeholder="Escolha um aluno da lista..." />
                                </SelectTrigger>
                                <SelectContent position="popper" className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-2 shadow-2xl border-white/5 animate-in fade-in zoom-in duration-200">
                                    {students.map((s) => (
                                        <SelectItem key={s.student_id} value={s.student_id} className={cn("rounded-xl px-3 py-2.5 font-bold transition-all mb-1 last:mb-0", config.color === 'orange' ? 'focus:bg-orange-500/10 focus:text-orange-500' : 'focus:bg-emerald-500/10 focus:text-emerald-500')}>
                                            {s.student?.full_name || s.student?.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}



                    <div className="space-y-5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {type === 'workout' ? 'Dia Programado' : 'Dias da Semana'}
                        </Label>
                        <div className="flex justify-between gap-1.5 sm:gap-2 h-14 p-1.5 sm:p-2 bg-zinc-900/40 rounded-[1.5rem] border border-zinc-800/50 shadow-inner">
                            {WEEKDAYS.map((day) => {
                                const isSelected = selectedDays.includes(day.value)
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={cn(
                                            "flex-1 rounded-[1rem] text-[10px] sm:text-[11px] font-black transition-all active:scale-90",
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

                    <DialogFooter className="pt-4 sm:pt-6">
                        <Button
                            onClick={handleAssign}
                            disabled={loading}
                            className={cn(
                                "w-full h-14 sm:h-16 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-[0.98] shadow-2xl group overflow-hidden relative",
                                "bg-gradient-to-r text-zinc-950",
                                config.btnGradient,
                                config.btnHover,
                                config.btnShadow
                            )}
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <UserPlus className="w-5 h-5 mr-3" />}
                            <span className="relative z-10">Confirmar Atribuição</span>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

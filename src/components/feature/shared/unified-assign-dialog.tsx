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
import { Input } from "@/components/ui/input"
import { UserPlus, Loader2, Calendar } from "lucide-react"
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
    type: 'workout' | 'diet' | 'cardio'
    trigger?: React.ReactNode
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
    fixedStudentId
}: UnifiedAssignDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>(fixedStudentId || '')
    const [selectedItem, setSelectedItem] = useState<string>(itemId || '')
    const [selectedDays, setSelectedDays] = useState<number[]>([1])

    // Cardio specific
    const [duration, setDuration] = useState('30')
    const [intensity, setIntensity] = useState('Moderada')

    const { toast } = useToast()
    const router = useRouter()

    const toggleDay = (day: number) => {
        if (type === 'workout') {
            setSelectedDays([day]) // Workout is usually one day at a time in this flow
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

            // Call the appropriate server action based on type
            if (type === 'cardio') {
                const { assignCardioToStudent } = await import('@/actions/student-content-actions')
                res = await assignCardioToStudent(selectedItem, {
                    duration: parseInt(duration),
                    intensity: intensity,
                    daysOfWeek: selectedDays
                })
            } else if (type === 'workout') {
                const { assignWorkout } = await import('@/actions/workout-actions')
                res = await assignWorkout(selectedItem, selectedStudent, selectedDays[0])
            } else if (type === 'diet') {
                const { assignDiet } = await import('@/actions/diet-actions')
                res = await assignDiet(selectedItem, selectedStudent, selectedDays)
            } else {
                throw new Error('Invalid type')
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
                    <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white rounded-xl h-10 px-4 gap-2 transition-all active:scale-95">
                        <UserPlus className="w-4 h-4" /> Atribuir
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-zinc-950 text-white border-zinc-800 rounded-[2.5rem] shadow-2xl p-0 border-white/5 overflow-hidden backdrop-blur-xl">
                <DialogHeader className="p-10 pb-8 bg-zinc-900/30 border-b border-zinc-900/50">
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none tracking-tight">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-10 space-y-8">
                    {items.length > 0 && !itemId && (
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Selecione o Item</Label>
                            <Select onValueChange={setSelectedItem}>
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl focus:ring-emerald-500/20 hover:border-zinc-700 transition-all font-bold px-4">
                                    <SelectValue placeholder="Escolha um protocolo..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-1">
                                    {items.map((i) => (
                                        <SelectItem key={i.id} value={i.id} className="focus:bg-emerald-500/10 focus:text-emerald-500 rounded-xl m-1 font-bold">
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
                            <Select onValueChange={setSelectedStudent}>
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl focus:ring-emerald-500/20 hover:border-zinc-700 transition-all font-bold px-4">
                                    <SelectValue placeholder="Escolha um aluno da lista..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-2xl">
                                    {students.map((s) => (
                                        <SelectItem key={s.student_id} value={s.student_id} className="focus:bg-emerald-500/10 focus:text-emerald-500 rounded-xl m-1">
                                            {s.student?.full_name || s.student?.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {type === 'cardio' && (
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Duração (min)</Label>
                                <Input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl focus:ring-orange-500/20 hover:border-zinc-700 transition-all font-bold text-center px-4"
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Intensidade</Label>
                                <Select value={intensity} onValueChange={setIntensity}>
                                    <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 !h-14 rounded-2xl focus:ring-orange-500/20 hover:border-zinc-700 transition-all font-bold px-4">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-1">
                                        <SelectItem value="Leve" className="rounded-xl m-1 font-bold">Leve</SelectItem>
                                        <SelectItem value="Moderada" className="rounded-xl m-1 font-bold">Moderada</SelectItem>
                                        <SelectItem value="Alta" className="rounded-xl m-1 font-bold">Alta</SelectItem>
                                        <SelectItem value="Máxima" className="rounded-xl m-1 font-bold">Máxima</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {type === 'workout' ? 'Dia Programado' : 'Dias da Semana'}
                        </Label>
                        <div className="flex justify-between gap-2 h-14 p-2 bg-zinc-900/40 rounded-[1.5rem] border border-zinc-800/50 shadow-inner">
                            {WEEKDAYS.map((day) => {
                                const isSelected = selectedDays.includes(day.value)
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={cn(
                                            "flex-1 rounded-[1rem] text-[11px] font-black transition-all active:scale-90",
                                            isSelected
                                                ? type === 'workout' ? "bg-orange-500 text-zinc-950 shadow-lg shadow-orange-500/30" : "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30"
                                                : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <DialogFooter className="pt-6">
                        <Button
                            onClick={handleAssign}
                            disabled={loading}
                            className={cn(
                                "w-full h-16 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-[0.98] shadow-2xl group overflow-hidden relative",
                                type === 'workout'
                                    ? "bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-zinc-950"
                                    : "bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-zinc-950"
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

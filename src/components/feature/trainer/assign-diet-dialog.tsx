'use client'

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
import { UserPlus, Loader2 } from "lucide-react"
import { assignDiet } from '@/actions/diet-actions'

interface AssignDietDialogProps {
    dietId: string
    students: any[]
}

export function AssignDietDialog({ dietId, students }: AssignDietDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>('')
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])

    const days = [
        { label: 'D', value: 0 },
        { label: 'S', value: 1 },
        { label: 'T', value: 2 },
        { label: 'Q', value: 3 },
        { label: 'Q', value: 4 },
        { label: 'S', value: 5 },
        { label: 'S', value: 6 },
    ]

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day))
        } else {
            setSelectedDays([...selectedDays, day])
        }
    }

    async function handleAssign() {
        if (!selectedStudent) return alert('Selecione um aluno.')
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.')

        setLoading(true)
        const result = await assignDiet(dietId, selectedStudent, selectedDays)
        setLoading(false)

        if (result.success) {
            setOpen(false)
            alert('Dieta atribuída com sucesso!')
        } else {
            alert(result.error || "Erro ao atribuir dieta.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Atribuir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Atribuir Dieta</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Escolha um aluno e os dias para este plano alimentar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aluno</Label>
                        <Select onValueChange={setSelectedStudent}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-12 rounded-xl">
                                <SelectValue placeholder="Selecione o aluno" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {students.map((s) => (
                                    <SelectItem key={s.student_id} value={s.student_id}>
                                        {s.student?.full_name || s.student?.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dias da Semana</Label>
                        <div className="flex justify-between gap-1">
                            {days.map((day) => {
                                const isSelected = selectedDays.includes(day.value)
                                return (
                                    <button
                                        key={day.value}
                                        onClick={() => toggleDay(day.value)}
                                        className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all border ${isSelected
                                                ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={loading} className="w-full h-12 bg-zinc-100 text-zinc-900 hover:bg-white rounded-xl font-black uppercase italic tracking-widest text-xs">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirmar Atribuição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

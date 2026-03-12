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
import { assignWorkout } from '@/actions/workout-actions'

interface AssignWorkoutDialogProps {
    workoutId: string
    students: any[]
}

const DAYS = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Segunda-feira' },
    { value: '2', label: 'Terça-feira' },
    { value: '3', label: 'Quarta-feira' },
    { value: '4', label: 'Quinta-feira' },
    { value: '5', label: 'Sexta-feira' },
    { value: '6', label: 'Sábado' },
]

export function AssignWorkoutDialog({ workoutId, students }: AssignWorkoutDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>('')
    const [selectedDay, setSelectedDay] = useState<string>('1') // Monday default

    async function handleAssign() {
        if (!selectedStudent) return alert('Selecione um aluno.')

        setLoading(true)
        const result = await assignWorkout(workoutId, selectedStudent, parseInt(selectedDay))
        setLoading(false)

        if (result.success) {
            setOpen(false)
            alert('Treino atribuído com sucesso!')
        } else {
            alert(result.error || "Erro ao atribuir treino.")
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atribuir Treino</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Escolha um aluno e o dia da semana para este treino.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Aluno</Label>
                        <Select onValueChange={setSelectedStudent}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
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
                    <div className="space-y-2">
                        <Label>Dia da Semana</Label>
                        <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {DAYS.map((day) => (
                                    <SelectItem key={day.value} value={day.value}>
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={loading} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirmar Atribuição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

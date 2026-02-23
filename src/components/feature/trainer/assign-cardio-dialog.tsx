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
import { Input } from "@/components/ui/input"
import { UserPlus, Loader2 } from "lucide-react"
import { assignCardio } from '@/actions/cardio-actions'
import { useRouter } from 'next/navigation'

interface AssignCardioDialogProps {
    cardioId: string
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

export function AssignCardioDialog({ cardioId, students }: AssignCardioDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>('')
    const [duration, setDuration] = useState('30')
    const [intensity, setIntensity] = useState('Moderada')
    const [selectedDays, setSelectedDays] = useState<number[]>([1]) // Monday default
    const router = useRouter()

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    async function handleAssign() {
        if (!selectedStudent) return alert('Selecione um aluno.')
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.')

        setLoading(true)
        const result = await assignCardio({
            studentId: selectedStudent,
            cardioId: cardioId,
            duration: parseInt(duration),
            intensity: intensity,
            daysOfWeek: selectedDays
        })
        setLoading(false)

        if (result.success) {
            setOpen(false)
            router.refresh()
            alert('Cardio atribuído com sucesso!')
        } else {
            alert(result.error || "Erro ao atribuir cardio.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white flex items-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest leading-none h-9 flex-1">
                    <UserPlus className="w-3 h-3" />
                    Atribuir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Atribuir Cardio</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Escolha um aluno e os dias da semana para este protocolo.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Aluno</Label>
                        <Select onValueChange={setSelectedStudent}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-xl h-12">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Duração (min)</Label>
                            <Input
                                type="number"
                                className="bg-zinc-900 border-zinc-800 rounded-xl h-12"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Intensidade</Label>
                            <Select value={intensity} onValueChange={setIntensity}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-xl h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="Leve">Leve</SelectItem>
                                    <SelectItem value="Moderada">Moderada</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                    <SelectItem value="Máxima">Máxima</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dias da Semana</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {DAYS.map((day) => (
                                <Button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(parseInt(day.value))}
                                    className={`
                                        h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 border-2
                                        ${selectedDays.includes(parseInt(day.value))
                                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105'
                                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800/70 hover:text-zinc-200 hover:border-zinc-600'}
                                    `}
                                >
                                    {day.label.substring(0, 3)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={loading} className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-600 font-black uppercase italic rounded-xl h-12 transition-all">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirmar Atribuição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

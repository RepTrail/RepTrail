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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { createStudentDiet } from '@/actions/student-content-actions'
import { useRouter } from 'next/navigation'

export function CreateDietDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
    const router = useRouter()

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

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.')
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append('daysOfWeek', JSON.stringify(selectedDays))
        const result = await createStudentDiet(formData)

        setLoading(false)

        if ((result as any)?.success) {
            setOpen(false)
            router.refresh()
        } else {
            alert((result as any)?.error || 'Erro ao criar dieta.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-zinc-900 hover:bg-zinc-200">
                    <Plus className="mr-2 h-4 w-4" /> Criar Manualmente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Nova Dieta</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Crie um plano alimentar para seu auto-treino.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Dieta</Label>
                        <Input id="name" name="name" placeholder="Ex: Dieta para Secar (Low Carb)" required className="bg-zinc-900 border-zinc-800 h-12 rounded-xl" />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dias da Semana</Label>
                        <div className="flex justify-between gap-1">
                            {days.map((day) => {
                                const isSelected = selectedDays.includes(day.value)
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
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
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Salvar Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { createStudentErgogenic } from '@/actions/student-content-actions'
import { useRouter } from 'next/navigation'

const DAYS = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Segunda-feira' },
    { value: '2', label: 'Terça-feira' },
    { value: '3', label: 'Quarta-feira' },
    { value: '4', label: 'Quinta-feira' },
    { value: '5', label: 'Sexta-feira' },
    { value: '6', label: 'Sábado' },
]

export function CreateErgogenicDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [unit, setUnit] = useState<'ml' | 'mg'>('ml')
    const [selectedDays, setSelectedDays] = useState<number[]>([1]) // Monday default
    const router = useRouter()

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.set('unit', unit)
        formData.set('application_days', JSON.stringify(selectedDays))

        const result = await createStudentErgogenic(formData)
        setLoading(false)

        if ((result as any)?.success) {
            setOpen(false)
            router.refresh()
        } else {
            alert((result as any)?.error || 'Erro ao criar ergogênico.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold uppercase italic tracking-tight rounded-xl h-11">
                    <Plus className="mr-2 h-4 w-4" /> Criar Ergogênico
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] bg-zinc-950 text-white border-zinc-800 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Novo Ergogênico</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Adicione um item ao seu protocolo farmacológico.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome do Ergogênico</Label>
                        <Input id="name" name="name" required className="bg-zinc-900 border-zinc-800 rounded-xl h-12" placeholder="Ex: Testosterona" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weekly_dosage" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dose Semanal</Label>
                            <Input id="weekly_dosage" name="weekly_dosage" type="number" step="0.1" required className="bg-zinc-900 border-zinc-800 rounded-xl h-12" placeholder="500" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Unidade</Label>
                            <div className="flex items-center gap-3 pb-4 h-12  bg-zinc-900 border-zinc-800 rounded-xl">
                                <span className={`text-sm font-medium transition-colors ${!unit ? 'text-emerald-500' : 'text-zinc-400'}`}>ml</span>
                                <Switch
                                    checked={unit === 'mg'}
                                    onCheckedChange={(checked) => setUnit(checked ? 'mg' : 'ml')}
                                />
                                <span className={`text-sm font-medium transition-colors ${unit === 'mg' ? 'text-emerald-500' : 'text-zinc-400'}`}>mg</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dias de Aplicação</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Observações (Opcional)</Label>
                        <Textarea id="notes" name="notes" className="bg-zinc-900 border-zinc-800 rounded-xl" placeholder="Instruções especiais..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-emerald-500 text-zinc-900 hover:bg-emerald-600 font-black uppercase italic rounded-xl h-12 transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Salvar Ergogênico
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pencil, Check } from "lucide-react"
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { cn } from '@/lib/utils'

const DAYS = [
    { value: '0', label: 'D' },
    { value: '1', label: 'S' },
    { value: '2', label: 'T' },
    { value: '3', label: 'Q' },
    { value: '4', label: 'Q' },
    { value: '5', label: 'S' },
    { value: '6', label: 'S' },
]

interface EditErgogenicDialogProps {
    userId: string
    ergogenic: {
        id: string
        name: string
        dosage?: string | null
        weekly_dosage?: number | null
        unit?: string | null
        application_days?: any
        notes?: string | null
        frequency?: string | null
    }
}

export function EditErgogenicDialog({ userId, ergogenic }: EditErgogenicDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(ergogenic.name)
    const [dosage, setDosage] = useState(ergogenic.dosage || '')
    const [frequency, setFrequency] = useState(ergogenic.frequency || '')
    const [notes, setNotes] = useState(ergogenic.notes || '')
    const [unit, setUnit] = useState<'ml' | 'mg' | 'un'>((ergogenic.unit || 'ml') as any)
    const [selectedDays, setSelectedDays] = useState<number[]>(
        Array.isArray(ergogenic.application_days) ? ergogenic.application_days : []
    )
    
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        actionName: 'update-student-ergogenic',
        entity: ENTITIES.ERGOGENIC,
        entityId: ergogenic.id,
        mutationFn: async (variables: any) => variables,
        updateFn: (oldData: any = [], variables: any) => {
            const list = Array.isArray(oldData) ? oldData : (oldData?.data || [])
            const newList = list.map((item: any) =>
                item.id === ergogenic.id ? { ...item, ...variables } : item
            )
            return Array.isArray(oldData) ? newList : { ...oldData, data: newList }
        },
        onMutate: () => {
            setOpen(false)
        },
        onSuccess: () => {
            toast({ title: 'Protocolo atualizado!' })
        },
        onError: (err: any) => {
            toast({ variant: 'destructive', title: 'Erro', description: err.message })
        }
    })

    const toggleDay = (day: number) => {
        setSelectedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        )
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault()
        mutate({
            id: ergogenic.id,
            student_id: userId,
            name,
            dosage,
            frequency,
            notes,
            unit,
            application_days: selectedDays
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-system transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800 rounded-system">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Editar Protocolo</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Ajuste os detalhes do ergogênico.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome</Label>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="bg-zinc-900 border-zinc-800 rounded-system h-11 font-bold" 
                            required 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dosage" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dosagem</Label>
                            <Input 
                                id="dosage" 
                                value={dosage} 
                                onChange={e => setDosage(e.target.value)} 
                                className="bg-zinc-900 border-zinc-800 rounded-system h-11 font-bold" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Frequência</Label>
                            <Input 
                                id="frequency" 
                                value={frequency} 
                                onChange={e => setFrequency(e.target.value)} 
                                className="bg-zinc-900 border-zinc-800 rounded-system h-11 font-bold" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Unidade</Label>
                        <div className="flex bg-zinc-950/50 p-1 rounded-system border border-zinc-800/50 w-fit">
                            {[
                                { label: 'MG', value: 'mg' },
                                { label: 'ML', value: 'ml' },
                                { label: 'UN', value: 'un' }
                            ].map((opt) => {
                                const isActive = unit === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setUnit(opt.value as any)}
                                        className={cn(
                                            "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-system transition-all active:scale-95 flex items-center gap-1.5",
                                            isActive 
                                                ? "bg-emerald-500 text-zinc-950 shadow-lg" 
                                                : "text-zinc-600 hover:text-white"
                                        )}
                                    >
                                        {isActive && <Check className="w-3 h-3" />}
                                        {opt.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dias de Aplicação</Label>
                        <div className="flex justify-between gap-1 h-11 p-1 bg-zinc-900/40 rounded-system border border-zinc-800/50">
                            {DAYS.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(parseInt(day.value))}
                                    className={`flex-1 rounded-system text-[10px] font-black transition-all active:scale-90 ${
                                        selectedDays.includes(parseInt(day.value))
                                            ? 'bg-emerald-500 text-zinc-950 shadow-md'
                                            : 'text-zinc-600 hover:text-white hover:bg-zinc-800'
                                    }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Notas (Opcional)</Label>
                        <Textarea 
                            id="notes" 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            className="bg-zinc-900 border-zinc-800 rounded-system min-h-[80px]" 
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit" className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-600 font-black uppercase italic rounded-system h-12 transition-all">
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


'use client'

import { useState, useEffect } from 'react'
import {
    Plus,
    Trash2,
    Activity,
    Clock,
    Timer,
    ChevronRight,
    Search,
    Dumbbell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    getCardioLibrary,
    createCardio,
    assignCardio,
    removeCardioAssignment,
    getStudentCardioAssignments
} from '@/actions/cardio-actions'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

interface CardioAssignmentSectionProps {
    studentId: string
    relationshipId: string
}

export function CardioAssignmentSection({ studentId, relationshipId }: CardioAssignmentSectionProps) {
    const [assignments, setAssignments] = useState<any[]>([])
    const [library, setLibrary] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [isCreatingNew, setIsCreatingNew] = useState(false)

    const { toast } = useToast()

    // Form states
    const [selectedCardioId, setSelectedCardioId] = useState<string>('')
    const [duration, setDuration] = useState('30')
    const [intensity, setIntensity] = useState('Moderada')
    const [selectedDays, setSelectedDays] = useState<number[]>([1])

    const DAYS = [
        { value: '0', label: 'Domingo' },
        { value: '1', label: 'Segunda-feira' },
        { value: '2', label: 'Terça-feira' },
        { value: '3', label: 'Quarta-feira' },
        { value: '4', label: 'Quinta-feira' },
        { value: '5', label: 'Sexta-feira' },
        { value: '6', label: 'Sábado' },
        { value: '0', label: 'Dom' },
        { value: '1', label: 'Seg' },
        { value: '2', label: 'Ter' },
        { value: '3', label: 'Qua' },
        { value: '4', label: 'Qui' },
        { value: '5', label: 'Sex' },
        { value: '6', label: 'Sáb' },
    ]

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        try {
            const [a, l] = await Promise.all([
                getStudentCardioAssignments(studentId),
                getCardioLibrary()
            ])
            setAssignments(a)
            setLibrary(l)
        } catch (error) {
            console.error('CRITICAL: Error in CardioAssignmentSection loadData:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleAssign() {
        if (!selectedCardioId) return
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.')

        const res = await assignCardio({
            studentId,
            cardioId: selectedCardioId,
            duration: Number(duration),
            intensity,
            daysOfWeek: selectedDays
        })

        if (res.success) {
            toast({
                title: 'Sucesso',
                description: 'Cardio atribuído com sucesso!'
            })
            setIsAdding(false)
            loadData()
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao atribuir cardio'
            })
        }
    }

    async function handleRemove(id: string) {
        if (!confirm('Tem certeza que deseja remover este cardio?')) return

        const res = await removeCardioAssignment(id)
        if (res.success) {
            toast({
                title: 'Removido',
                description: 'Atribuição removida'
            })
            loadData()
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                    Cardios Atribuídos
                </h3>
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white text-[9px] uppercase font-black tracking-widest gap-2 bg-zinc-900/50 rounded-lg h-7">
                            Adicionar <Plus className="w-3 h-3" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[2rem] max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Atribuir Cardio</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Modelo de Cardio</Label>
                                <Select onValueChange={setSelectedCardioId}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-xl h-12">
                                        <SelectValue placeholder="Selecione um cardio..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {library.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 ml-1">
                                    Gerencie modelos na <Link href="/dashboard/trainer/cardio" className="text-orange-500 hover:underline">Biblioteca de Cardio</Link>
                                </p>
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
                                            variant="outline"
                                            onClick={() => toggleDay(parseInt(day.value))}
                                            className={`
                                                h-10 text-[9px] font-black uppercase tracking-tighter rounded-lg border-zinc-800 transition-all active:scale-90
                                                ${selectedDays.includes(parseInt(day.value))
                                                    ? 'bg-orange-500 text-zinc-950 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:bg-orange-400'
                                                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700'}
                                            `}
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                className="w-full bg-orange-500 text-zinc-950 hover:bg-orange-400 font-black italic uppercase rounded-xl h-12 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                                onClick={handleAssign}
                                disabled={!selectedCardioId}
                            >
                                Confirmar Atribuição
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                </div>
            ) : assignments.length > 0 ? (
                <div className="space-y-4">
                    {assignments.map((a) => (
                        <div
                            key={a.id}
                            className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm group hover:border-orange-500/30 transition-all duration-300"
                        >
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-orange-500/20 transition-all">
                                        <Activity className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-zinc-100 text-sm font-black uppercase italic tracking-wide">{a.cardio.name}</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1 text-[9px] font-black text-zinc-500 uppercase">
                                                    <Timer className="w-3 h-3" /> {a.duration_minutes} min
                                                </span>
                                                <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/10 text-[8px] font-black uppercase px-2 py-0">
                                                    {a.suggested_intensity}
                                                </Badge>
                                            </div>
                                            {a.days_of_week && a.days_of_week.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {a.days_of_week.map((d: number) => (
                                                        <span key={d} className="text-[7px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                            {DAYS.find(day => parseInt(day.value) === d)?.label || d}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                                    onClick={() => handleRemove(a.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">Nenhum cardio atribuído</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white rounded-xl h-9 px-6 text-[9px] font-black uppercase tracking-widest italic"
                        onClick={() => setIsAdding(true)}
                    >
                        Adicionar Primeiro
                    </Button>
                </div>
            )}
        </div>
    )
}

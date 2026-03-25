'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2, Loader2, Sparkles, Calendar, FlaskConical, Zap } from "lucide-react"
import { addErgogenic, updateErgogenic, deleteErgogenic } from "@/actions/ergogenics-actions"
import { Switch } from "@/components/ui/switch"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import { cn } from '@/lib/utils'

interface Ergogenic {
    id: string
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg'
    application_days: number[]
    notes?: string
    start_date: string
    end_date?: string
}

const DAYS = [
    { label: 'DOM', value: 0 },
    { label: 'SEG', value: 1 },
    { label: 'TER', value: 2 },
    { label: 'QUA', value: 3 },
    { label: 'QUI', value: 4 },
    { label: 'SEX', value: 5 },
    { label: 'SAB', value: 6 },
]

interface TrainerErgogenicsViewProps {
    studentId: string
    initialData: Ergogenic[]
}

export function TrainerErgogenicsView({ studentId, initialData }: TrainerErgogenicsViewProps) {
    const [ergogenics, setErgogenics] = useState<Ergogenic[]>(initialData)
    const [loading, setLoading] = useState<Record<string, boolean>>({})
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        weekly_dosage: 0,
        unit: 'ml' as 'ml' | 'mg',
        application_days: [] as number[],
        notes: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
    })

    async function handleAdd() {
        if (formData.application_days.length === 0) {
            alert('Selecione pelo menos um dia de aplicação')
            return
        }
        setLoading({ add: true })
        const res = await addErgogenic({ ...formData, student_id: studentId })
        setLoading({})
        if (res.success) {
            setErgogenics([res.data as Ergogenic, ...ergogenics])
            setIsAdding(false)
            setFormData({
                name: '',
                weekly_dosage: 0,
                unit: 'ml',
                application_days: [],
                notes: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: ''
            })
        } else {
            alert(res.error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Excluir esta substância?')) return
        setLoading({ [id]: true })
        const res = await deleteErgogenic(id, studentId)
        setLoading({})
        if (res.success) {
            setErgogenics(prev => prev.filter(e => e.id !== id))
        } else {
            alert(res.error)
        }
    }

    const toggleDay = (day: number) => {
        setFormData(prev => ({
            ...prev,
            application_days: prev.application_days.includes(day)
                ? prev.application_days.filter(d => d !== day)
                : [...prev.application_days, day].sort()
        }))
    }

    const dosagePerDay = formData.application_days.length > 0
        ? (formData.weekly_dosage / formData.application_days.length).toFixed(2)
        : '0'

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-emerald-500" />
                        Protocolo de Ergogênicos
                    </h2>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Gerencie as doses semanais e dias de aplicação</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-11 px-6 shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex gap-2">
                        <Plus className="w-4 h-4" /> ADICIONAR SUBSTÂNCIA
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="bg-zinc-950 border-emerald-500/20 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <CardHeader className="bg-emerald-500/[0.03] border-b border-zinc-900/50 pb-6">
                        <CardTitle className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Nova Substância</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Nome da Substância</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Testosterona Enantato"
                                        className="bg-zinc-900/50 border-zinc-800 text-sm h-12 rounded-xl text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Dosagem Semanal Total</Label>
                                    <div className={cn(
                                        "flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl h-14 pr-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50 transition-all overflow-hidden"
                                    )}>
                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={formData.weekly_dosage || ''}
                                                onChange={e => setFormData({ ...formData, weekly_dosage: parseFloat(e.target.value) || 0 })}
                                                placeholder="Ex: 1.2"
                                                className="bg-transparent border-0 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold px-4 text-white"
                                            />
                                        </div>

                                        {/* Minimal Unit Switch inside input */}
                                        <div className="flex items-center gap-3 pb-4 px-4 border-l border-zinc-800/50 h-8">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest transition-all",
                                                formData.unit === 'ml' ? "text-emerald-500" : "text-zinc-600"
                                            )}>ML</span>
                                            <Switch
                                                checked={formData.unit === 'mg'}
                                                onCheckedChange={(checked) => setFormData({ ...formData, unit: checked ? 'mg' : 'ml' })}
                                                className="h-4 w-8 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-800"
                                            />
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest transition-all",
                                                formData.unit === 'mg' ? "text-emerald-500" : "text-zinc-600"
                                            )}>MG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Dias de Aplicação</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DAYS.map((day) => (
                                        <Button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`
                                                h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border-2
                                                ${formData.application_days.includes(day.value)
                                                    ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                                                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 hover:border-emerald-500/30'}
                                            `}
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                                {formData.application_days.length > 0 && (
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dose por aplicação</p>
                                            <p className="text-xl font-black text-white italic italic uppercase">
                                                {dosagePerDay} <span className="text-emerald-500">{formData.unit}</span>
                                            </p>
                                        </div>
                                        <Sparkles className="w-5 h-5 text-emerald-500/30" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Início</Label>
                                <Input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="bg-zinc-900/50 border-zinc-800 text-sm h-12 rounded-xl text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Previsão Término</Label>
                                <Input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="bg-zinc-900/50 border-zinc-800 text-sm h-12 rounded-xl text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Notas / Instruções</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Horários preferenciais, cuidados com a aplicação..."
                                className="bg-zinc-900/50 border-zinc-800 text-sm rounded-xl min-h-[100px] text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
                            <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">Cancelar</Button>
                            <Button onClick={handleAdd} disabled={loading.add || !formData.name || formData.weekly_dosage <= 0} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg transition-all active:scale-95">
                                {loading.add ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DEFINIR PROTOCOLO'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ergogenics.map(e => (
                    <Card key={e.id} className="bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 transition-all rounded-3xl group overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{e.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                            {e.weekly_dosage} {e.unit} / Semana
                                        </div>
                                    </div>
                                </div>
                                <UnifiedDeleteButton
                                    id={e.id}
                                    actionType="ergogenic"
                                    itemName={e.name}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Dias de Aplicação</Label>
                                    <div className="flex gap-1.5">
                                        {DAYS.map(day => (
                                            <div
                                                key={day.value}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${(e.application_days || []).includes(day.value)
                                                    ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 scale-110 z-10'
                                                    : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                                                    }`}
                                            >
                                                {day.label[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900/50">
                                        <Label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Dose Dia</Label>
                                        <p className="text-sm font-black text-emerald-500 italic uppercase">
                                            {(e.weekly_dosage / Math.max((e.application_days || []).length, 1)).toFixed(2)} {e.unit}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900/50">
                                        <Label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Status</Label>
                                        <p className="text-sm font-black text-white italic uppercase">Ativo</p>
                                    </div>
                                </div>

                                {e.notes && (
                                    <div className="bg-zinc-950/20 p-4 rounded-2xl border border-dashed border-zinc-800">
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">"{e.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ergogenics.length === 0 && !isAdding && (
                    <div className="md:col-span-2 py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group">
                        <div className="p-5 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 transition-all group-hover:scale-110 group-hover:border-zinc-700 group-hover:bg-zinc-800">
                            <FlaskConical className="w-10 h-10 text-zinc-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-zinc-400 font-black uppercase italic tracking-tight">Nenhum ergogênico configurado</p>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Clique em "Adicionar Substância" para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

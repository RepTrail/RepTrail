'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Sparkles, FlaskConical } from "lucide-react"
import { cn } from '@/lib/utils'

interface ErgogenicFormData {
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg'
    application_days: number[]
    notes: string
    start_date: string
    end_date?: string
}

interface ErgogenicFormProps {
    initialData?: Partial<ErgogenicFormData>
    onSubmit: (data: ErgogenicFormData) => void
    onCancel: () => void
    colorScheme?: 'emerald' | 'orange' | 'blue'
    submitLabel?: string
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

export function ErgogenicForm({ 
    initialData, 
    onSubmit, 
    onCancel, 
    colorScheme = 'emerald',
    submitLabel = 'DEFINIR PROTOCOLO'
}: ErgogenicFormProps) {
    const [formData, setFormData] = useState<ErgogenicFormData>({
        name: initialData?.name || '',
        weekly_dosage: initialData?.weekly_dosage || 0,
        unit: initialData?.unit || 'ml',
        application_days: initialData?.application_days || [],
        notes: initialData?.notes || '',
        start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
        end_date: initialData?.end_date || ''
    })

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

    const colorClasses = {
        emerald: {
            border: 'border-emerald-500/20',
            focus: 'focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50',
            text: 'text-emerald-500',
            bg: 'bg-emerald-500',
            button: 'bg-emerald-600 hover:bg-emerald-700',
            shadow: 'shadow-emerald-500/10',
            dayActive: 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105',
            dayHover: 'hover:border-emerald-500/30',
            infoBg: 'bg-emerald-500/5 border-emerald-500/10'
        },
        orange: {
            border: 'border-orange-500/20',
            focus: 'focus-within:ring-orange-500/20 focus-within:border-orange-500/50',
            text: 'text-orange-500',
            bg: 'bg-orange-500',
            button: 'bg-orange-600 hover:bg-orange-700',
            shadow: 'shadow-orange-500/10',
            dayActive: 'bg-orange-500 text-zinc-950 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105',
            dayHover: 'hover:border-orange-500/30',
            infoBg: 'bg-orange-500/5 border-orange-500/10'
        },
        blue: {
            border: 'border-blue-500/20',
            focus: 'focus-within:ring-blue-500/20 focus-within:border-blue-500/50',
            text: 'text-blue-500',
            bg: 'bg-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700',
            shadow: 'shadow-blue-500/10',
            dayActive: 'bg-blue-500 text-zinc-950 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105',
            dayHover: 'hover:border-blue-500/30',
            infoBg: 'bg-blue-500/5 border-blue-500/10'
        }
    }

    const currentTheme = colorClasses[colorScheme]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
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
                            "flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl h-14 pr-2 transition-all overflow-hidden",
                            currentTheme.focus
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

                            <div className="flex items-center gap-3 px-4 border-l border-zinc-800/50 h-8">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest transition-all",
                                    formData.unit === 'ml' ? currentTheme.text : "text-zinc-600"
                                )}>ML</span>
                                <Switch
                                    checked={formData.unit === 'mg'}
                                    onCheckedChange={(checked) => setFormData({ ...formData, unit: checked ? 'mg' : 'ml' })}
                                    className={cn("h-4 w-8", `data-[state=checked]:${currentTheme.bg}`, "data-[state=unchecked]:bg-zinc-800")}
                                />
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest transition-all",
                                    formData.unit === 'mg' ? currentTheme.text : "text-zinc-600"
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
                                className={cn(
                                    "h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border-2",
                                    formData.application_days.includes(day.value)
                                        ? currentTheme.dayActive
                                        : cn("bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100", currentTheme.dayHover)
                                )}
                            >
                                {day.label}
                            </Button>
                        ))}
                    </div>
                    {formData.application_days.length > 0 && (
                        <div className={cn("p-4 rounded-2xl flex items-center justify-between border", currentTheme.infoBg)}>
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dose por aplicação</p>
                                <p className="text-xl font-black text-white italic uppercase">
                                    {dosagePerDay} <span className={currentTheme.text}>{formData.unit}</span>
                                </p>
                            </div>
                            <Sparkles className={cn("w-5 h-5 opacity-30", currentTheme.text)} />
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
                <Button variant="ghost" onClick={onCancel} className="text-zinc-500 hover:text-white rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">Cancelar</Button>
                 <Button 
                    onClick={() => onSubmit(formData)} 
                    disabled={!formData.name || formData.weekly_dosage <= 0 || formData.application_days.length === 0} 
                    className={cn(currentTheme.button, "text-white rounded-xl h-11 px-8 font-bold shadow-lg transition-all active:scale-95")}
                >
                    {submitLabel}
                </Button>
            </div>
        </div>
    )
}

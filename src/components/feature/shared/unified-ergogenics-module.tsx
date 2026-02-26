'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Check,
    Clock,
    FlaskConical,
    Loader2,
    History,
    X,
    Plus,
    Trash2,
    Sparkles
} from "lucide-react"
import {
    toggleErgogenicLog,
    addErgogenic,
    deleteErgogenic
} from "@/actions/ergogenics-actions"
import { useToast } from "@/hooks/use-toast"
import { getTodayRangeBrazil } from '@/lib/date-utils'

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

interface StudentLog {
    id: string
    created_at: string
    ergogenic_id?: string
    notes?: string
    ergogenics?: { name: string }
}

interface UnifiedErgogenicsModuleProps {
    studentId: string
    mode: 'student' | 'trainer'
    initialErgogenics: Ergogenic[]
    initialLogs?: StudentLog[]
    studentName?: string
}

const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

export function UnifiedErgogenicsModule({
    studentId,
    mode,
    initialErgogenics,
    initialLogs = [],
    studentName
}: UnifiedErgogenicsModuleProps) {
    const [ergogenics, setErgogenics] = useState<Ergogenic[]>(initialErgogenics)
    const [logs, setLogs] = useState<StudentLog[]>(initialLogs)
    const [loading, setLoading] = useState<Record<string, boolean>>({})
    const [isAdding, setIsAdding] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: '',
        weekly_dosage: 0,
        unit: 'ml' as 'ml' | 'mg',
        application_days: [] as number[],
        notes: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
    })

    const today = new Date().getDay()
    const todayName = WEEKDAYS_FULL[today]
    const { start, end } = useMemo(() => getTodayRangeBrazil(), [])

    const todaysLogsMap = useMemo(() => {
        const map: Record<string, boolean> = {}
        logs.forEach(log => {
            if (log.created_at >= start && log.created_at <= end && log.ergogenic_id) {
                map[log.ergogenic_id] = true
            }
        })
        return map
    }, [logs, start, end])

    const safeErgogenics = useMemo(() => ergogenics.map(e => ({
        ...e,
        application_days: Array.isArray(e.application_days) ? e.application_days : []
    })), [ergogenics])

    const todaysErgogenics = safeErgogenics.filter(e => e.application_days.some(d => Number(d) === today))
    const otherErgogenics = safeErgogenics.filter(e => !e.application_days.some(d => Number(d) === today))

    // Handlers
    async function handleToggle(ergogenicId: string) {
        if (mode !== 'student') return

        const isLogged = todaysLogsMap[ergogenicId]
        const newStatus = !isLogged

        setLoading(prev => ({ ...prev, [ergogenicId]: true }))

        try {
            const res = await toggleErgogenicLog(studentId, ergogenicId, newStatus)
            if (res.success) {
                if (newStatus) {
                    const erg = ergogenics.find(e => e.id === ergogenicId)
                    const newLog = {
                        ...res.data,
                        ergogenic_id: ergogenicId,
                        ergogenics: { name: erg?.name || 'Substância' }
                    } as StudentLog
                    setLogs(prev => [newLog, ...prev])
                } else {
                    setLogs(prev => prev.filter(log => {
                        const isTodayLog = log.created_at >= start && log.created_at <= end
                        return !(isTodayLog && log.ergogenic_id === ergogenicId)
                    }))
                }
                toast({ title: newStatus ? "Registrado!" : "Removido" })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message })
        } finally {
            setLoading(prev => ({ ...prev, [ergogenicId]: false }))
        }
    }

    async function handleAdd() {
        if (formData.application_days.length === 0) {
            toast({ variant: "destructive", title: "Erro", description: "Selecione pelo menos um dia." })
            return
        }
        setLoading({ add: true })
        try {
            const res = await addErgogenic({ ...formData, student_id: studentId })
            if (res.success) {
                setErgogenics(prev => [res.data as Ergogenic, ...prev])
                setIsAdding(false)
                setFormData({
                    name: '', weekly_dosage: 0, unit: 'ml', application_days: [],
                    notes: '', start_date: new Date().toISOString().split('T')[0], end_date: ''
                })
                toast({ title: "Protocolo definido!" })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message })
        } finally {
            setLoading({})
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Deseja excluir esta substância?')) return
        setLoading({ [id]: true })
        try {
            const res = await deleteErgogenic(id, studentId)
            if (res.success) {
                setErgogenics(prev => prev.filter(e => e.id !== id))
                toast({ title: "Removido com sucesso." })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message })
        } finally {
            setLoading({})
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

    const dosagePerApp = formData.application_days.length > 0
        ? (formData.weekly_dosage / formData.application_days.length).toFixed(2)
        : '0'

    // Render Helpers
    const renderErgogenicCard = (e: Ergogenic, isToday: boolean) => {
        const isDone = todaysLogsMap[e.id]
        const appDaysCount = e.application_days.length
        const dosage = appDaysCount > 0 ? (e.weekly_dosage / appDaysCount).toFixed(2) : e.weekly_dosage.toFixed(2)

        return (
            <Card key={e.id} className={`bg-zinc-950 border-zinc-800 transition-all rounded-[2rem] overflow-hidden shadow-2xl group ${isToday ? (isDone ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800') : 'opacity-60'}`}>
                <CardContent className="p-0">
                    <div className="p-6 bg-zinc-900/40 border-b border-zinc-900/50 flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{e.name}</h3>
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                                {dosage} {e.unit} por aplicação
                            </div>
                        </div>
                        {mode === 'student' && isToday ? (
                            <Button
                                onClick={() => handleToggle(e.id)}
                                disabled={loading[e.id]}
                                className={`h-12 w-12 rounded-2xl transition-all p-0 ${isDone ? "bg-zinc-800 text-emerald-500 border border-emerald-500/20" : "bg-emerald-600 text-white"}`}
                            >
                                {loading[e.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : (isDone ? <X className="w-5 h-5" /> : <Check className="w-6 h-6" />)}
                            </Button>
                        ) : mode === 'trainer' && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="text-zinc-700 hover:text-red-400 h-8 w-8">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Dias de Aplicação</span>
                            <div className="flex gap-1.5">
                                {WEEKDAYS_SHORT.map((day, idx) => (
                                    <div key={idx} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[8px] font-black border transition-all ${e.application_days.includes(idx) ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'bg-zinc-950 border-zinc-900 text-zinc-800'}`}>
                                        {day[0]}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {isToday && isDone && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase italic">Registro Concluído</span>
                            </div>
                        )}
                        {e.notes && (
                            <div className="pt-4 border-t border-zinc-900">
                                <p className="text-xs text-zinc-400 leading-relaxed italic">"{e.notes}"</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header: Trainer Mode only */}
            {mode === 'trainer' && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                            <FlaskConical className="w-6 h-6 text-emerald-500" />
                            Protocolo de {studentName || 'Aluno'}
                        </h2>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Gestão de ergogênicos e ciclos</p>
                    </div>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-11 px-6 shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex gap-2">
                            <Plus className="w-4 h-4" /> ADICIONAR SUBSTÂNCIA
                        </Button>
                    )}
                </div>
            )}

            {/* Add Panel (Trainer) */}
            {isAdding && mode === 'trainer' && (
                <Card className="bg-zinc-950 border-emerald-500/20 shadow-2xl rounded-[2.5rem] overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Substância</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Testosterona" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Dosagem Semanal</Label>
                                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl h-14">
                                        <Input type="number" step="0.1" value={formData.weekly_dosage || ''} onChange={e => setFormData({ ...formData, weekly_dosage: parseFloat(e.target.value) || 0 })} className="bg-transparent border-0 h-10" />
                                        <div className="flex items-center gap-2 px-4 border-l border-zinc-800">
                                            <span className="text-[10px] font-black uppercase text-zinc-500">ML</span>
                                            <Switch checked={formData.unit === 'mg'} onCheckedChange={(c) => setFormData({ ...formData, unit: c ? 'mg' : 'ml' })} />
                                            <span className="text-[10px] font-black uppercase text-zinc-500">MG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Dias de Aplicação</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {WEEKDAYS_SHORT.map((day, i) => (
                                        <Button key={i} onClick={() => toggleDay(i)} className={`h-11 rounded-xl border-2 text-[10px] font-black ${formData.application_days.includes(i) ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>{day}</Button>
                                    ))}
                                </div>
                                {formData.application_days.length > 0 && (
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Dose por aplicação</p>
                                            <p className="text-xl font-black text-white italic">{dosagePerApp} <span className="text-emerald-500">{formData.unit}</span></p>
                                        </div>
                                        <Sparkles className="w-5 h-5 text-emerald-500/30" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Instruções</Label>
                            <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px]" />
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
                            <Button variant="ghost" onClick={() => setIsAdding(false)} className="uppercase tracking-widest text-[10px]">Cancelar</Button>
                            <Button onClick={handleAdd} disabled={loading.add || !formData.name} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-bold transition-all">
                                {loading.add ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DEFINIR PROTOCOLO'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content: Protocols */}
            <div className="space-y-6">
                {mode === 'student' && (
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                            <Clock className="w-6 h-6 text-emerald-500" />
                            Aplicações de Hoje • <span className="text-emerald-500">{todayName}</span>
                        </h2>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Registre suas aplicações do plano atual</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {todaysErgogenics.map(e => renderErgogenicCard(e, true))}
                    {mode === 'student' && todaysErgogenics.length === 0 && (
                        <div className="md:col-span-2 py-16 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                            <Check className="w-8 h-8 text-emerald-500/20" />
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Tudo certo! Nenhuma aplicação pendente hoje.</p>
                        </div>
                    )}
                </div>

                {otherErgogenics.length > 0 && (
                    <>
                        <div className="pt-8 pb-4">
                            <h2 className="text-xl font-black text-zinc-400 italic uppercase tracking-tight flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-zinc-600" />
                                {mode === 'student' ? 'Resto do Protocolo' : 'Outras Substâncias'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {otherErgogenics.map(e => renderErgogenicCard(e, false))}
                        </div>
                    </>
                )}
            </div>

            {/* History Section: Student only */}
            {mode === 'student' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <History className="w-5 h-5 text-zinc-500" />
                        Histórico de Registros
                    </h2>
                    <Card className="bg-zinc-950 border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            {logs.length > 0 ? (
                                <div className="divide-y divide-zinc-900">
                                    {logs.map(log => (
                                        <div key={log.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/40 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                                                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-white uppercase italic">{log.ergogenics?.name || 'Substância'}</p>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Aplicação Confirmada</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-zinc-300">{new Date(log.created_at).toLocaleDateString()}</p>
                                                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Ainda não há registros.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

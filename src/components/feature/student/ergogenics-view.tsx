'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, Clock, Calendar, FlaskConical, Loader2, History } from "lucide-react"
import { logErgogenicIntake } from "@/actions/ergogenics-actions"
import { useToast } from "@/hooks/use-toast"

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

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

interface StudentLog {
    id: string
    created_at: string
    notes?: string
    ergogenics?: { name: string }
}

interface StudentErgogenicsViewProps {
    studentId: string
    ergogenics: Ergogenic[]
    initialLogs: StudentLog[]
}

export function StudentErgogenicsView({ studentId, ergogenics, initialLogs }: StudentErgogenicsViewProps) {
    const [logs, setLogs] = useState<StudentLog[]>(initialLogs)
    const [loading, setLoading] = useState<Record<string, boolean>>({})
    const { toast } = useToast()

    const today = new Date().getDay() // 0-6
    const todayName = WEEKDAYS[today]

    const safeErgogenics = ergogenics.map((e: Ergogenic) => ({
        ...e,
        application_days: Array.isArray(e.application_days) ? e.application_days : []
    }))
    const todaysErgogenics = safeErgogenics.filter((e) => e.application_days.some((d: number) => Number(d) === today))
    const otherErgogenics = safeErgogenics.filter((e) => !e.application_days.some((d: number) => Number(d) === today))

    async function handleLog(ergogenicId: string) {
        setLoading({ [ergogenicId]: true })
        const res = await logErgogenicIntake({ student_id: studentId, ergogenic_id: ergogenicId })
        setLoading({})

        if (res.success) {
            const erg = ergogenics.find((e: Ergogenic) => e.id === ergogenicId)
            const newLog = {
                ...res.data,
                ergogenics: { name: erg?.name || 'Substância' }
            } as StudentLog
            setLogs([newLog, ...logs])
            toast({ title: "Registrado!", description: "Sua aplicação/ingestão foi salva." })
        } else {
            toast({ variant: "destructive", title: "Erro ao registrar", description: res.error })
        }
    }

    const renderErgogenicCard = (e: Ergogenic & { application_days: number[] }, isToday: boolean) => {
        if (!e) return null

        // Calculate dosage per application safely
        const appDaysCount = Array.isArray(e.application_days) ? e.application_days.length : 0
        const dosagePerApp = appDaysCount > 0 ? (e.weekly_dosage / appDaysCount).toFixed(2) : (e.weekly_dosage || 0).toFixed(2)

        return (
            <Card key={e.id} className={`bg-zinc-950 border-zinc-800 transition-all rounded-3xl overflow-hidden shadow-2xl group ${isToday ? 'border-emerald-500/30' : 'opacity-60'}`}>
                <CardContent className="p-0">
                    <div className="p-6 bg-zinc-900/40 border-b border-zinc-900/50 flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{e.name || 'Substância'}</h3>
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                                {dosagePerApp} {e.unit || ''} por aplicação
                            </div>
                        </div>
                        {isToday && (
                            <Button
                                onClick={() => handleLog(e.id)}
                                disabled={loading[e.id]}
                                className="h-12 w-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all p-0"
                            >
                                {loading[e.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-6 h-6" />}
                            </Button>
                        )}
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Dias de Aplicação</span>
                            <div className="flex gap-1">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black border transition-all cursor-default ${(e.application_days || []).some((d: number) => Number(d) === idx)
                                            ? 'bg-emerald-500 border-emerald-300 text-zinc-950 shadow-lg shadow-emerald-500/30'
                                            : 'bg-zinc-950 border-zinc-900 text-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {e.notes && (
                            <div className="pt-4 border-t border-zinc-900">
                                <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest block mb-2">Orientações</span>
                                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">"{e.notes}"</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Today's Applications */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <Clock className="w-6 h-6 text-emerald-500" />
                        Aplicações de Hoje • <span className="text-emerald-500">{todayName}</span>
                    </h2>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Substâncias programadas para aplicação hoje</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {todaysErgogenics.map((e: Ergogenic) => renderErgogenicCard(e, true))}
                    {todaysErgogenics.length === 0 && (
                        <div className="md:col-span-2 py-16 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                            <Check className="w-10 h-10 text-emerald-500/20" />
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Nenhuma aplicação pendente para hoje.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rest of the Protocol */}
            {otherErgogenics.length > 0 && (
                <div className="space-y-6 opacity-60">
                    <div>
                        <h2 className="text-xl font-black text-zinc-400 italic uppercase tracking-tight flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-zinc-600" />
                            Resto do Protocolo
                        </h2>
                        <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">Outras substâncias do seu plano semanal</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherErgogenics.map((e: Ergogenic) => renderErgogenicCard(e, false))}
                    </div>
                </div>
            )}

            {/* History */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <History className="w-5 h-5 text-zinc-500" />
                        Histórico de Registros
                    </h2>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Últimas aplicações marcadas como concluídas</p>
                </div>

                <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
                    <CardContent className="p-0">
                        {logs.length > 0 ? (
                            <div className="divide-y divide-zinc-900">
                                {logs.map((log: StudentLog) => {
                                    if (!log) return null
                                    const logDate = log.created_at ? new Date(log.created_at) : new Date()
                                    return (
                                        <div key={log.id} className="p-5 flex items-center justify-between hover:bg-zinc-900/50 active:bg-zinc-900 transition-all cursor-pointer group/item">
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
                                                <p className="text-xs font-bold text-zinc-300">{logDate.toLocaleDateString()}</p>
                                                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">{logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Nenhum registro encontrado.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

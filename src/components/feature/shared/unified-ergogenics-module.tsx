'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Check,
    Clock,
    Syringe,
    Loader2,
    History,
    X,
    Plus,
    Trash2,
    Copy,
    Edit2,
    Calendar as CalendarIcon
} from "lucide-react"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import {
    toggleErgogenicLog,
    addErgogenic,
    getStudentErgogenics,
    getErgogenicLogs
} from "@/actions/ergogenics-actions"
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { UnifiedAssignDialog } from '@/components/feature/shared/unified-assign-dialog'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { useToast } from "@/hooks/use-toast"
import { getTodayRangeBrazil } from '@/lib/date-utils'

interface Ergogenic {
    id: string
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg' | 'un'
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
    colorScheme?: 'orange' | 'emerald'
}

const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const ERGOGENIC_FIELDS = [
    { name: 'name', label: 'Nome da Substância', placeholder: 'Ex: Enantato de Testosterona', required: true },
    { name: 'weekly_dosage', label: 'Dosagem Semanal Total', placeholder: '250', type: 'number' as const, required: true, gridCols: 2 as const, merged: true },
    {
        name: 'unit', label: 'Unidade', type: 'select' as const, defaultValue: 'mg', options: [
            { label: 'mg', value: 'mg' },
            { label: 'ml', value: 'ml' },
            { label: 'un', value: 'un' }
        ], required: true, gridCols: 2 as const, merged: true
    },
    { name: 'application_days', label: 'Dias de Aplicação', type: 'days' as const, required: true },
    { name: 'notes', label: 'Instruções / Notas (Opcional)', placeholder: 'Ex: Aplicar no glúteo...', type: 'textarea' as const }
]

export function UnifiedErgogenicsModule({
    studentId,
    mode,
    initialErgogenics,
    initialLogs = [],
    studentName,
    colorScheme = 'emerald'
}: UnifiedErgogenicsModuleProps) {
    const { toast } = useToast()
    const { data: ergogenicsData = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(studentId),
        queryFn: async () => {
            const res = await getStudentErgogenics(studentId)
            if (res && 'error' in (res as any)) throw new Error((res as any).error)
            return (res as any[]) || []
        },
        initialData: initialErgogenics,
        staleTime: 1000 * 60 * 5
    })

    const { data: logsData = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.logs(studentId),
        queryFn: async () => {
            const res = await getErgogenicLogs(studentId)
            // getErgogenicLogs returns any[] directly (never wrapped in { data })
            return Array.isArray(res) ? res : []
        },
        initialData: initialLogs,
        staleTime: 1000 * 60 * 5
    })

    const ergogenics = Array.isArray(ergogenicsData) ? ergogenicsData : []
    const logs = Array.isArray(logsData) ? logsData : []

    const today = new Date().getDay()
    const todayName = WEEKDAYS_FULL[today]
    const { start, end } = useMemo(() => getTodayRangeBrazil(), [])

    const todaysLogsMap = useMemo(() => {
        const map: Record<string, boolean> = {}
        logs.forEach((log: any) => {
            if (log.created_at >= start && log.created_at <= end && log.ergogenic_id) {
                map[log.ergogenic_id] = true
            }
        })
        return map
    }, [logs, start, end])

    const safeErgogenics = useMemo(() => ergogenics.map((e: any) => ({
        ...e,
        application_days: Array.isArray(e.application_days) ? e.application_days : []
    })), [ergogenics])

    const todaysErgogenics = safeErgogenics.filter((e: any) => e.application_days.some((d: any) => Number(d) === today))
    const otherErgogenics = mode === 'student'
        ? safeErgogenics.filter((e: any) => !e.application_days.some((d: any) => Number(d) === today))
        : safeErgogenics

    // Handlers
    const { mutate: toggleLog } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.logs(studentId),
        actionName: 'toggle-ergogenic-log',
        entity: ENTITIES.ERGOGENIC_LOG,
        mutationFn: async (variables) => {
            return toggleErgogenicLog(variables.student_id, variables.ergogenic_id, variables.status)
        },
        updateFn: (oldData: any, variables: any) => {
            const currentLogs = Array.isArray(oldData) ? oldData : (oldData?.data || [])
            
            if (variables.status) {
                const newLog = {
                    id: crypto.randomUUID(),
                    ergogenic_id: variables.ergogenic_id,
                    created_at: new Date().toISOString(),
                    _optimistic: true,
                    ergogenics: { name: (ergogenics as any[]).find((e: any) => e.id === variables.ergogenic_id)?.name || 'Substância' }
                }
                return [newLog, ...currentLogs]
            } else {
                return currentLogs.filter((l: any) => l.ergogenic_id !== variables.ergogenic_id)
            }
        },
        onSuccess: (_data, variables) => {
            toast({ title: variables.status ? "Registrado!" : "Removido" })
        },
        onError: (err) => {
            toast({ variant: "destructive", title: "Erro", description: err.message })
        }
    })

    function handleToggle(ergogenicId: string) {
        if (mode !== 'student') return
        const isLogged = todaysLogsMap[ergogenicId]
        toggleLog({ student_id: studentId, ergogenic_id: ergogenicId, status: !isLogged })
    }

    const { mutate: performDuplicate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(studentId),
        actionName: 'add-ergogenic',
        entity: ENTITIES.ERGOGENIC,
        mutationFn: async (vars) => vars,
        updateFn: (oldData: any, variables: any) => {
            const currentItems = Array.isArray(oldData) ? oldData : (oldData?.data || [])
            const newItem = {
                ...variables,
                id: variables.id || crypto.randomUUID(),
                _optimistic: true,
                application_days: variables.application_days || []
            }
            return [newItem, ...currentItems]
        },
        onSuccess: () => toast({ title: "Substância duplicada!" }),
        onError: (err) => toast({ variant: "destructive", title: "Erro na duplicação", description: err.message })
    })

    function handleDuplicate(e: Ergogenic) {
        const { id, ...dataToCopy } = e
        performDuplicate({
            ...dataToCopy,
            student_id: studentId,
            name: `${e.name} (Cópia)`
        })
    }

    // Render Helpers
    const renderErgogenicCard = (e: Ergogenic, isToday: boolean, idx: number) => {
        const isDone = todaysLogsMap[e.id]
        const appDaysCount = e.application_days?.length || 0
        const weeklyDosage = e.weekly_dosage || 0
        const dosage = appDaysCount > 0 ? (weeklyDosage / appDaysCount).toFixed(2) : weeklyDosage.toFixed(2)

        const colors = {
            orange: {
                border: "hover:border-orange-500/10",
                activeBg: "border-orange-500/20 bg-orange-500/5",
                icon: "text-orange-500",
                badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                button: "bg-orange-500 hover:bg-orange-500/90 text-zinc-950",
                buttonActive: "bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500/20"
            },
            emerald: {
                border: "hover:border-emerald-500/10",
                activeBg: "border-emerald-500/20 bg-emerald-500/5",
                icon: "text-emerald-500",
                badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                button: "bg-emerald-500 hover:bg-emerald-500/90 text-zinc-950",
                buttonActive: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }
        }[colorScheme]

        return (
            <Card key={e.id || `ergo-${idx}`} className={cn(
                "bg-zinc-900/50 border-zinc-800 text-zinc-100 transition-all group rounded-3xl overflow-hidden flex flex-col h-full",
                colors.border,
                isToday && isDone && colors.activeBg
            )}>
                <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className={cn("bg-zinc-800 p-2 rounded-lg transition-colors", colors.icon)}>
                            <Syringe className="w-5 h-5" />
                        </div>
                        {mode === 'trainer' && (
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDuplicate(e)}
                                    className={cn("h-8 w-8 text-zinc-500 rounded-lg transition-colors", colorScheme === 'orange' ? 'hover:text-orange-500' : 'hover:text-emerald-500')}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <UnifiedDeleteButton
                                    id={e.id}
                                    actionType="ergogenic"
                                    itemName={e.name}
                                    studentId={studentId}
                                    queryKey={QUERY_KEYS.ergogenics.all(studentId)}
                                />
                            </div>
                        )}
                    </div>
                    <CardTitle className="mt-4 text-xl font-black italic uppercase tracking-tighter text-white">{e.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                    {/* Calendar Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {WEEKDAYS_SHORT.map((day, idx) => {
                            const isAppDay = e.application_days.includes(idx)
                            if (!isAppDay) return null
                            return (
                                <span key={idx} className={cn("flex items-center shrink-0 gap-1 px-2 py-1 text-[9px] font-black uppercase rounded-[0.5rem] border", colors.badge)}>
                                    <CalendarIcon className="w-2.5 h-2.5" />
                                    {day}
                                </span>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">
                        <span>{dosage} {e.unit} / dose</span>
                        <span>{appDaysCount}x semana</span>
                    </div>

                    {e.notes && (
                        <div className="mb-6 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-400 leading-relaxed italic line-clamp-2">
                                "{e.notes}"
                            </p>
                        </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center gap-2">
                        {mode === 'student' && isToday ? (
                            <Button
                                onClick={() => handleToggle(e.id)}
                                className={cn(
                                    "flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-1.5 shadow-lg",
                                    isDone ? colors.buttonActive : colors.button
                                )}
                            >
                                {isDone ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        Registrado
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5" />
                                        Registrar Uso
                                    </>
                                )}
                            </Button>
                        ) : mode === 'trainer' ? (
                            <>
                                <UnifiedAssignDialog
                                    title="Agendar Aplicações"
                                    description="Escolha os dias da semana para este ergogênico."
                                    itemId={e.id}
                                    fixedStudentId={studentId}
                                    type="ergogenic"
                                    initialDays={e.application_days}
                                    colorScheme={colorScheme}
                                    trigger={
                                        <Button
                                            className={cn("flex-1 min-w-0 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 px-3", colors.button)}
                                        >
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span className="truncate">Agendar</span>
                                        </Button>
                                    }
                                />
                                <UnifiedCreationDialog
                                    title="Editar Substância"
                                    description="Atualize as informações desta substância no protocolo."
                                    actionType="update-student-ergogenic"
                                    id={e.id}
                                    parentId={studentId}
                                    initialValues={e}
                                    fields={ERGOGENIC_FIELDS}
                                    colorScheme={colorScheme}
                                    queryKey={['ergogenics', studentId]}
                                    footerLabel="Salvar Alterações"
                                    trigger={
                                        <Button variant="outline" className="flex-1 min-w-0 h-9 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-3">
                                            Editar
                                        </Button>
                                    }
                                />
                            </>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Main Content: Protocols */}
            <div className="space-y-8">
                {mode === 'student' && todaysErgogenics.length > 0 && (
                    <div className="space-y-6">
                        <div className="px-2">
                            <h2 className={cn("text-[10px] font-black flex items-center gap-2 uppercase tracking-widest", colorScheme === 'orange' ? 'text-orange-400' : 'text-emerald-400')}>
                                <Clock className="w-4 h-4" />
                                Aplicações de Hoje • <span className="text-white italic">{todayName}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {todaysErgogenics.map((e: any, idx: number) => renderErgogenicCard(e, true, idx))}
                        </div>
                    </div>
                )}

                {otherErgogenics.length > 0 && (
                    <div className="space-y-6">
                        <div className="pt-8 px-2 border-t border-zinc-800/50">
                            <h2 className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                                <Syringe className="w-4 h-4" />
                                {mode === 'student' ? 'Restante do Protocolo' : 'Protocolo Ativo'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherErgogenics.map((e: any, idx: number) => renderErgogenicCard(e, false, idx))}
                        </div>
                    </div>
                )}

                {todaysErgogenics.length === 0 && otherErgogenics.length === 0 && (
                    <div className="py-20 text-center border-dashed border border-zinc-800 rounded-3xl w-full">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase">Nenhum ergogênico prescrito.</p>
                    </div>
                )}
            </div>

            {/* History Section: Student only */}
            {mode === 'student' && logs.length > 0 && (
                <div className="space-y-6">
                    <div className="px-2">
                        <h2 className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                            <History className="w-4 h-4" />
                            Histórico de Registros
                        </h2>
                    </div>
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-zinc-900/50">
                                {logs.map((log: any, index: number) => (
                                    <div key={log.id || `log-${index}`} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-all group">

                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-3 bg-zinc-950 rounded-2xl border border-zinc-800 transition-all", colorScheme === 'orange' ? 'group-hover:bg-orange-500/10 group-hover:border-orange-500/20' : 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20')}>
                                                <Syringe className={cn("w-4 h-4 text-zinc-700 transition-colors", colorScheme === 'orange' ? 'group-hover:text-orange-500' : 'group-hover:text-emerald-500')} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-white uppercase italic tracking-tight">{log.ergogenics?.name || 'Substância'}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Check className={cn("w-2.5 h-2.5", colorScheme === 'orange' ? 'text-orange-500' : 'text-emerald-500')} />
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Aplicação Confirmada</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-zinc-200 uppercase italic tracking-tighter">
                                                {new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

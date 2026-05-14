'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Activity, Dumbbell, Flame, Utensils, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdherenceHistoryItem {
    date: string
    diet_percentage: number
    diet_status?: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    workout_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    workout_percentage?: number
    cardio_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    cardio_percentage?: number
    ergogenics_status: 'none' | 'assigned' | 'completed' | 'skipped' | 'partial'
    ergogenics_percentage?: number
}

interface AdherenceChartProps {
    history: AdherenceHistoryItem[]
    showErgogenics?: boolean
    noCard?: boolean
}

export function UnifiedAdherenceChart({ history, showErgogenics = false, noCard = false }: AdherenceChartProps) {
    const sortedHistory = React.useMemo(() =>
        [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [history])

    const rows = React.useMemo(() => [
        { id: 'workout', label: 'Treino', icon: Dumbbell, color: 'text-emerald-500' },
        { id: 'cardio', label: 'Cardio', icon: Flame, color: 'text-orange-500' },
        { id: 'diet', label: 'Dieta', icon: Utensils, color: 'text-blue-500' },
        ...(showErgogenics ? [{ id: 'ergo', label: 'Ergo', icon: Sparkles, color: 'text-amber-500' }] : []),
    ], [showErgogenics])

    const getStatusColor = (status: string, percentage?: number) => {
        if (percentage !== undefined && percentage !== null && status !== 'none' && status !== 'assigned') {
            if (percentage >= 100) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            if (percentage > 0) return 'bg-amber-500'
            if (status === 'skipped' || status === 'fail') return 'bg-red-500'
            return 'bg-zinc-800'
        }
        switch (status) {
            case 'completed': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            case 'partial': return 'bg-amber-500'
            case 'skipped': return 'bg-red-500'
            case 'assigned': return 'bg-zinc-800 border border-zinc-700/50'
            case 'none': default: return 'bg-zinc-950 border border-zinc-900/50 opacity-40'
        }
    }

    const content = (
        <div className={cn("w-full space-y-6 overflow-x-auto scrollbar-hide", noCard ? "" : " pb-4 sm:px-8 sm:pb-8")}>
            <div className="w-full min-w-[450px] sm:min-w-full space-y-4">

                {rows.map(row => (
                    <div key={row.id} className="grid grid-cols-[90px_1fr] gap-4 items-center group">
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                            <row.icon className={cn("w-3.5 h-3.5", row.color)} />
                            {row.label}
                        </div>
                        <div className="flex gap-1.5 h-7 items-center bg-zinc-900/30 p-1.5 rounded-system border border-white/[0.02]">
                            {sortedHistory.map((day) => {
                                let status = 'none'
                                let percentage = undefined

                                if (row.id === 'workout') {
                                    status = day.workout_status
                                    percentage = day.workout_percentage
                                } else if (row.id === 'cardio') {
                                    status = day.cardio_status
                                    percentage = day.cardio_percentage
                                } else if (row.id === 'ergo') {
                                    status = day.ergogenics_status
                                    percentage = day.ergogenics_percentage
                                } else if (row.id === 'diet') {
                                    percentage = day.diet_percentage
                                    if (percentage > 0) {
                                        status = percentage >= 100 ? 'completed' : 'partial'
                                    } else {
                                        status = day.diet_status || 'none'
                                    }
                                }

                                const colorClass = getStatusColor(status, percentage)
                                const dateObj = new Date(day.date)
                                const dateLabel = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

                                return (
                                    <TooltipProvider key={day.date}>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div className={cn(
                                                    "flex-1 h-full rounded-system transition-all hover:scale-150 hover:z-50 cursor-crosshair",
                                                    colorClass
                                                )} />
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-white text-[10px] p-3 rounded-system shadow-2xl backdrop-blur-xl">
                                                <div className="space-y-1">
                                                    <p className="font-black text-zinc-500 uppercase tracking-widest">{dateLabel}</p>
                                                    <p className="font-bold text-white italic uppercase">
                                                        {row.id === 'diet'
                                                            ? `${percentage || 0}% de adesão`
                                                            : status === 'none' ? 'Folga / Sem Meta' : status === 'assigned' ? 'Pendente' : status === 'skipped' ? 'Falhou' : status === 'partial' ? `Parcial (${percentage || 0}%)` : 'Concluído'}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[8px] font-black text-zinc-500 uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Meta Batida</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Parcial</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Não Realizado</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Programado</span>
            </div>
        </div>
    )

    if (noCard) return content

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-system overflow-hidden backdrop-blur-sm shadow-2xl transition-all hover:border-zinc-700/50">
            <CardHeader className="px-8 pt-8 pb-4">
                <CardTitle className="flex items-center gap-3 pb-4text-lg font-black text-white italic uppercase tracking-tighter">
                    <Activity className="w-6 h-6 text-purple-500 animate-pulse" />
                    Adesão Consolidada <span className="text-zinc-500 text-xs ml-2 not-italic">(30 Dias)</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}


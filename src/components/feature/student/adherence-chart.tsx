
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Activity, Dumbbell, Flame, Utensils, Sparkles, AlertCircle, CheckCircle2, XCircle, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdherenceHistoryItem {
    date: string
    diet_percentage: number
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

export function AdherenceChart({ history, showErgogenics = false, noCard = false }: AdherenceChartProps) {
    // Ensure chronological order
    const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Rows config
    const rows = [
        { id: 'workout', label: 'Treino', icon: Dumbbell, color: 'text-emerald-500' },
        { id: 'cardio', label: 'Cardio', icon: Flame, color: 'text-orange-500' },
        { id: 'diet', label: 'Dieta', icon: Utensils, color: 'text-blue-500' },
        ...(showErgogenics ? [{ id: 'ergo', label: 'Ergo', icon: Sparkles, color: 'text-amber-500' }] : []),
    ]

    const getStatusColor = (status: string, percentage?: number) => {
        if (percentage !== undefined && percentage !== null && status !== 'none') {
            if (percentage >= 100) return 'bg-emerald-500'
            if (percentage > 0) return 'bg-amber-500' // Amber for any partial progress
            if (status === 'skipped' || status === 'fail') return 'bg-red-500'
            return 'bg-zinc-800'
        }
        switch (status) {
            case 'completed': return 'bg-emerald-500'
            case 'partial': return 'bg-amber-500'
            case 'skipped': return 'bg-red-500'
            case 'assigned': return 'bg-zinc-700 border border-zinc-600' // Pending
            case 'in_progress': return 'bg-amber-500 animate-pulse'
            case 'none': default: return 'bg-zinc-900 border border-zinc-800/50'
        }
    }

    const content = (
        <div className={cn("space-y-4 overflow-x-auto", noCard ? "" : "px-8 pb-8")}>
            <div className="min-w-[600px] space-y-4">


                {/* Rows */}
                {rows.map(row => (
                    <div key={row.id} className="grid grid-cols-[80px_1fr] gap-4 items-center group">
                        <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-tight group-hover:text-white transition-colors">
                            <row.icon className={cn("w-3.5 h-3.5", row.color)} />
                            {row.label}
                        </div>
                        <div className="flex gap-1 h-8 items-center bg-zinc-950/30 p-1 rounded-xl">
                            {sortedHistory.map((day) => {
                                let status = 'none'
                                let percentage = undefined

                                if (row.id === 'workout') {
                                    status = day.workout_status
                                    percentage = day.workout_percentage
                                }
                                if (row.id === 'cardio') {
                                    status = day.cardio_status
                                    percentage = day.cardio_percentage
                                }
                                if (row.id === 'ergo') {
                                    status = day.ergogenics_status
                                    percentage = day.ergogenics_percentage
                                }
                                if (row.id === 'diet') {
                                    percentage = day.diet_percentage
                                    if (percentage !== undefined && percentage > 0) {
                                        if (percentage >= 100) status = 'completed'
                                        else status = 'partial'
                                    }
                                }

                                const colorClass = getStatusColor(status, percentage)
                                const [y, m, d] = day.date.split('-')
                                const dateLabel = `${d}/${m}/${y}`

                                return (
                                    <TooltipProvider key={day.date}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={cn(
                                                    "flex-1 h-full rounded-md transition-all hover:scale-125 hover:z-10 cursor-help",
                                                    colorClass
                                                )} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-900 border-zinc-800 text-white text-xs p-2 rounded-xl">
                                                <p className="font-bold mb-1">{dateLabel}</p>
                                                <p className="capitalize text-zinc-400">
                                                    {row.id === 'diet'
                                                        ? `${percentage || 0}% Concluído`
                                                        : status === 'none' ? 'Sem atividade' : status === 'assigned' ? 'Pendente' : status === 'skipped' ? 'Falhou' : status === 'partial' ? `Parcial (${percentage || 0}%)` : 'Concluído'}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Feito</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Parcial</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Falha</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" /> Pendente</span>
            </div>
        </div>
    )

    if (noCard) return content

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-xl">
            <CardHeader className="px-8 pt-8 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-black text-white italic uppercase tracking-tight">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Adesão (30 Dias)
                </CardTitle>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}

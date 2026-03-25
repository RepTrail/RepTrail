'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface UnifiedLibraryCardProps {
    id: string
    name: string
    description?: string
    icon: ReactNode
    type: 'workout' | 'diet' | 'cardio'
    created_at: string
    assignments: any[]
    stats?: {
        label: string
        value: string | number
        icon?: ReactNode
    }
    href: string
    colorScheme?: 'orange' | 'emerald' | 'zinc'
    onEditLabel?: string
}

const dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function UnifiedLibraryCard({
    id,
    name,
    description,
    icon,
    type,
    created_at,
    assignments,
    stats,
    href,
    colorScheme = 'orange',
    onEditLabel
}: UnifiedLibraryCardProps) {
    const studentAssignments = (assignments || []).reduce((acc: any, curr: any) => {
        const studentName = curr.student?.full_name || 'Aluno'
        if (!acc[studentName]) acc[studentName] = new Set<number>()
        
        if (curr.day_of_week !== undefined) {
            acc[studentName].add(curr.day_of_week)
        } else if (curr.days_of_week) {
            curr.days_of_week.forEach((d: number) => acc[studentName].add(d))
        }
        return acc
    }, {})

    const studentsList = Object.keys(studentAssignments)

    const accentColor = colorScheme === 'emerald' ? 'text-emerald-500' : 'text-orange-500'
    const borderColor = colorScheme === 'emerald' ? 'hover:border-emerald-500/30' : 'hover:border-orange-500/30'
    const bulletColor = colorScheme === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500'

    return (
        <Card className={cn(
            "bg-zinc-900/50 border-zinc-800 text-zinc-100 transition-all group rounded-[2rem] overflow-hidden flex flex-col",
            borderColor
        )}>
            <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className={cn(
                        "bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:transition-colors",
                        colorScheme === 'emerald' ? "group-hover:text-emerald-500" : "group-hover:text-orange-500"
                    )}>
                        {icon}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DuplicateButton id={id} type={type} />
                        <UnifiedDeleteButton
                            id={id}
                            actionType={type}
                            itemName={name}
                        />
                    </div>
                </div>
                <CardTitle className="mt-4 text-lg font-black italic uppercase tracking-tight group-hover:text-white transition-colors">
                    {name}
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2">
                    {description || "Sem descrição."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    <span>
                        {stats ? (
                            <div className="flex items-center gap-1.5">
                                {stats.icon}
                                {stats.value} {stats.label}
                            </div>
                        ) : (
                            "Template"
                        )}
                    </span>
                    <span>{new Date(created_at).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Assignments Section */}
                {studentsList.length > 0 ? (
                    <div className="space-y-3 mb-6 bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-2xl">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Atribuído para:</p>
                        <div className="space-y-2">
                            {studentsList.map(studentName => {
                                const daysSet = studentAssignments[studentName]
                                const sortedDays = Array.from(daysSet as Set<number>).sort((a, b) => a - b)
                                return (
                                    <div key={studentName} className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("w-1 h-1 rounded-full", bulletColor)} />
                                            <span className="text-[10px] font-black italic uppercase text-zinc-400 leading-none">{studentName}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 pl-2.5">
                                            {sortedDays.map(day => (
                                                <span key={day} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
                                                    {dayNamesShort[day]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 h-[40px] flex items-center">
                        <span className="text-[10px] bg-zinc-800/50 text-zinc-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest italic border border-zinc-800/30">
                            Livre (Biblioteca)
                        </span>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-center">
                    <Button asChild variant="outline" className={cn(
                        "w-full h-11 bg-zinc-800 border-zinc-700 text-zinc-100 flex items-center justify-center gap-1.5 rounded-full font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6 shadow-none transition-all active:scale-[0.98]",
                        colorScheme === 'emerald' ? "hover:bg-emerald-600 hover:border-emerald-500" : "hover:bg-orange-600 hover:border-orange-500"
                    )}>
                        <Link href={href}>
                            {onEditLabel || `Editar ${type === 'workout' ? 'Treino' : type === 'diet' ? 'Dieta' : 'Protocolo'}`}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

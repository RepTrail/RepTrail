'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"

interface UnifiedLibraryCardProps {
    id: string
    name: string
    description?: string
    studentId: string
    icon: ReactNode
    type: 'workout' | 'diet' | 'cardio' | 'ergogenic'
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
    queryKey: any[]
}

const dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function UnifiedLibraryCard({
    id,
    name,
    description,
    studentId,
    icon,
    type,
    created_at,
    assignments,
    stats,
    href,
    colorScheme = 'orange',
    onEditLabel = 'Editar',
    queryKey
}: UnifiedLibraryCardProps) {
    const assignedDays = (assignments || []).reduce((acc: number[], curr: any) => {
        if (curr.day_of_week !== null && curr.day_of_week !== undefined) {
            acc.push(curr.day_of_week)
        }
        if (curr.days_of_week && Array.isArray(curr.days_of_week)) {
            acc.push(...curr.days_of_week)
        }
        return acc
    }, [])

    const uniqueDays = Array.from(new Set(assignedDays)).sort((a: number, b: number) => a - b);

    const colors = {
        orange: {
            border: "hover:border-orange-500/30",
            icon: "text-orange-500",
            badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            button: "bg-orange-500 hover:bg-orange-400 text-zinc-950 shadow-orange-500/20"
        },
        emerald: {
            border: "hover:border-emerald-500/30",
            icon: "text-emerald-500",
            badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20"
        },
        zinc: {
            border: "hover:border-zinc-500/30",
            icon: "text-zinc-500",
            badge: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
            button: "bg-zinc-800 hover:bg-zinc-700 text-white"
        }
    }[colorScheme]

    return (
        <Card className={cn(
            "bg-zinc-900/50 border-zinc-800 text-zinc-100 transition-all group rounded-3xl overflow-hidden flex flex-col h-full",
            colors.border
        )}>
            <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className={cn("bg-zinc-800 p-2 rounded-lg transition-colors", colors.icon)}>
                        {icon}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DuplicateButton id={id} type={type as any} />
                        <UnifiedDeleteButton
                            id={id}
                            actionType={type === 'diet' ? 'delete-diet' : type === 'workout' ? 'delete-workout' : type === 'cardio' ? 'delete-cardio' : type as any}
                            itemName={name}
                            studentId={studentId}
                            queryKey={queryKey}
                        />
                    </div>
                </div>
                <CardTitle className="mt-4 text-xl font-black text-white group-hover:text-white transition-colors capitalize text-left">
                    {name}
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[10px] font-bold capitalize line-clamp-2 mt-1 text-left">
                    {description || "Sem descrição disponível."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                <div className="flex-1">
                    {uniqueDays.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {uniqueDays.map((day) => (
                                <span key={day} className={cn("flex items-center shrink-0 gap-1 px-2 py-1 text-[9px] font-black uppercase rounded-[0.5rem] border", colors.badge)}>
                                    <Calendar className="w-2.5 h-2.5" />
                                    {dayNamesShort[day % 7]}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 text-zinc-500 text-[9px] font-black uppercase rounded-[0.5rem] border border-zinc-800 mb-6 w-fit">
                            <Calendar className="w-2.5 h-2.5" />
                            Não agendado
                        </div>
                    )}

                    {stats && (
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">
                            <div className="flex items-center gap-1.5">
                                {stats.icon}
                                <span>{stats.value} {stats.label}</span>
                            </div>
                            <span>{created_at ? new Date(created_at).toLocaleDateString('pt-BR') : '-'}</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-800/50">
                    <Button asChild className={cn("w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2", colors.button)}>
                        <Link href={href}>
                            {onEditLabel}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

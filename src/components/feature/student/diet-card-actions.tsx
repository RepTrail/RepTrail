'use client'

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UnifiedAssignDialog } from "@/components/feature/shared/unified-assign-dialog"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"
import Link from "next/link"

interface DietCardActionsProps {
    dietId: string
    userId: string
    assignedDays: number[]
    queryKey?: import('@tanstack/react-query').QueryKey
}

export function DietCardActions({ dietId, userId, assignedDays, queryKey }: DietCardActionsProps) {
    return (
        <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center gap-2">
            <UnifiedAssignDialog
                title="Agendar Dieta"
                description="Escolha os dias da semana para esta dieta."
                itemId={dietId}
                fixedStudentId={userId}
                type="diet"
                initialDays={assignedDays}
                queryKey={queryKey}
                trigger={
                    <Button
                        className="flex-1 min-w-0 w-full h-9 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 px-6"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="truncate">Agendar</span>
                    </Button>
                }
            />
            <Button asChild variant="outline" className="flex-1 min-w-0 w-full h-9 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6">
                <Link href={`/dashboard/student/diet/${dietId}`}>
                    <span className="truncate">Editar</span>
                </Link>
            </Button>
            <DuplicateButton id={dietId} type="diet" className="h-9 w-9" />
        </div>
    )
}

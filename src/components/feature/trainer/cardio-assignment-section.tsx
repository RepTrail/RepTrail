'use client'

import { useState, useEffect } from 'react'
import {
    Activity,
    Clock,
    Timer,
    ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    getCardioLibrary,
    assignCardio,
    removeCardioAssignment,
    getStudentCardioAssignments
} from '@/actions/cardio-actions'
import { Badge } from '@/components/ui/badge'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'

interface CardioAssignmentSectionProps {
    studentId: string
    relationshipId: string
}

const DAYS_MAP = [
    { label: 'Dom', full: 'Domingo' },
    { label: 'Seg', full: 'Segunda-feira' },
    { label: 'Ter', full: 'Terça-feira' },
    { label: 'Qua', full: 'Quarta-feira' },
    { label: 'Qui', full: 'Quinta-feira' },
    { label: 'Sex', full: 'Sexta-feira' },
    { label: 'Sáb', full: 'Sábado' },
]

export function CardioAssignmentSection({ studentId, relationshipId }: CardioAssignmentSectionProps) {
    const [assignments, setAssignments] = useState<any[]>([])
    const [library, setLibrary] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        try {
            const [a, l] = await Promise.all([
                getStudentCardioAssignments(studentId),
                getCardioLibrary()
            ])
            setAssignments(a)
            setLibrary(l)
        } catch (error) {
            console.error('CRITICAL: Error in CardioAssignmentSection loadData:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                    Cardios Atribuídos
                </h3>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                </div>
            ) : assignments.length > 0 ? (
                <div className="space-y-4">
                    {assignments.map((a) => (
                        <div
                            key={a.id}
                            className="bg-zinc-900/40 border border-zinc-800/50 shadow-none rounded-3xl overflow-hidden backdrop-blur-sm group hover:border-orange-500/30 transition-all duration-300"
                        >
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-orange-500/20 transition-all">
                                        <Activity className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-zinc-100 text-sm font-black uppercase italic tracking-wide">{a.cardio?.name}</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3 pb-4">
                                                <span className="flex items-center gap-1 text-[9px] font-black text-zinc-500 uppercase">
                                                    <Timer className="w-3 h-3" /> {a.duration_minutes} min
                                                </span>
                                                <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/10 text-[8px] font-black uppercase px-2 py-0">
                                                    {a.suggest_intensity}
                                                </Badge>
                                            </div>
                                            {a.days_of_week && a.days_of_week.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {a.days_of_week.map((d: number) => (
                                                        <span key={d} className="text-[7px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                            {DAYS_MAP[d]?.label || d}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <UnifiedDeleteButton
                                    id={a.id}
                                    actionType="cardio"
                                    itemName={a.cardio?.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">Nenhum cardio atribuído</p>
                </div>
            )}
        </div>
    )
}

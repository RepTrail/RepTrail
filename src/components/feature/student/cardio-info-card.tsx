'use client'

import { Activity, Flame, Zap, Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CardioInfoCardProps {
    assignment: any
}

export function CardioInfoCard({ assignment }: CardioInfoCardProps) {
    const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    return (
        <Card className="group relative bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10 hover:border-orange-500/20 transition-all duration-500">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Flame className="w-32 h-32 text-orange-500" />
            </div>

            <CardContent className="p-8 relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                <Activity className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors">
                                    {assignment.cardio?.name || 'Cardio'}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={`w-3 h-1 rounded-full ${i <= (assignment.suggested_intensity === 'High' ? 3 : assignment.suggested_intensity === 'Moderate' ? 2 : 1) ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Intensidade {assignment.suggested_intensity}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                                    {assignment.duration_minutes} MINUTOS
                                </span>
                            </div>

                            {assignment.day_of_week !== undefined && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                                        {dayNamesShort[assignment.day_of_week]}
                                    </span>
                                </div>
                            )}

                            {assignment.days_of_week && Array.isArray(assignment.days_of_week) && (
                                <div className="flex gap-1">
                                    {assignment.days_of_week.map((d: number) => (
                                        <div key={d} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                                                {dayNamesShort[d]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 p-3 bg-zinc-950/30 rounded-2xl border border-zinc-800/50 min-w-[80px]">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">KCAL EST.</span>
                            <span className="text-sm font-black text-white italic">~{assignment.duration_minutes * 8}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-zinc-950/40 border border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Instruções do Treinador</span>
                    </div>
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed italic border-l-2 border-zinc-800 pl-4">
                        {assignment.cardio?.description || "Mantenha a intensidade prescrita para otimizar os resultados cardiovasculares e a queima lipídica."}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

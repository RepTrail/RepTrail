'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentErgogenics } from '@/actions/ergogenics-actions'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Syringe } from 'lucide-react'
import { ErgogenicCheckButton } from '@/components/feature/student/ergogenic-check-button'
import { getTodayRangeBrazil } from '@/lib/date-utils'

interface ErgogenicsCardProps {
    userId: string
}

export function ErgogenicsCard({ userId }: ErgogenicsCardProps) {
    const { data: status } = useQuery({
        queryKey: ['student-details', userId],
        queryFn: async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('student_details')
                .select('steroid_use')
                .eq('id', userId)
                .single()
            return data
        }
    })

    const { data: rawErgogenics, isLoading } = useQuery({
        queryKey: ['student-ergogenics', userId],
        enabled: !!status?.steroid_use,
        queryFn: () => getStudentErgogenics(userId),
    })

    const { data: ergoLogs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['today-ergo-logs', userId],
        enabled: !!status?.steroid_use,
        queryFn: async () => {
            const supabase = createClient()
            const { start, end } = getTodayRangeBrazil()
            const { data } = await supabase
                .from('ergogenic_logs')
                .select('ergogenic_id')
                .eq('student_id', userId)
                .gte('created_at', start)
                .lte('created_at', end)
            return data || []
        }
    })

    if (!status?.steroid_use) return null

    if (isLoading || isLoadingLogs) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-6 rounded-[2rem] backdrop-blur-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32 bg-zinc-800/50" />
                                    <Skeleton className="h-3 w-20 bg-zinc-800/50" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-xl bg-zinc-800/50" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const today = tzNow.getDay()
    const loggedErgoIds = new Set(ergoLogs?.map((l: any) => l.ergogenic_id) || [])

    const todaysErgogenics = rawErgogenics?.data?.filter((e: any) =>
        e.application_days && Array.isArray(e.application_days) && e.application_days.includes(today)
    ) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Syringe className="w-4 h-4 text-orange-500" />
                    Ergogênicos do Dia
                </h2>
            </div>

            {todaysErgogenics.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {todaysErgogenics.map((erg: any) => (
                        <div key={erg.id} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] backdrop-blur-sm space-y-4 hover:border-orange-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight line-clamp-1">
                                        {erg.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {(erg.weekly_dosage / (erg.application_days?.length || 1)).toFixed(2)} {erg.unit}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <ErgogenicCheckButton
                                        studentId={userId}
                                        ergogenicId={erg.id}
                                        initialChecked={loggedErgoIds.has(erg.id)}
                                    />
                                </div>
                            </div>
                            {erg.notes && (
                                <div className="pt-4 border-t border-zinc-800/50">
                                    <p className="text-[10px] text-zinc-400 font-medium italic line-clamp-2">
                                        "{erg.notes}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
                    <Syringe className="w-8 h-8 text-zinc-700" />
                    <div className="space-y-1">
                        <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhuma aplicação hoje</p>
                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">
                            Curta seu dia de descanso dos ergogênicos.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

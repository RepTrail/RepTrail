'use client'

import { getStudentErgogenics, getErgogenicLogs } from '@/actions/ergogenics-actions'
import { getTodayRangeBrazil } from '@/lib/date-utils'
import { getStudentProfile } from '@/actions/student-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Syringe } from 'lucide-react'
import { ErgogenicCheckButton } from '@/components/feature/student/ergogenic-check-button'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'

interface ErgogenicsCardProps {
    userId: string
}

export function ErgogenicsCard({ userId }: ErgogenicsCardProps) {
    useRealtimeSync({
        table: 'ergogenics',
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'ergogenic_logs',
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        enabled: !!userId,
    })

    const { data: rawErgogenics = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        enabled: !!userId && !!profile?.details?.steroid_use,
        queryFn: async () => {
            const res = await getStudentErgogenics(userId)
            if ('error' in res) throw new Error(res.error)
            return res.data || []
        },
    })

    const { data: ergoLogs = [], isLoading: isLoadingLogs } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        enabled: !!userId && !!profile?.details?.steroid_use,
        queryFn: async () => {
            const res = await getErgogenicLogs(userId)
            if ('error' in res) throw new Error(res.error)
            return res.data || []
        }
    })

    if (profile && !profile.details?.steroid_use) return null

    // Skeleton Fallback: Only show if loading AND no cache available
    if ((isLoading || isLoadingLogs) && (!rawErgogenics || (Array.isArray(rawErgogenics) && rawErgogenics.length === 0))) {
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
                        <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-6 sm:p-10 rounded-3xl backdrop-blur-sm space-y-4">
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

    const { start, end } = getTodayRangeBrazil()
    const logs = Array.isArray(ergoLogs) ? ergoLogs : []

    // Filter logs for today only
    const loggedErgoIds = new Set(
        logs
            .filter((l: any) => l.created_at >= start && l.created_at <= end)
            .map((l: any) => l.ergogenic_id)
    )

    const ergogenicsList = Array.isArray(rawErgogenics) ? rawErgogenics : []
    const todaysErgogenics = ergogenicsList.filter((e: any) =>
        e.application_days && Array.isArray(e.application_days) && e.application_days.includes(today)
    )


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Syringe className="w-4 h-4 text-orange-500" />
                    Ergogênicos do Dia
                </h2>
            </div>

            {todaysErgogenics.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1">
                    {todaysErgogenics.map((erg: any) => (
                        <div key={erg.id} className="bg-zinc-900/40 border border-zinc-800/50 p-6 sm:p-10 rounded-3xl backdrop-blur-sm space-y-4 hover:border-orange-500/30 transition-all duration-300">
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
                <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl py-16 flex flex-col items-center justify-center text-center space-y-4">
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

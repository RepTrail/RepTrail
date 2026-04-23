'use client'

import { getStudentErgogenics, getTodayErgogenicLogs } from '@/actions/ergogenics-actions'
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
    // ── Realtime Sync ──────────────────────────────────────────────────────────
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

    // ── Data Fetching ──────────────────────────────────────────────────────────
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 60,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const { data: rawErgogenics, isLoading } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        queryFn: async () => {
            const res = await getStudentErgogenics(userId)
            return (res as any[]) || []
        },
        staleTime: 1000 * 60,
    })

    const { data: ergoLogs = [], isLoading: isLoadingLogs } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        queryFn: () => getTodayErgogenicLogs(userId),
        staleTime: 1000 * 60,
    })

    // ── Steroid guard (hide card if user doesn't use steroids) ────────────────
    if (profile && profile.details && !profile.details?.steroid_use) return null

    // ── Skeleton while loading ────────────────────────────────────────────────
    if ((isLoading || isLoadingLogs) && !rawErgogenics?.length) {
        return <ErgogenicsCard.Skeleton />
    }

    // ── Day/Log Calculation ───────────────────────────────────────────────────
    const today = (() => {
        try {
            const brazilTime = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
            return new Date(brazilTime).getDay()
        } catch {
            return new Date().getDay()
        }
    })()

    const { start, end } = getTodayRangeBrazil()
    const logs = Array.isArray(ergoLogs) ? ergoLogs : []

    const loggedErgoIds = new Set(
        logs
            .filter((l: any) => l.created_at >= start && l.created_at <= end)
            .map((l: any) => l.ergogenic_id)
    )

    const ergogenicsList = Array.isArray(rawErgogenics) ? rawErgogenics : []

    const todaysErgogenics = ergogenicsList.filter((e: any) => {
        const days = Array.isArray(e.application_days) ? e.application_days : []
        return days.map((d: any) => Number(d)).includes(today)
    })

    // ── Render ────────────────────────────────────────────────────────────────
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

ErgogenicsCard.Skeleton = function ErgogenicsCardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] opacity-50">
                    <Syringe className="w-4 h-4 text-orange-500/50" />
                    Ergogênicos do Dia
                </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-1">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 sm:p-10 rounded-3xl backdrop-blur-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48 bg-zinc-800/50" />
                                <Skeleton className="h-3 w-24 bg-zinc-800/50" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-xl bg-zinc-800/50" />
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50">
                            <Skeleton className="h-3 w-full max-w-sm bg-zinc-800/50" />
                            <Skeleton className="h-3 w-2/3 bg-zinc-800/50 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

'use client';
import { getStudentErgogenics, getTodayErgogenicLogs } from '@/actions/ergogenics-actions'
import { getTodayRangeBrazil } from '@/lib/date-utils'
import { getStudentProfile } from '@/actions/student-actions'
import { Syringe } from 'lucide-react'
import { ErgogenicCheckButton } from './ergogenic-check-button'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from "../constants/tokens";

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

    // ── Loading Fallback ────────────────────────────────────────────────
    if ((isLoading || isLoadingLogs) && !rawErgogenics?.length) {
        return null
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
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <div className="flex items-center justify-between px-2">
                <Font variant="sub-tiny" weight="black" color="white" uppercase tracking="widest" className="flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-orange-500" />
                    Ergogênicos do Dia
                </Font>
            </div>
            {todaysErgogenics.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {todaysErgogenics.map((erg: any) => {
                            const isChecked = erg?.id ? loggedErgoIds.has(erg.id) : false
                            return (
                                <div key={erg?.id || Math.random()} className={`group relative rounded-system border transition-all duration-300 overflow-hidden ${
                                    isChecked 
                                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                                        : 'bg-zinc-950/20 border-zinc-900 hover:border-zinc-800'
                                }`}>
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <ErgogenicCheckButton
                                                studentId={userId}
                                                ergogenicId={erg.id}
                                                initialChecked={isChecked}
                                            />
                                            <div>
                                                <h4 className="text-sm font-black text-zinc-100 uppercase italic tracking-wide">{erg.name}</h4>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                                    DOSAGEM: {(erg.weekly_dosage / (erg.application_days?.length || 1)).toFixed(2)} {erg.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {erg.notes && (
                                        <div className="px-5 pb-5 pt-0">
                                            <div className="h-px w-full bg-zinc-800/50 mb-3" />
                                            <p className="text-[10px] text-zinc-400 font-medium italic line-clamp-2">
                                                "{erg.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
            ) : (
                <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-system py-16 flex flex-col items-center justify-center text-center space-y-4">
                    <Syringe className="w-8 h-8 text-zinc-700" />
                    <div className="space-y-1">
                        <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Nenhuma aplicação hoje</p>
                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">
                            Curta seu dia de descanso dos ergogênicos.
                        </p>
                    </div>
                </div>
            )}
        </Stack>
    );
}
